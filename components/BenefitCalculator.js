import React, { useMemo, useCallback } from 'react';
import { Machine, assign } from "xstate";
import { useMachine } from '@xstate/react';
import CowCount from './CowCount';
import { useTranslation, Translate } from '../hooks';
import translations from './BenefitCalculator.yaml';

const machine = Machine({
    id: "benefits",
    context: {
        cowCount: 100
    },
    type: "parallel",
    states: {
        CowCount: {
            on: {
                UPDATE_COW_COUNT: { 
                    actions: assign({ cowCount: (context, event) => event.count })
                }
            },
        },
        ExtraCows: {
            initial: "unknown",
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
                    entry: { type: "derive", field: "extraCows", factor: 0.15 }
                },
                team: {
                    entry: { type: "derive", field: "extraCows", factor: 0.20 }
                }
            },
            on: { UPDATE_COW_COUNT: { target: ".unknown", internal: true } }
        },
        ExtraMovies: {
            initial: "day",
            on: { UPDATE_COW_COUNT: "ExtraMovies" },
            states: {
                day: {
                    entry: { type: "derive", field: "extraMovies", factor: 1/700 },
                    always: { target: "week", cond: "noMovies" }
                },
                week: {
                    entry: { type: "derive", field: "extraMovies", factor: 1/100 },
                    always: { target: "month", cond: "noMovies" }
                },
                month: {
                    entry: { type: "derive", field: "extraMovies", factor: 1/25 },
                    always: { target: "none", cond: "noMovies" }
                },
                none: {
                    entry: assign({ extraMovies: undefined })
                },
            },
        },
        ExtraSleep: {}
    }
},
{
    actions: {
        derive: assign(
            ({ cowCount }, _event, { action: { factor, field } }) => 
                ({ [field]: Math.floor(cowCount * factor) })
        )
    },
    guards: {
        cowCount({ cowCount }, _e, { cond: { min = 10, max = 1000 }}) {
            return (cowCount >= min) && (cowCount <= max);
        },
        noMovies({ extraMovies }) { return extraMovies <= 0; }
    }
});

 

export default function BenefitCalculator() {
    const [ state, send ] = useMachine(machine, { devTools: true });
    const { label, intro } = useTranslation(translations);

    const { cowCount } = state.context; 
    const UPDATE_COW_COUNT = useCallback((count) => { send({ type: "UPDATE_COW_COUNT", count }) }, []);

    return <aside>
        <label htmlFor="benefit-cows">{label}</label>
        <CowCount id="benefit-cows" value={cowCount} onChange={UPDATE_COW_COUNT}/>

        <p>
            <Translate keys={intro} mapping={{cowCount}}/>
        </p>
        <ul className="ellipsis">
            <ExtraCows state={state}/>
            <ExtraMovies state={state}/>
            <ExtraSleep cows={cowCount} />
        </ul>
        <style jsx>{`
            aside { column-break-inside: avoid }
            ul { min-height: 12rem; }
        `}</style>
    </aside>
}

function ExtraCows({state: { context: { extraCows }, value: { ExtraCows: current } }}) {
    const { ExtraCows: keys } = useTranslation(translations);
    return <li><Translate keys={keys[current]} mapping={{ extraCows }}/></li>;
}

function ExtraMovies({state: { context: { extraMovies: count }, value: { ExtraMovies: timeframe } }}) {
    const { ExtraMovies: keys } = useTranslation(translations);

    return  <li hidden={timeframe === "none"}>
                <Translate keys={keys} mapping={{ timeframe, count }}/>
            </li>;
}

function ExtraSleep({cows}) {
    const minutes = useMemo(() => Math.floor(cows * 0.04) * 5, [cows])
    const { ExtraSleep: keys } = useTranslation(translations);

    return <li hidden={minutes < 15}>
                <Translate keys={keys} mapping={{minutes}}/>
            </li>
}


