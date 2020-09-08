import React, {useState, useMemo} from 'react';
import CowCount from './CowCount';
import {useTranslation, Translate} from '../hooks';
import translations from './BenefitCalculator.yaml';

export default function BenefitCalculator() {
    const [cowCount, updateCowCount] = useState(100);

    const { label, intro } = useTranslation(translations);

    return <aside>
        <label>{label}</label>
        <CowCount value={cowCount} onChange={updateCowCount}/>
        
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


function Plural({count, singular, plural, zero}) {
    return (count > 1 && plural) || (!!count ? singular : zero);
}

function ExtraCows({cows}) {
    const extraCows = useMemo(() => Math.floor(cows * 0.15), [cows])
    const keys = useTranslation(translations, "ExtraCows");
    return <li>
        <Translate keys={keys} 
            mapping={
                {
                    extraCows,
                    Plural: props => <Plural count={extraCows} {...props}/>
                }
            }/>
        </li>
}

function ExtraMovies({cows}) {
    const movies = useMemo(() => ({
                month: Math.floor(cows / 25),
                week: Math.floor(cows / 100),
                day: Math.floor(cows / 700),
            }), [cows])
    return <li hidden={!movies.month}>
                <Movies count={movies}/>
            </li>
}

function Movies({count}) {
    const {day, week, month} = count;

    const keys = useTranslation(translations, "ExtraMovies");

    const timeframe = (!!day && "day") || (!!week && "week") || "month"
    
    return <Translate keys={keys} mapping={{
        timeframe, 
        count: count[timeframe]
        }}/>;
}

function ExtraSleep({cows}) {
    const minutes = useMemo(() => Math.floor(cows * 0.04) * 5, [cows])
    const keys = useTranslation(translations, "ExtraSleep");

    return <li hidden={minutes < 15}>
                <Translate keys={keys} mapping={{minutes}}/>
            </li>
}


