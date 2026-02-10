/**
 * Recursively normalizes all nodes in a Lexical JSON tree,
 * ensuring strict compliance with Lexical's schema requirements.
 * * Fixes "Minified Lexical error #117" by ensuring 'mode' exists on TextNodes.
 */
export const normalizeLexical = (node: any): any => {
  if (!node || typeof node !== 'object') return node
  
  // Handle arrays (children)
  if (Array.isArray(node)) {
    return node.map(normalizeLexical)
  }

  // Create a copy to avoid mutating the original reference unexpectedly
  const normalized = { ...node }

  // 1. Universal defaults
  normalized.version = normalized.version ?? 1

  // 2. Block Node Defaults
  if (['root', 'paragraph', 'heading', 'quote', 'list', 'listitem'].includes(normalized.type)) {
    normalized.format = normalized.format ?? ''
    normalized.indent = normalized.indent ?? 0
    normalized.direction = normalized.direction ?? 'ltr'
  }

  // 3. Text Node Defaults (Fixes error #117)
  if (normalized.type === 'text') {
    normalized.detail = normalized.detail ?? 0
    normalized.format = normalized.format ?? 0
    normalized.mode = normalized.mode ?? 'normal'
    normalized.style = normalized.style ?? ''
  }

  // 4. List Specifics
  if (normalized.type === 'list') {
    normalized.listType = normalized.listType ?? 'bullet'
    normalized.tag = normalized.tag ?? 'ul'
    normalized.start = normalized.start ?? 1
  }

  if (normalized.type === 'listitem') {
    normalized.value = normalized.value ?? 1
  }

  // 5. Recursion for Children
  if (normalized.children) {
    normalized.children = normalized.children.map(normalizeLexical)
  }

  // 6. Recursion for Root Wrapper (if the object passed is the EditorState)
  if (normalized.root) {
    normalized.root = normalizeLexical(normalized.root)
  }

  return normalized
}

/**
 * Transforms a plain string into the JSON structure required by the Lexical editor.
 */
export const formatLexical = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            type: 'text',
            version: 1,
          },
        ],
      },
    ],
  },
})