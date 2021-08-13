import { monaco } from './monaco'

jest.mock('monaco-editor', () => ({ editor: 'editor-mock' }), {virtual: true})
jest.mock('monaco-editor/esm/vs/editor/editor.worker?worker', () => (class EditorWorker { type = 'editor' }), {virtual: true})
jest.mock('monaco-editor/esm/vs/language/json/json.worker?worker', () => (class JsonWorker { type = 'json' }), {virtual: true})

describe('monaco.ts', () => {
  test('monaco should exist', () => {
    expect(monaco.editor).toEqual('editor-mock')
  })

  test('getWorker returns jsonWorker for label "json"', () => {
    // @ts-ignore
    const worker = self.MonacoEnvironment.getWorker('', 'json')

    expect(worker).toBeTruthy()
    expect(worker.type).toEqual('json')
  })

  test('getWorker returns editorWorker for  any other label than "json"', () => {
    // @ts-ignore
    const worker = self.MonacoEnvironment.getWorker('', 'whatever')

    expect(worker).toBeTruthy()
    expect(worker.type).toEqual('editor')
  })
})
