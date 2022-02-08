import type { monaco } from "../monaco";

export const theme: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'header-type', foreground: '00ffe9', fontStyle: 'bold' },
    { token: 'header-unknown-type', foreground: '00cebd' },
    { token: 'header-scope', foreground: '00c3ff', fontStyle: 'bold' },
    { token: 'header-unknown-scope', foreground: '00a4d6' },
    {
      token: 'header-breaking-exclamation-mark',
      foreground: 'fe5196',
      fontStyle: 'bold',
    },
    { token: 'header-description', foreground: 'ffffff' },
    { token: 'comment', foreground: 'aaaaaa' },
    { token: 'empty-line', foreground: 'ff0000' },
    {
      token: 'breaking-keyword',
      foreground: 'fe5196',
      fontStyle: 'bold',
    },
  ],
  colors: {},
}
