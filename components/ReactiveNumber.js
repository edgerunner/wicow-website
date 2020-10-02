import { useReactiveValue } from "../hooks";
import { Number } from "./Number";

export default function ReactiveNumber({ type, field, fallback }) {
    const number = useReactiveValue(type, field);

    return <Number value={number} fallback={fallback}/>
}

ReactiveNumber.CowCount = () => 
    <ReactiveNumber type="UPDATE_COW_COUNT" field="count" fallback="100"/>;

