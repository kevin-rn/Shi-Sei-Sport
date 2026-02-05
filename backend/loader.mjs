// Custom ESM loader to ignore CSS imports during Payload's generate:importmap
// This prevents the ERR_UNKNOWN_FILE_EXTENSION error when processing react-image-crop
export function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return {
      format: 'module',
      shortCircuit: true,
      url: 'data:text/javascript,export default {}',
    }
  }
  
  return nextResolve(specifier, context)
}
