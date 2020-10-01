import { useLocale } from "../hooks";

import * as KnowYourCows from './KnowYourCows';
import * as SitBackAndRelax from './SitBackAndRelax';
import * as Simple from './Simple';
import * as NoNonsense from './NoNonsense';
import * as SmartInvestment from './SmartInvestment';
import * as Horsemouth from './Horsemouth';

export { 
    KnowYourCows, SitBackAndRelax, Simple, 
    NoNonsense, SmartInvestment, Horsemouth 
};
const sections = [
    KnowYourCows, SitBackAndRelax, Simple, 
    NoNonsense, SmartInvestment, Horsemouth
];

export default function Sections() {
    const locale = useLocale();
    return sections.map(
        section => {
            const Section = section[locale];
            return <Section key={section.id} id={section.id}/>
        }
    );  
}