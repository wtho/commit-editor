import type { Config } from "../../types"
import type { EditorContext } from "./monaco-language"
import type { monaco } from "../monaco"
import { getRuleValue, hasRuleAlways } from "./utils"

export const getCurrentLenses = (
  config: Config = {},
  editorContext: EditorContext,
  model: monaco.editor.ITextModel
) => {
  const firstLineLength = model.getLineLength(1)
  const lenses: monaco.languages.CodeLens[] = []
  let hasMaxLength = hasRuleAlways(config?.rules, 'header-max-length')
  const maxLength = getRuleValue<number>(config?.rules, 'header-max-length')
  if (typeof maxLength !== 'number' || isNaN(maxLength)) {
    hasMaxLength = false
  }
  if (editorContext?.commandIds?.nullCommand) {
    lenses.push({
      range: {
        startLineNumber: 1,
        endLineNumber: 1,
        startColumn: 0,
        endColumn: 1,
      },
      id: 'header-codelens',
      command: {
        id: editorContext.commandIds.nullCommand,
        title: `Header ${firstLineLength}${
          hasMaxLength ? ` / ${maxLength}` : ''
        } chars`,
      },
    })
    // TODO: body lens
    // TODO: footer lens (click to generate/delete default footer)
  }
  return lenses
}
