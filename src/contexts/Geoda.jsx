import { createContext, useState, useRef, useEffect, useContext } from 'react'
import { wrap } from 'comlink'
const geodaWorker = wrap(
  new Worker(new URL('../workers/geoda', import.meta.url))
)
export const GeodaContext = createContext({})

/**
 * React context provider for accessing jsgeoda web worker. All functions are
 * async. For jsgeoda api, see https://www.npmjs.com/package/jsgeoda
 *
 * @category Contexts
 * @example
 *   function App() {
 *     return (
 *       <GeodaProvider>
 *         <MyComponents />
 *       </GeodaProvider>
 *     )
 *   }
 */
export const GeodaProvider = ({ children }) => {
  const [geodaReady, setGeodaReady] = useState(false)
  const geoda = useRef(false)

  useEffect(async () => {
    const init = async () => {
      await geodaWorker
        .New()
        .then(() => (geoda.current = geodaWorker))
        .then(() => setGeodaReady(true))
    }

    if (!geodaReady) init()
  }, [])

  return (
    <GeodaContext.Provider value={{ geoda: geoda.current, geodaReady }}>
      {children}
    </GeodaContext.Provider>
  )
}

/**
 * Hook to use jsgeoda wasm work from anywhere within GeodaProvider. All
 * functions are async. For jsgeoda api, see
 * https://www.npmjs.com/package/jsgeoda
 *
 * @category Hooks
 * @example
 *   const { geoda } = useGeoda();
 *   const analyze = async () => {
 *   const result = await geoda.something...
 *   }
 */
export const useGeoda = () => {
  const ctx = useContext(GeodaContext)
  if (!ctx) throw Error('Not wrapped in <GeoDaProvider />.')
  return ctx
}
