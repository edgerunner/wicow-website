import { useEventBus } from "../hooks";
import { useMachine } from '@xstate/react';
import { Machine, assign } from "xstate";
import { Number } from "./Number";

export default function ReactiveNumber({ type, field, fallback }) {
    const bus = useEventBus();
    const [state] = useMachine(Machine({
        id: "ReactiveNumber",
        initial: "number",
        states: { number: {} },
        context: { number: null },
        on: {
            [type]: {
                actions: assign({
                    number: (context, event) => event[field]
                })
            }
        },
        invoke: { id: "bus", src: "bus" }
    }), {
        devTools: true,
        services: { bus }
    });

    return <Number value={state.context.number} fallback={fallback}/>
}

ReactiveNumber.CowCount = () => 
    <ReactiveNumber type="UPDATE_COW_COUNT" field="count" fallback="100"/>;

