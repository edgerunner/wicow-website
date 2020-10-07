import { useTranslation } from "../hooks";
import { Machine, assign, actions } from "xstate";
import { useMachine } from "@xstate/react";
import translations from "./AlertsSummary.yaml";
import { Number } from "./Number";

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

    const [state] = useMachine(machine, { devTools: true })

    return <aside className="AlertsSummary">
        <dl>
            <dt>{keys.perfect}</dt>
            <dd><em><Number value={state.context?.perfect} fallback="…"/></em></dd>

            <dt>{keys.eventual}</dt>
            <dd><Number value={state.context?.eventual} fallback="…"/></dd>

            <dt>{keys.false_}</dt>
            <dd><Number value={state.context?.false_} fallback="…"/></dd>

            <dt>{keys.missed}</dt>
            <dd><Number value={state.context?.missed} fallback="…"/></dd>
        </dl>
    </aside>;
}

