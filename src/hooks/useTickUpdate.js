import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { paramsSelectors, paramsActions } from '../stores/paramsStore'
import { dataSelectors, dataActions } from '../stores/dataStore'
const { selectIsTicking } = dataSelectors
const { selectPartialDataParam, selectPartialMapParam } = paramsSelectors
const { setTicking, setCanLoadInBackground } = dataActions
const { incrementDate } = paramsActions

export default function useTickUpdate({ currDatesAvailable }) {
    const isTicking = useSelector(selectIsTicking)
    const dispatch = useDispatch()
    const setIsTicking = (isTicking) => dispatch(setTicking(isTicking))

    const nIndex = useSelector(selectPartialDataParam('nIndex'))
    const mapType = useSelector(selectPartialMapParam('mapType'))
    // const [isTicking, setIsTicking] = useState(false);
    const [tickTimer, setTickTimer] = useState(100)
    const [tickTimeout, setTickTimeout] = useState()
    const [resetTimeout, setResetTimeout] = useState()

    useEffect(() => {
        if (isTicking) {
            dispatch(incrementDate({ index: 1, currDatesAvailable }))
        }
        if (!isTicking) {
            dispatch(setCanLoadInBackground(true))
        }
    }, [isTicking])

    useEffect(() => {
        if (isTicking) {
            clearTimeout(tickTimeout)
            setTickTimeout(
                setTimeout(
                    () =>
                        dispatch(
                            incrementDate({ index: 1, currDatesAvailable })
                        ),
                    tickTimer
                )
            )
            clearTimeout(resetTimeout)
            setResetTimeout(
                setTimeout(() => {
                    setIsTicking(false)
                    dispatch(setCanLoadInBackground(true))
                }, 1500)
            )
        }
    }, [nIndex])

    useEffect(() => {
        clearTimeout(resetTimeout)
        clearTimeout(tickTimeout)
        setIsTicking(false)
    }, [mapType])

    return [isTicking, setIsTicking, tickTimer, setTickTimer]
}
