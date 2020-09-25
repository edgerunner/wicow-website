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
    on: {
        UPDATE_COW_COUNT: { 
            actions: assign({ cowCount: (context, event) => event.count }),
            internal: true
        }
    },
    type: "parallel",
    states: {
        ExtraCows: {
        },
        ExtraMovies: {},
        ExtraSleep: {}
    }
},
{
});

 

export default function BenefitCalculator() {
    const [ { context: { cowCount }}, send ] = useMachine(machine, { devTools: true });
    const { label, intro } = useTranslation(translations);

    const UPDATE_COW_COUNT = useCallback((count) => { send({ type: "UPDATE_COW_COUNT", count }) }, []);

    return <aside>
        <label htmlFor="benefit-cows">{label}</label>
        <CowCount id="benefit-cows" value={cowCount} onChange={UPDATE_COW_COUNT}/>

        <p>
            <Translate keys={intro} mapping={{cowCount}}/>
        </p>
        <ul className="ellipsis">
            <ExtraCows cows={cowCount}/>
            <ExtraMovies cows={cowCount}/>
            <ExtraSleep cows={cowCount} />
        </ul>
        <style jsx>{`
            aside { column-break-inside: avoid }
            ul { min-height: 12rem; }
        `}</style>
    </aside>
}

function ExtraCows({cows}) {
    const extraCows = useMemo(() => Math.floor(cows * 0.15), [cows])
    const { ExtraCows: keys } = useTranslation(translations);
    return <li><Translate keys={keys} mapping={{ extraCows }}/></li>;
}

function ExtraMovies({cows}) {
    const { ExtraMovies: keys } = useTranslation(translations);

    const count = useMemo(() => ({
                month: Math.floor(cows / 25),
                week: Math.floor(cows / 100),
                day: Math.floor(cows / 700),
            }), [cows]);

    const timeframe = useMemo(() => 
        (!!count.day && "day") || (!!count.week && "week") || "month", 
        [count]);

    return  <li hidden={!count.month}>
                <Translate keys={keys} mapping={{
                    timeframe, 
                    count: count[timeframe]
                    }}/>
            </li>;
}

function ExtraSleep({cows}) {
    const minutes = useMemo(() => Math.floor(cows * 0.04) * 5, [cows])
    const { ExtraSleep: keys } = useTranslation(translations);

    return <li hidden={minutes < 15}>
                <Translate keys={keys} mapping={{minutes}}/>
            </li>
}


