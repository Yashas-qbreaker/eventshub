import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { userLoginReducer, userRegisterReducer, userProfileReducer } from "./reducers/userReducers";
import { eventListReducer, eventDetailsReducer, eventCreateReducer, eventRsvpReducer, ticketListReducer } from "./reducers/eventReducers";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userProfile: userProfileReducer,
  eventList: eventListReducer,
  eventDetails: eventDetailsReducer,
  eventCreate: eventCreateReducer,
  eventRsvp: eventRsvpReducer,
  ticketList: ticketListReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)));

export default store;


