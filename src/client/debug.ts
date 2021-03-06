export function getDebugParams() {
  const params = new URLSearchParams(window.location.search);
  const debug = params.has('debug');
  const name = params.get('name') || 'Anon';

  return { debug, name };
}
