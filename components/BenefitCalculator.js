import React, {useState, useMemo} from 'react';
import CowCount from './CowCount'

export default function BenefitCalculator() {
    const [cowCount, updateCowCount] = useState(100);

    const benefit = useMemo(() => {
        return { 
            extraCows: Math.floor(cowCount * 0.15),
            extraMovies: {
                perMonth: Math.floor(cowCount / 25),
                perWeek: Math.floor(cowCount / 100),
                perDay: Math.floor(cowCount / 700),
            },
            extraSleep: Math.floor(cowCount * 0.04) * 5
         };
    },[cowCount])

    return <>
        <label>How many cows do you have?</label>
        <CowCount value={cowCount} onChange={updateCowCount}/>
        
        <p>
            With <em>{cowCount} <Plural count={cowCount} singular="cow" plural="cows"/></em> and a Wicow setup, you could…
        </p>
        <ul className="ellipsis">
            <ExtraCows cows={benefit.extraCows}/>
            <ExtraMovies movies={benefit.extraMovies}/>
            <ExtraSleep minutes={benefit.extraSleep} />
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
    return <li>
                keep <em>{cows} more 
                <Plural count={cows} singular=" cow" plural=" cows"/>
                </em> for the same amount of work
            </li>
}

function ExtraMovies({movies}) {
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

function ExtraSleep({minutes}) {
    return <li hidden={minutes < 15}>
                sleep <em>{minutes} more minutes</em> each day
            </li>
}