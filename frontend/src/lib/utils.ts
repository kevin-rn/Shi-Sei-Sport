export const getExcerpt = (content: any, limit: number = 150): string => {
  if (!content) return '';

  // Functie om tekst recursief uit nodes te halen
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

  // Payload gebruikt vaak een array (Slate) of een object met root (Lexical)
  if (Array.isArray(content)) {
    fullText = content.map(extractText).join(' ');
  } else if (content.root && content.root.children) {
    fullText = extractText(content.root);
  }

  // Spaties opschonen
  fullText = fullText.replace(/\s+/g, ' ').trim();

  // Als de tekst kort genoeg is, direct teruggeven
  if (fullText.length <= limit) return fullText;

  // Afkappen zonder midden in een woord te eindigen
  const truncated = fullText.substring(0, limit);
  return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
};