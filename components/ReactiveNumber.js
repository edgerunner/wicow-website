import { useReactiveValue } from "../hooks";
import { Number } from "./Number";
import { Currency } from "./Currency";

export default {
    CowCount() {
        const count = useReactiveValue("UPDATE_COW_COUNT", "count");
        return <Number value={count} fallback="100"/>;
    },
    YearlyLoss() {
        const count = useReactiveValue("UPDATE_COW_COUNT", "count");
        const loss = count * 80; // Euros
        return <Currency value={loss} unit="EUR" fallback="€8.000"/>
    }
}