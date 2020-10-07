import { useCallback, useEffect, useReducer } from "react";
import { useTranslation } from "../hooks";
import { Machine, assign, actions } from "xstate";
import translations from "./AlertsSummary.yaml";
import { Number } from "./Number";

const polling_timeout = process.env.NEXT_PUBLIC_FETCH_POLLING_INTERVAL;
const retry_timeout = process.env.NEXT_PUBLIC_FETCH_RETRY_INTERVAL;

const machine = Machine({
    id: "AlertsSummary",
    context: {},
    type: "parallel",
    states: {
        data: {
            initial: "none",
            states: {
                none: {},
                some: {
                    initial: "fresh",
                    states: {
                        fresh: {
                            after: {
                                polling_timeout: "stale"
                            }
                        },
                        stale: {
                            entry: actions.send("STALE")
                        }
                    }
                }
            },
            on: {
                SUCCESS: {
                    target: "data.some.fresh",
                    actions: assign((ctx,event) => event.data)
                }
            }
        },
        transfer: {
            initial: "pending",
            states: {
                pending: {
                    invoke: {
                        src: "fetchAlerts",
                        onDone: {
                            target: "done",
                            actions: actions.raise((ctx, event) => ({
                                type: "SUCCESS",
                                data: event.data
                            }))
                        },
                        onError: {
                            target: "failed",
                            actions: actions.log((ctx, event) => event.data)
                        }
                    }
                },
                done: {},
                failed: {
                    after: {
                        retry_timeout: "pending"
                    }
                }
            },
            on: {
                STALE: ".pending"
            }
        }
    }
}, {
    delays: { 
        retry_timeout: parseInt(process.env.NEXT_PUBLIC_FETCH_RETRY_INTERVAL), 
        polling_timeout: parseInt(process.env.NEXT_PUBLIC_FETCH_POLLING_INTERVAL) 
    },
    services: {
        async fetchAlerts() { return (await fetch("/api/alerts")).json(); }
    }
});

export default function AlertsSummary() {
    const keys = useTranslation(translations);

    const [state, dispatch] = useReducer(reducer, { initial: true });

    const getAlerts = useCallback(() => {
        dispatch({type: "start"});
        fetchAlerts()
            .then(data => dispatch({type: "success", data}))
            .catch(error => dispatch({type: "error", error}));
    }, [dispatch]);

    useEffect(() => {
        if (state.initial) { getAlerts() }
        if (state.error) { return timeout(getAlerts, retry_timeout); }
        if (state.data) { return timeout(getAlerts, polling_timeout); }
    }, [state]);



    return <aside className="AlertsSummary">
        <dl>
            <dt>{keys.perfect}</dt>
            <dd><em><Number value={state.data?.perfect} fallback="…"/></em></dd>

            <dt>{keys.eventual}</dt>
            <dd><Number value={state.data?.eventual} fallback="…"/></dd>

            <dt>{keys.false_}</dt>
            <dd><Number value={state.data?.false_} fallback="…"/></dd>

            <dt>{keys.missed}</dt>
            <dd><Number value={state.data?.missed} fallback="…"/></dd>
        </dl>
    </aside>;
}

async function fetchAlerts() { return (await fetch("/api/alerts")).json(); }

function timeout(callback, duration) {
    const id = setTimeout(callback, duration);
    return () => clearTimeout(id);
}

function reducer(state, action) {
    switch (action.type) {
        case "success": return { data: action.data };
        case "error": return { error: action.error, data: state.data };
        case "start": return { loading: true, error: state.error, data: state.data };
    }
}
