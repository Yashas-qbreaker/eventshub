import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listMyEvents } from "../actions/eventActions";
import Loader from "../components/Loader";
import EventCard from "../components/EventCard";

export default function OrganizerEventsScreen() {
  const dispatch = useDispatch();
  const { loading, error, events } = useSelector((s) => s.eventList);
  useEffect(() => { dispatch(listMyEvents()); }, [dispatch]);
  return (
    <div>
      <h3>My Events</h3>
      {loading ? <Loader /> : error ? <div className="alert alert-danger">{String(error)}</div> : (
        <div className="row row-cols-1 row-cols-md-3 g-3">
          {events.map((e) => (
            <div className="col" key={e.id}><EventCard event={e} /></div>
          ))}
        </div>
      )}
    </div>
  );
}


