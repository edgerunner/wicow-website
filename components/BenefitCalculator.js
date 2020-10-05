import React, { useCallback } from 'react';
import { Machine, assign, actions } from "xstate";
import { useMachine } from '@xstate/react';
import CowCount from './CowCount';
import { useEventBus } from './EventBus';
import { useTranslation, Translate } from '../hooks';
import translations from './BenefitCalculator.yaml';

const machine = Machine({
    id: "BenefitCalculator",
    context: {
        cowCount: 100
    },
    type: "parallel",
    invoke: { id: "bus", src: "bus" },
    states: {
        CowCount: {
            on: {
                UPDATE_COW_COUNT: {
                    actions: [
                        assign({ cowCount: (context, event) => event.count }),
                        actions.send((context, event) => ({
                            ...event,
                            type: "UPDATED_COW_COUNT"
                        }),{ to: "bus" })
                    ]
                },
                UPDATED_COW_COUNT: {
                    actions: assign({ cowCount: (context, event) => event.count })
                }
            },
        },
        ExtraCows: {
            initial: "unknown",
            on: { UPDATE_COW_COUNT: "ExtraCows" },
            states: {
                unknown: {
                    always: [
                        { 
                            cond: { type: "cowCount", min: 201 }, 
                            target: "team" 
                        },
                        { 
                            cond: { type: "cowCount", max: 200 }, 
                            target: "personal" 
                        }
                    ]
                },
                personal: {
                    entry: { type: "derive", field: "extraCows", cows: 8 }
                },
                team: {
                    entry: { type: "derive", field: "extraCows", cows: 5 }
                }
            },
        },
        ExtraMovies: {
            initial: "day",
            on: { UPDATE_COW_COUNT: "ExtraMovies" },
            states: {
                day: {
                    entry: { type: "derive", field: "extraMovies", cows: 700 },
                    always: { target: "week", cond: "noMovies" }
                },
                week: {
                    entry: { type: "derive", field: "extraMovies", cows: 100 },
                    always: { target: "month", cond: "noMovies" }
                },
                month: {
                    entry: { type: "derive", field: "extraMovies", cows: 25 },
                    always: { target: "none", cond: "noMovies" }
                },
                none: {
                    entry: assign({ extraMovies: undefined })
                },
            },
        },
        ExtraSleep: {
            initial: "hours",
            on: { UPDATE_COW_COUNT: "ExtraSleep" },
            states: {
                hours: {
                    entry: { type: "derive", field: "extraSleep", cows: 300, step: 1/2 },
                    always: { target: "minutes", cond: { type: "noSleep", below: 1 } }
                },
                minutes: {
                    entry: { type: "derive", field: "extraSleep", cows: 5, step: 5 },
                    always: { target: "none", cond: { type: "noSleep", below: 10 } }
                },
                none: {
                    entry: assign({ extraSleep: undefined })
                }
            }
        }
    }
},
{
    actions: {
        derive: assign(
            ({ cowCount }, _e, { action: { cows, field, step = 1 } }) => 
                ({ [field]: Math.floor(cowCount / (cows * step)) * step })
        )
    },
    guards: {
        cowCount({ cowCount }, _e, { cond: { min = 10, max = 1000 }}) {
            return (cowCount >= min) && (cowCount <= max);
        },
        noMovies({ extraMovies }) { return extraMovies <= 0; },
        noSleep({ extraSleep }, _e, { cond: { below } }) { return extraSleep < below; }
    }
});

 

export default function BenefitCalculator() {
    const bus = useEventBus();
    const [ state, send ] = useMachine(machine, { 
        devTools: true, 
        services: { bus }
    });
    const { label, intro } = useTranslation(translations);

    const { cowCount } = state.context; 
    const UPDATE_COW_COUNT = useCallback((count) => { send({ type: "UPDATE_COW_COUNT", count }) }, []);

    return <aside className="BenefitCalculator">
        <label htmlFor="benefit-cows">{label}</label>
        <CowCount id="benefit-cows" value={cowCount} onChange={UPDATE_COW_COUNT}/>

        <p>
            <Translate keys={intro} mapping={{cowCount}}/>
        </p>
        <dl>
            <ExtraCows state={state}/>
            <ExtraMovies state={state}/>
            <ExtraSleep state={state} />
        </dl>
    </aside>
}

function ExtraCows({state: { context: { extraCows }, value: { ExtraCows: work } }}) {
    const { ExtraCows: keys } = useTranslation(translations);
    return <>
        <dt><Translate keys={keys.term} mapping={{ work }}/></dt>
        <dd><Translate keys={keys.value} mapping={{ extraCows, work }}/></dd>
    </>;
}

function ExtraMovies({state: { context: { extraMovies }, value: { ExtraMovies: timeframe } }}) {
    const { ExtraMovies: keys } = useTranslation(translations);
    if (timeframe === "none") { return null }
    return <>
        <dt><Translate keys={keys.term} mapping={{ timeframe }}/></dt>
        <dd><Translate keys={keys.value} mapping={{ extraMovies, timeframe }}/></dd>
    </>;
}

function ExtraSleep({state: { context: { extraSleep }, value: { ExtraSleep: timeframe } }}) {
    const { ExtraSleep: keys } = useTranslation(translations);
    if (timeframe === "none") { return null }
    return <>
        <dt><Translate keys={keys.term} mapping={{ timeframe }}/></dt>
        <dd><Translate keys={keys.value} mapping={{ extraSleep, timeframe }}/></dd>
    </>;
}


