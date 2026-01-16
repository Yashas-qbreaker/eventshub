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

export const eventListReducer = (state = { events: [] }, action) => {
  switch (action.type) {
    case EVENT_LIST_REQUEST:
      return { loading: true, events: [] };
    case EVENT_LIST_SUCCESS:
      return { loading: false, events: action.payload.results || action.payload || [] };
    case EVENT_LIST_FAIL:
      return { loading: false, error: action.payload, events: [] };
    default:
      return state;
  }
};

export const eventDetailsReducer = (state = { event: {} }, action) => {
  switch (action.type) {
    case EVENT_DETAILS_REQUEST:
      return { loading: true, event: {} };
    case EVENT_DETAILS_SUCCESS:
      return { loading: false, event: action.payload };
    case EVENT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const eventCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case EVENT_CREATE_REQUEST:
      return { loading: true };
    case EVENT_CREATE_SUCCESS:
      return { loading: false, success: true, event: action.payload };
    case EVENT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const eventRsvpReducer = (state = {}, action) => {
  switch (action.type) {
    case EVENT_RSVP_REQUEST:
      return { loading: true };
    case EVENT_RSVP_SUCCESS:
      return { loading: false, ticket: action.payload };
    case EVENT_RSVP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const ticketListReducer = (state = { tickets: [] }, action) => {
  switch (action.type) {
    case TICKET_LIST_REQUEST:
      return { loading: true, tickets: [] };
    case TICKET_LIST_SUCCESS:
      return { loading: false, tickets: action.payload };
    case TICKET_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


