import { createContext, useState, useEffect } from 'react'
import { cgroup90 } from '../cgroup90';

export const EventsContext = createContext();

export default function EventsContextProvider({ children }) {

    const [events, setEvents] = useState('');

    const getEvents = () => {
        fetch(`${cgroup90}/api/newevent`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            })
        })
            .then(response => {
                return response.json()
            })
            .then(
                (result) => {
                    setEvents(result)
                },
                (error) => {
                    console.log("err post=", error);
                },);
    }
    value = {
        events,
        getEvents
    }
    return (
        <EventsContext.Provider value={value}>
            {children}
        </EventsContext.Provider>
    )
}