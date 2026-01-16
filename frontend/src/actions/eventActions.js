import api from "../utils/api";
import {
  EVENT_LIST_REQUEST,
  EVENT_LIST_SUCCESS,
  EVENT_LIST_FAIL,
  EVENT_DETAILS_REQUEST,
  EVENT_DETAILS_SUCCESS,
  EVENT_DETAILS_FAIL,
  EVENT_CREATE_REQUEST,
  EVENT_CREATE_SUCCESS,
  EVENT_CREATE_FAIL,
  EVENT_RSVP_REQUEST,
  EVENT_RSVP_SUCCESS,
  EVENT_RSVP_FAIL,
  TICKET_LIST_REQUEST,
  TICKET_LIST_SUCCESS,
  TICKET_LIST_FAIL,
} from "../constants/eventConstants";

export const listEvents = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: EVENT_LIST_REQUEST });
    const { data } = await api.get("/events/", { params });
    dispatch({ type: EVENT_LIST_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: EVENT_LIST_FAIL, payload: err.response?.data || err.message });
  }
};

export const getEventDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: EVENT_DETAILS_REQUEST });
    const { data } = await api.get(`/events/${id}/`);
    dispatch({ type: EVENT_DETAILS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: EVENT_DETAILS_FAIL, payload: err.response?.data || err.message });
  }
};

export const createEvent = (formData) => async (dispatch) => {
  try {
    dispatch({ type: EVENT_CREATE_REQUEST });
    const { data } = await api.post("/events/", formData, { headers: { "Content-Type": "multipart/form-data" } });
    dispatch({ type: EVENT_CREATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: EVENT_CREATE_FAIL, payload: err.response?.data || err.message });
  }
};

export const rsvpEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: EVENT_RSVP_REQUEST });
    const { data } = await api.post(`/events/${id}/rsvp/`);
    dispatch({ type: EVENT_RSVP_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: EVENT_RSVP_FAIL, payload: err.response?.data || err.message });
  }
};

export const listMyTickets = () => async (dispatch) => {
  try {
    dispatch({ type: TICKET_LIST_REQUEST });
    const { data } = await api.get("/tickets/mine/");
    dispatch({ type: TICKET_LIST_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: TICKET_LIST_FAIL, payload: err.response?.data || err.message });
  }
};

export const listMyEvents = () => async (dispatch) => {
  try {
    dispatch({ type: EVENT_LIST_REQUEST });
    const { data } = await api.get("/events/mine/");
    dispatch({ type: EVENT_LIST_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: EVENT_LIST_FAIL, payload: err.response?.data || err.message });
  }
};

export const verifyTicket = (ticket_id) => async () => {
  const { data } = await api.post("/tickets/verify/", { ticket_id });
  return data;
};

export const likeEvent = (id) => async (dispatch) => {
  try {
    const { data } = await api.post(`/events/${id}/like/`);
    return data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

export const listMyLikes = () => async (dispatch) => {
  try {
    dispatch({ type: EVENT_LIST_REQUEST });
    const { data } = await api.get("/likes/mine/");
    dispatch({ type: EVENT_LIST_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: EVENT_LIST_FAIL, payload: err.response?.data || err.message });
  }
};


