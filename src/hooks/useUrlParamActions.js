import React, { useEffect } from 'react'
import { paramsSelectors, paramsActions } from '../stores/paramsStore'
import { useDispatch, useSelector } from 'react-redux'
import { useSetViewport } from '../contexts/Viewport'

const {
    setMapParams,
    setMapType,
    changeVariable,
} = paramsActions

const { selectMapLoaded } = paramsSelectors

//utils
const snakeToCamel = (col) => (params) => params[col].replace(/_/g, ' ')

//config
export const defaultAtlasActions = [
    {
        name: 'variable',
        urlParam: 'var',
        action: changeVariable,
        dispatchFormatter: snakeToCamel("var"),
    },
    {
        name: "Bin mode",
        urlParam: "dBin",
        action: setMapParams,
        dispatchFormatter: params => ({'binMode': params.dBin}),
    },
    {
        name: 'method',
        urlParam: 'mthd',
        action: setMapType,
        dispatchFormatter: params => params.mthd,
    },
    {
        name: "n bins",
        urlParam: "mthd",
        action: setMapParams,
        dispatchFormatter: params => (
            {'nBins': params.mthd.includes === "hinge15_breaks"
            ? 6
            : params.mthd.includes === "lisa"
            ? 4
            : 8
        }),
    },
    {
        name: "viz type",
        urlParam: "viz",
        action: setMapParams,
        dispatchFormatter: params => ({'vizType': params.viz}),
    },
    {
        name: "overlay",
        urlParam: "ovr",
        action: setMapParams,
        dispatchFormatter: params => ({'overlay': params.ovr}),
    },
    {
        name: "resource",
        urlParam: "res",
        action: setMapParams,
        dispatchFormatter: params => ({'resource': params.res}),
    },
    {
        name: "view",
        urlParam: "lat",
        action: "custom-viewport",
        dispatchFormatter: (params) => ({'latitude': +params.lat, 'longitude': +params.lon, 'zoom': +params.z}),
    }
]

export default function useUrlParamActions(actions = defaultAtlasActions) {
    const dispatch = useDispatch()
    const setViewport = useSetViewport()
    const [hasSetParams, setHasSetParams] = React.useState(false)
    const mapLoaded = useSelector(selectMapLoaded)

    useEffect(() => {
        // // read in URL params
        if (mapLoaded && !hasSetParams) {
            let paramsDict = {}
            for (const [key, value] of new URLSearchParams(
                window.location.search
            )) {
                paramsDict[key] = value
            }
            for (let i=0; i<actions.length; i++) {
                const { urlParam, action, dispatchFormatter } = actions[i]
                if (urlParam in paramsDict) {
                    if (typeof action !== 'function' && action?.includes("custom-")) {
                        setViewport(dispatchFormatter(paramsDict))
                    } else {
                        dispatch(action(dispatchFormatter(paramsDict)))
                    }
                }
            }
            setHasSetParams(true)
        }
    }, [mapLoaded])
}
