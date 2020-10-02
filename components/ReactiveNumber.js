import { useReactiveValue } from "../hooks";
import { Number } from "./Number";

export default {
    CowCount() {
        const count = useReactiveValue("UPDATE_COW_COUNT", "count");
        return <Number value={count} fallback="100"/>;
    }
}