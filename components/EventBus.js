import { createContext, useContext, useState } from "react";

const Bus = createContext()

export default function EventBus({ children }) {
    const [subscribers, update] = useState(new Set());

    function bus() {
        return function subscribe(send, receive) {
            update(new Set(subscribers.add(send)));

            receive(event => {
                for (const callback of subscribers) {
                    if (callback === send) { continue }
                    callback(event);
                }
            });

            return function unsubscribe() { 
                subscribers.delete(send);
                update(new Set(subscribers)); 
            }
        }
    }

    return <Bus.Provider value={bus}>{children}</Bus.Provider>;
}

export function useEventBus() {
    return useContext(Bus);
}