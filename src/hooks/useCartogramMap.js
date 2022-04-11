import { useState, useEffect } from "react";
import { useGeoda } from "../contexts/Geoda";

export default function useCartogramMap({
    mapId = "",
    dataForCartogram,
    shouldUseCartogram = false,
    dataReady,
    varId,
    order,
    geojsonData
  }) {
    const { geoda, geodaReady } = useGeoda();
    const [cartogramData, setCartogramData] = useState({
      cartogramData: [],
      cartogramCenter: [0,0],
      cartogramDataSnapshot: ''
    });
    const [geodaTimeout, setGeodaTimeout] = useState(null);
    const debounceDelay = dataForCartogram && dataForCartogram.length < 500 ? 0 : 250;
  
    useEffect(() => {
      clearTimeout(geodaTimeout);
      if (
        shouldUseCartogram &&
        geodaReady &&
        dataForCartogram.length &&
        mapId.length
      ) {
        const getCartogramData = async () => {
          let cartogramValues = await geoda
            .cartogram(mapId, dataForCartogram)
            .then((data) => {
              const cartogramData = [];
              let cartogramCenter = [0, 0];
              for (let i = 0; i < data.length; i++) {
                cartogramData.push({
                  ...data[i],
                  value: dataForCartogram[i],
                  id: order[data[i].properties.id],
                  properties: {
                    ...geojsonData.features[i].properties
                  }
                })
                cartogramCenter[0] += data[i].position[0];
                cartogramCenter[1] += data[i].position[1];
              }
              cartogramCenter[0] /= data.length;
              cartogramCenter[1] /= data.length;
              
              return {
                cartogramData,
                cartogramCenter,
                cartogramDataSnapshot: varId
              }
            })      
          setCartogramData(cartogramValues);
        }
        setGeodaTimeout(setTimeout(getCartogramData, debounceDelay));
      }
    },[
      dataReady,
      varId,
      shouldUseCartogram,
      mapId,
      geodaReady
    ])
    return cartogramData;
  }