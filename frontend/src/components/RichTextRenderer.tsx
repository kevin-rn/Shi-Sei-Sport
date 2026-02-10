import React from 'react';
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';

interface RichTextRendererProps {
  content: SerializedEditorState | null | undefined;
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
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
      // Gebruik React.ElementType om TS te laten weten dat dit een geldige tag is
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
      return (
        <ListTag key={index} className="mb-3 ml-6 list-disc">
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

    if (node.type === 'link') {
      const linkNode = node as any;
      return (
        <a 
          key={index} 
          href={linkNode.url} 
          target={linkNode.newTab ? '_blank' : undefined}
          rel={linkNode.newTab ? 'noopener noreferrer' : undefined}
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