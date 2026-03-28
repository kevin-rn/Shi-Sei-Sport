import React from 'react';
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import { getVideoEmbedUrl, getImageUrl } from '../lib/api';
import { ZoomIn } from 'lucide-react';
import { LazyImage } from './LazyImage';
import type { Media } from '../types/payload-types';

interface RichTextRendererProps {
  content: SerializedEditorState | null | undefined;
  className?: string;
  onImageClick?: (url: string, alt: string) => void;
}

// Extended node types for Lexical serialized nodes with Payload CMS fields
interface LexicalNodeWithChildren extends SerializedLexicalNode {
  children?: SerializedLexicalNode[];
  text?: string;
  format?: number;
  tag?: string;
  listType?: string;
  url?: string;
  newTab?: boolean;
  fields?: { url?: string; newTab?: boolean };
  // Upload node: `value` is the populated Media document; extra UploadFeature fields are siblings
  value?: {
    url?: string;
    alt?: string;
    sizes?: Record<string, { url?: string | null }>;
  };
  // UploadFeature extra fields (stored at node level, not inside value)
  caption?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  relationTo?: string;
}

function groupChildren(nodes: SerializedLexicalNode[]): (SerializedLexicalNode | SerializedLexicalNode[])[] {
  const result: (SerializedLexicalNode | SerializedLexicalNode[])[] = [];
  let i = 0;
  while (i < nodes.length) {
    const n = nodes[i] as LexicalNodeWithChildren;
    if (n.type === 'upload' && (n.size ?? 'medium') !== 'full') {
      const group: SerializedLexicalNode[] = [nodes[i]];
      while (i + 1 < nodes.length) {
        const next = nodes[i + 1] as LexicalNodeWithChildren;
        if (next.type === 'upload' && (next.size ?? 'medium') !== 'full') {
          group.push(nodes[++i]);
        } else break;
      }
      result.push(group.length > 1 ? group : group[0]);
    } else {
      result.push(nodes[i]);
    }
    i++;
  }
  return result;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '', onImageClick }) => {
  if (!content || !content.root) {
    return null;
  }

  const renderNode = (node: SerializedLexicalNode, index: number, inGroup = false): React.ReactNode => {
    const n = node as LexicalNodeWithChildren;

    if (n.type === 'paragraph') {
      return (
        <p key={index} className="mb-3">
          {n.children?.map((child, childIndex) => renderNode(child, childIndex))}
        </p>
      );
    }

    if (n.type === 'text') {
      let textContent: React.ReactNode = n.text;

      if (n.format) {
        if (n.format & 1) { // bold
          textContent = <strong key={`b-${index}`}>{textContent}</strong>;
        }
        if (n.format & 2) { // italic
          textContent = <em key={`i-${index}`}>{textContent}</em>;
        }
        if (n.format & 8) { // underline
          textContent = <u key={`u-${index}`}>{textContent}</u>;
        }
      }

      return <span key={index}>{textContent}</span>;
    }

    if (n.type === 'heading') {
      const Tag = n.tag as React.ElementType;
      return (
        <Tag key={index} className="font-bold mb-2">
          {n.children?.map((child, childIndex) => renderNode(child, childIndex))}
        </Tag>
      );
    }

    if (n.type === 'list') {
      const ListTag = (n.listType === 'bullet' ? 'ul' : 'ol') as React.ElementType;
      const listClass = n.listType === 'bullet' ? 'list-disc' : 'list-decimal';
      return (
        <ListTag key={index} className={`mb-3 ml-6 ${listClass}`}>
          {n.children?.map((child, childIndex) => renderNode(child, childIndex))}
        </ListTag>
      );
    }

    if (n.type === 'listitem') {
      return (
        <li key={index}>
          {n.children?.map((child, childIndex) => renderNode(child, childIndex))}
        </li>
      );
    }

    if (n.type === 'upload') {
      const value = n.value;
      if (!value) return null;

      const imageUrl = getImageUrl(value);
      const imageAlt = value.alt || '';
      const sizeClasses: Record<string, string> = {
        small: 'max-w-xs mx-auto',
        medium: 'max-w-md mx-auto',
        large: 'max-w-2xl mx-auto',
        full: 'w-full',
      };
      const sizeClass = sizeClasses[n.size ?? 'medium'] ?? sizeClasses.medium;
      const figClass = inGroup ? 'flex-1 min-w-[140px]' : `my-4 ${sizeClass}`;
      return (
        <figure key={index} className={figClass}>
          <div
            className={`relative rounded-lg overflow-hidden${onImageClick && imageUrl ? ' cursor-zoom-in group' : ''}`}
            onClick={() => onImageClick && imageUrl && onImageClick(imageUrl, imageAlt)}
            role={onImageClick && imageUrl ? 'button' : undefined}
            tabIndex={onImageClick && imageUrl ? 0 : undefined}
            onKeyDown={onImageClick && imageUrl ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onImageClick(imageUrl, imageAlt); } } : undefined}
          >
            <LazyImage
              media={value as unknown as Media}
              size="thumbnail"
              alt={imageAlt}
              className="w-full rounded-lg"
              style={{ height: 'auto' }}
            />
            {onImageClick && imageUrl && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
          </div>
          {n.caption && (
            <figcaption className="text-sm text-judo-gray text-center mt-2">{n.caption}</figcaption>
          )}
        </figure>
      );
    }

    if (n.type === 'block') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fields = (n as any).fields;
      if (fields?.blockType === 'videoEmbed' && fields?.url) {
        return (
          <figure key={index} className="my-4">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={getVideoEmbedUrl(fields.url as string)}
                title={fields.caption as string || 'Video'}
                className="absolute inset-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {fields.caption && (
              <figcaption className="text-sm text-judo-gray text-center mt-2">{fields.caption as string}</figcaption>
            )}
          </figure>
        );
      }
      return null;
    }

    if (n.type === 'link') {
      const href = n.fields?.url ?? n.url;
      const newTab = n.fields?.newTab ?? n.newTab;
      return (
        <a
          key={index}
          href={href}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="text-judo-red hover:underline"
        >
          {n.children?.map((child, childIndex) => renderNode(child, childIndex))}
        </a>
      );
    }

    return null;
  };

  const grouped = groupChildren((content.root.children ?? []) as SerializedLexicalNode[]);

  return (
    <div className={className}>
      {grouped.map((item, index) =>
        Array.isArray(item) ? (
          <div key={`img-row-${index}`} className="flex flex-wrap gap-3 my-4 items-start">
            {item.map((node, i) => renderNode(node, i, true))}
          </div>
        ) : renderNode(item as SerializedLexicalNode, index)
      )}
    </div>
  );
};
