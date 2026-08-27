export const SITE_URL = 'https://tools.realtime-ai.chat';

/** Convert a repository HTML file path to its final clean URL pathname. */
export function publicPath(filePath) {
  const normalized = `/${String(filePath).replace(/^\/+/, '')}`;
  if (normalized === '/index.html') return '/';
  if (normalized.endsWith('/index.html')) {
    return normalized.slice(0, -'index.html'.length);
  }
  if (normalized.endsWith('.html')) {
    return normalized.slice(0, -'.html'.length);
  }
  return normalized;
}

export function publicUrl(filePath) {
  return `${SITE_URL}${publicPath(filePath)}`;
}

export function publicRelativePath(filePath) {
  return publicPath(filePath).replace(/^\//, '');
}
