import React, {useState, useMemo} from 'react';
import CowCount from './CowCount';
import translations from './BenefitCalculator.yaml';
import { useLocale } from '../hooks';

export default function BenefitCalculator() {
    const [cowCount, updateCowCount] = useState(100);

    const keys = translations[useLocale()];

    return <aside>
        <label>{keys.label}</label>
        <CowCount value={cowCount} onChange={updateCowCount}/>
        
        <p>
            With <em>{cowCount} <Plural count={cowCount} singular="cow" plural="cows"/></em> and a Wicow setup, you could…
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


function Plural({count, singular, plural, zero}) {
    return (count > 1 && plural) || (!!count ? singular : zero);
}

function ExtraCows({cows}) {
    const extraCows = useMemo(() => Math.floor(cows * 0.15), [cows])
    return <li>
                keep <em>{extraCows} more 
                <Plural count={extraCows} singular=" cow" plural=" cows"/>
                </em> for the same amount of work
            </li>
}

function ExtraMovies({cows}) {
    const movies = useMemo(() => ({
                perMonth: Math.floor(cows / 25),
                perWeek: Math.floor(cows / 100),
                perDay: Math.floor(cows / 700),
            }), [cows])
    return <li hidden={!movies.perMonth}>
                have time for 
                <Movies count={movies}/>
            </li>
}

function Movies({count: {perDay, perWeek, perMonth}}) {
    const keys = translations[useLocale()];

    const mode = (!!perDay && "day") || (!!perWeek && "week") || (!!perMonth && "month")
    switch (mode) {
        case "day": 
            return <> <em>{keys.movieCounts[perDay-1]}</em> every day</>;
        case "week": 
            return <> <em>{keys.movieCounts[perWeek-1]}</em> every week</>;
        case "month": 
            return <> <em>{keys.movieCounts[perMonth-1]}</em> every month</>;
        default: return null;
    }
}

function ExtraSleep({cows}) {
    const minutes = useMemo(() => Math.floor(cows * 0.04) * 5, [cows])
    return <li hidden={minutes < 15}>
                sleep <em>{minutes} more minutes</em> each day
            </li>
}