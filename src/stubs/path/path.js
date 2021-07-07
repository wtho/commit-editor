const global = globalThis || window;
global.__dirname = '/browser'

export function resolve(...segments) {
  return [__dirname, ...segments].map(seg => seg.replace(/^(\.)\/+|\/+$/g, '')).join('/')
}
