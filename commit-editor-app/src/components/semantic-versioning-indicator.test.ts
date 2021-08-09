import { render } from '@testing-library/vue'
import SemanticVersioningIndicator from './semantic-versioning-indicator.vue'
import { tabStoreSymbol } from '../stores/tab.store'

describe('semantic-versioning-indicator.vue', () => {
  test('does display v1.2.4 if no sem ver update is triggered', () => {

    const tabStoreMock = {
      state: {
        messageSemVerUpdateState: {
          major: false,
          minor: false,
          patch: false,
        }
      }
    }

    const { getByText } = render(SemanticVersioningIndicator, {
      global: {
        provide: {
          [tabStoreSymbol]: tabStoreMock
        }
      }
    })

    getByText('1.2.4')
  })

  test('does display v1.2.4 if no state is provided', () => {

    const { getByText } = render(SemanticVersioningIndicator, {
      global: {
        provide: {
        }
      }
    })

    getByText('1.2.4')
  })

  test('does display v1.2.⚡ if patch update is provided', () => {

    const tabStoreMock = {
      state: {
        messageSemVerUpdateState: {
          major: false,
          minor: false,
          patch: true,
        }
      }
    }

    const { getByText, findByAltText } = render(SemanticVersioningIndicator, {
      global: {
        provide: {
          [tabStoreSymbol]: tabStoreMock
        }
      }
    })

    getByText('1.2.')
    findByAltText('A flash icon indicating a version update')
  })

  test('does display v1.⚡.0 if minor update is provided', () => {

    const tabStoreMock = {
      state: {
        messageSemVerUpdateState: {
          major: false,
          minor: true,
          patch: false,
        }
      }
    }

    const { getByText, findByAltText } = render(SemanticVersioningIndicator, {
      global: {
        provide: {
          [tabStoreSymbol]: tabStoreMock
        }
      }
    })

    getByText('1..0')
    findByAltText('A flash icon indicating a version update')
  })

  test('does display v⚡.0.0 if major update is provided', () => {

    const tabStoreMock = {
      state: {
        messageSemVerUpdateState: {
          major: true,
          minor: false,
          patch: false,
        }
      }
    }

    const { getByText, findByAltText } = render(SemanticVersioningIndicator, {
      global: {
        provide: {
          [tabStoreSymbol]: tabStoreMock
        }
      }
    })

    findByAltText('A flash icon indicating a version update')
    getByText('.0.0')
  })
})
