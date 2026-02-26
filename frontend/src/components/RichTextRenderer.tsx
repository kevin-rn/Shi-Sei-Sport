import React from 'react';
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import { getYouTubeEmbedUrl, getImageUrl } from '../lib/api';
import { ZoomIn } from 'lucide-react';
import { LazyImage } from './LazyImage';

interface RichTextRendererProps {
  content: SerializedEditorState | null | undefined;
  className?: string;
  onImageClick?: (url: string, alt: string) => void;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '', onImageClick }) => {
  if (!content || !content.root) {
    return null;
  }

  const renderNode = (node: SerializedLexicalNode, index: number): React.ReactNode => {
    if (node.type === 'paragraph') {
      const paragraphNode = node as any;
      return (
        <p key={index} className="mb-3">
          {paragraphNode.children?.map((child: any, childIndex: number) => renderNode(child, childIndex))}
        </p>
      );
    }

    if (node.type === 'text') {
      const textNode = node as any;
      let textContent: React.ReactNode = textNode.text;
      
      if (textNode.format) {
        if (textNode.format & 1) { // bold
          textContent = <strong key={`b-${index}`}>{textContent}</strong>;
        }
        if (textNode.format & 2) { // italic
          textContent = <em key={`i-${index}`}>{textContent}</em>;
        }
        if (textNode.format & 8) { // underline
          textContent = <u key={`u-${index}`}>{textContent}</u>;
        }
      }
      
      return <span key={index}>{textContent}</span>;
    }

    if (node.type === 'heading') {
      const headingNode = node as any;
      const Tag = headingNode.tag as React.ElementType;
      return (
        <Tag key={index} className="font-bold mb-2">
          {headingNode.children?.map((child: any, childIndex: number) => renderNode(child, childIndex))}
        </Tag>
      );
    }

    if (node.type === 'list') {
      const listNode = node as any;
      const ListTag = (listNode.listType === 'bullet' ? 'ul' : 'ol') as React.ElementType;
      const listClass = listNode.listType === 'bullet' ? 'list-disc' : 'list-decimal';
      return (
        <ListTag key={index} className={`mb-3 ml-6 ${listClass}`}>
          {listNode.children?.map((child: any, childIndex: number) => renderNode(child, childIndex))}
        </ListTag>
      );
    }

    if (node.type === 'listitem') {
      const listItemNode = node as any;
      return (
        <li key={index}>
          {listItemNode.children?.map((child: any, childIndex: number) => renderNode(child, childIndex))}
        </li>
      );
    }

    if (node.type === 'upload') {
      const uploadNode = node as any;
      const value = uploadNode.value;
      if (!value) return null;

      if (uploadNode.relationTo === 'video-embeds') {
        return (
          <div key={index} className="relative w-full my-4" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={getYouTubeEmbedUrl(value.embedUrl)}
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
              media={value}
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

    if (node.type === 'link') {
      const linkNode = node as any;
      const href = linkNode.fields?.url ?? linkNode.url;
      const newTab = linkNode.fields?.newTab ?? linkNode.newTab;
      return (
        <a
          key={index}
          href={href}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="text-judo-red hover:underline"
        >
          {linkNode.children?.map((child: any, childIndex: number) => renderNode(child, childIndex))}
        </a>
      );
    }

    return null;
  };

  return (
    <div className={className}>
      {content.root.children?.map((child: any, index: number) => renderNode(child, index))}
    </div>
  );
};