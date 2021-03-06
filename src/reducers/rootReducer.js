import { combineReducers } from "redux";
import data from "../reducers/dataReducer";
import params from "../reducers/paramsReducer";
import ui from "../reducers/uiReducer";
import stories from "../reducers/storiesReducer";
import report from "../reducers/reportBuilderReducer";

export default combineReducers({
    data,
    params,
    ui,
    report,
    stories
})