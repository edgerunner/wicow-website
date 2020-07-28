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
            extraMinutesPerDay: Math.floor(cowCount * 0.04) * 5
         };
    },[cowCount])

    return <>
        <label>How many cows do you have?</label>
        <CowCount value={cowCount} onChange={updateCowCount}/>

        <p>
            With <em>{cowCount} <Plural count={cowCount} singular="cow" plural="cows"/></em> and a Wicow setup, you could…
        </p>
        <ul className="ellipsis">
            <li>
                keep <em>{benefit.extraCows} more 
                <Plural count={benefit.extraCows} singular=" cow" plural=" cows"/>
                </em> for the same amount of work
            </li>
            <li hidden={!benefit.extraMovies.perMonth}>
                have time for 
                <Movies count={benefit.extraMovies}/>
            </li>
            <li hidden={benefit.extraMinutesPerDay < 15}>
                sleep <em>{benefit.extraMinutesPerDay} more minutes</em> each day
            </li>
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

function Plural({count, singular, plural, zero}) {
    return (count > 1 && plural) || (!!count ? singular : zero);
}