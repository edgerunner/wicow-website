import React, {useState, useMemo} from 'react';
import CowCount from './CowCount';
import translations from './BenefitCalculator.yaml';
import { useLocale } from '../hooks';

export default function BenefitCalculator() {
    const [cowCount, updateCowCount] = useState(100);

    const keys = useTranslation();

    return <aside>
        <label>{keys.label}</label>
        <CowCount value={cowCount} onChange={updateCowCount}/>
        
        <p>
            <Translate keys={keys.intro} mapping={{cowCount}}/>
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
    const keys = useTranslation("ExtraCows");
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

    const keys = useTranslation("ExtraMovies");

    const timeframe = (!!day && "day") || (!!week && "week") || "month"
    
    return <Translate keys={keys} mapping={{
        timeframe, 
        count: count[timeframe]
        }}/>;
}

function ExtraSleep({cows}) {
    const minutes = useMemo(() => Math.floor(cows * 0.04) * 5, [cows])
    const keys = useTranslation("ExtraSleep");

    return <li hidden={minutes < 15}>
                <Translate keys={keys} mapping={{minutes}}/>
            </li>
}

function useTranslation(root) {
    return root 
        ? translations[useLocale()][root]
        : translations[useLocale()];
}

function Translate({keys, mapping}) {
    if (!keys) { return null; }
    if (keys instanceof Array) {
        return keys.map((key, index) => 
            <React.Fragment key={index}><Translate keys={key} mapping={mapping}/> </React.Fragment>
            );
    }

    if (typeof keys === "string") { return <>{keys}</>; }

    if (keys.hasOwnProperty('var')) { return <>{mapping[keys.var]}</>; }

    if (keys.hasOwnProperty('map')) { 
        const [key, choices] = Object.entries(keys.map)[0];
        const chosen = mapping[key];
        return <Translate keys={choices[chosen]} mapping={mapping}/>
    }

    const [key, value] = Object.entries(keys)[0];
    if (key.match(/^[A-Z]/)) {
        const Component = mapping[key];
        return <Component {...value}/>;
    }

    if (key.match(/^[a-z]/)) {
        return React.createElement(key, {}, <Translate keys={value} mapping={mapping}/>)
    }

    return null;
}
