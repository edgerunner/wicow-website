import React, {useState, useMemo} from 'react';
import CowCount from './CowCount'

export default function BenefitCalculator() {
    const [cowCount, updateCowCount] = useState(100);

    return <>
        <label>How many cows do you have?</label>
        <CowCount value={cowCount} onChange={updateCowCount}/>
        
        <p>
            With <em>{cowCount} <Plural count={cowCount} singular="cow" plural="cows"/></em> and a Wicow setup, you could…
        </p>
        <ul className="ellipsis">
            <ExtraCows cows={cowCount}/>
            <ExtraMovies cows={cowCount}/>
            <ExtraSleep cows={cowCount} />
        </ul>
    </>
}

const movieCounts = [
    "",
    "a movie",
    "two movies",
    "three movies",
    "four movies",
    "five movies",
    "six movies"
];



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
    const mode = (!!perDay && "day") || (!!perWeek && "week") || (!!perMonth && "month")
    switch (mode) {
        case "day": 
            return <> <em>{movieCounts[perDay]}</em> every day</>;
        case "week": 
            return <> <em>{movieCounts[perWeek]}</em> every week</>;
        case "month": 
            return <> <em>{movieCounts[perMonth]}</em> every month</>;
        default: return null;
    }
}

function ExtraSleep({cows}) {
    const minutes = useMemo(() => Math.floor(cows * 0.04) * 5, [cows])
    return <li hidden={minutes < 15}>
                sleep <em>{minutes} more minutes</em> each day
            </li>
}