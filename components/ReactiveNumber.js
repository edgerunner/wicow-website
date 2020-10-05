import { useReactiveValue } from "../hooks";
import { Number } from "./Number";
import { Currency } from "./Currency";

export default {
    CowCount() {
        const count = useReactiveValue("UPDATED_COW_COUNT", "count");
        return <Number value={count} fallback="100"/>;
    },
    YearlyLoss() {
        const count = useReactiveValue("UPDATED_COW_COUNT", "count");
        const loss = count * 80; // Euros
        return <Currency value={loss} unit="EUR" fallback="€8.000"/>
    },
    TSensCount({ to }) {
        const count = useReactiveValue("UPDATED_COW_COUNT", "count");
        const min = Math.ceil(count * 0.08) || 8;
        const max = Math.floor(count * 0.12) || 12;
        return min >= max
            ? <Number value={min}/>
            : <>
                <Number value={min}/>
                &nbsp;{to}&nbsp;
                <Number value={max}/>*
            </>
    }
}