import { createApp } from 'vue'
import CommitEditor from './commit-editor.vue'
import { parseUrlParams } from './lib/parse-from-location'
import { WebSocketHandler } from './lib/web-socket'
import {
  commitEditorStoreSymbol,
  createCommitEditorStore,
} from './stores/commit-editor.store'

const parsedUrlParams = parseUrlParams()
if ((parsedUrlParams?.errors?.length ?? 0) < 1) {
  window.history.replaceState({}, document.title, '/')
}

createApp(CommitEditor)
  .provide(
    commitEditorStoreSymbol,
    createCommitEditorStore({
      configEditorOpen: true,
      openedWithParams: !!parsedUrlParams,
      urlParamMessage: parsedUrlParams?.message,
      urlParamConfig: parsedUrlParams?.config,
      webSocketHandler: new WebSocketHandler(location.protocol, location.host),
    })
  )
  .mount('#commit-editor')

