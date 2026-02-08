// Custom ESM loader to ignore CSS imports during Payload's generate:importmap
// This prevents the ERR_UNKNOWN_FILE_EXTENSION error when processing react-image-crop

// Tries to intercept .css imports early and convert them to a data URI
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


// Catches any .css file URLs that slipped past resolve (Fixes your specific error)
export async function load(url, context, nextLoad) {
  if (url.endsWith('.css')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default {}',
    }
  }
  return nextLoad(url, context, nextLoad)
}