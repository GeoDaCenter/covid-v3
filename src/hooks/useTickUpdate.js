import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { incrementDate } from "../actions";
import { paramsSelectors } from "../stores/paramsStore";
import { dataSelectors } from '../stores/dataStore'
const { selectIsTicking } = dataSelectors;
const { selectPartialDataParam, selectPartialMapParam } = paramsSelectors;

export default function useTickUpdate({ currDatesAvailable }) {
  const isTicking = useSelector(selectIsTicking);
  const dispatch = useDispatch();
  const setIsTicking = (bool) =>
    dispatch({ type: "SET_TICKING", payload: bool });

  const nIndex = useSelector(selectPartialDataParam('nIndex'));
  const mapType = useSelector(selectPartialMapParam('mapType'));
  // const [isTicking, setIsTicking] = useState(false);
  const [tickTimer, setTickTimer] = useState(100);
  const [tickTimeout, setTickTimeout] = useState();
  const [resetTimeout, setResetTimeout] = useState();

  useEffect(() => {
    if (isTicking) {
      dispatch(incrementDate(1, currDatesAvailable));
    }
    if (!isTicking) {
      dispatch({
        type: "SET_CAN_LOAD_IN_BACKGROUND",
        payload: true,
      });
    }
  }, [isTicking]);

  useEffect(() => {
    if (isTicking) {
      clearTimeout(tickTimeout);
      setTickTimeout(
        setTimeout(
          () => dispatch(incrementDate(1, currDatesAvailable)),
          tickTimer
        )
      );
      clearTimeout(resetTimeout);
      setResetTimeout(
        setTimeout(() => {
          setIsTicking(false);
          dispatch({
            type: "SET_CAN_LOAD_IN_BACKGROUND",
            payload: true,
          });
        }, 1500)
      );
    }
  }, [nIndex]);

  useEffect(() => {
    clearTimeout(resetTimeout);
    clearTimeout(tickTimeout);
    setIsTicking(false);
  }, [mapType]);

  return [isTicking, setIsTicking, tickTimer, setTickTimer];
}
