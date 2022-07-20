import INITIAL_STATE from "../constants/storiesInitialState";

export default function Reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SET_SELECTED_STORY": {
      return {
        ...state,
        selectedStory: action.payload,
      }
    }
    default:
      return state;
  }
}
