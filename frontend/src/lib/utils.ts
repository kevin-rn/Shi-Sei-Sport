/**
 * Extracts a plain-text excerpt from a Payload CMS rich-text field (Lexical or Slate format),
 * truncating at the nearest word boundary if the text exceeds the character limit.
 */
export const getExcerpt = (content: any, limit: number = 150): string => {
  if (!content) return '';

  const extractText = (node: any): string => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (node.text) return node.text;
    if (node.children && Array.isArray(node.children)) {
      return node.children.map(extractText).join(' ');
    }
    return '';
  };

  let fullText = '';

  // Payload uses either an array (Slate) or an object with a root node (Lexical)
  if (Array.isArray(content)) {
    fullText = content.map(extractText).join(' ');
  } else if (content.root && content.root.children) {
    fullText = extractText(content.root);
  }

  fullText = fullText.replace(/\s+/g, ' ').trim();

  if (fullText.length <= limit) return fullText;

  const truncated = fullText.substring(0, limit);
  return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
};