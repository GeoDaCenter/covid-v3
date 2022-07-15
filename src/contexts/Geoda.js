import { createContext, useState, useRef, useEffect, useContext } from 'react';
import { wrap } from 'comlink';
const geodaWorker =  wrap(new Worker(new URL('../workers/geoda', import.meta.url)));
export const GeodaContext = createContext({});

export const GeodaProvider = ({ children }) => {
  const [geodaReady, setGeodaReady] = useState(false);
  const geoda = useRef(false);

  useEffect(async () => {
    const init = async () => {
      await geodaWorker.New()
        .then(() => (geoda.current = geodaWorker))
        .then(() => setGeodaReady(true));
    }

    if (!geodaReady) init();
  }, []);

  return (
    <GeodaContext.Provider value={{ geoda: geoda.current, geodaReady }}>
      {children}
    </GeodaContext.Provider>
  );
};

/** Update the viewport from anywhere */
export const useGeoda = () => {
  const ctx = useContext(GeodaContext);
  if (!ctx) throw Error('Not wrapped in <GeoDaProvider />.');
  return ctx;
};
