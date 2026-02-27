import React from 'react';
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import { getYouTubeEmbedUrl, getImageUrl } from '../lib/api';
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
  value?: {
    url?: string;
    alt?: string;
    caption?: string;
    embedUrl?: string;
    title?: string;
    sizes?: Record<string, { url?: string | null }>;
  };
  relationTo?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '', onImageClick }) => {
  if (!content || !content.root) {
    return null;
  }

  const renderNode = (node: SerializedLexicalNode, index: number): React.ReactNode => {
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

      if (n.relationTo === 'video-embeds') {
        return (
          <div key={index} className="relative w-full my-4" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={getYouTubeEmbedUrl(value.embedUrl ?? '')}
              title={value.title || ''}
              className="absolute inset-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }

      const imageUrl = getImageUrl(value);
      const imageAlt = value.alt || '';
      return (
        <figure key={index} className="my-4">
          <div
            className={`relative rounded-lg overflow-hidden${onImageClick && imageUrl ? ' cursor-zoom-in group' : ''}`}
            onClick={() => onImageClick && imageUrl && onImageClick(imageUrl, imageAlt)}
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
          {value.caption && (
            <figcaption className="text-sm text-judo-gray text-center mt-2">{value.caption}</figcaption>
          )}
        </figure>
      );
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

  return (
    <div className={className}>
      {content.root.children?.map((child, index) => renderNode(child as SerializedLexicalNode, index))}
    </div>
  );
};
