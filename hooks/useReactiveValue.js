import { useEventBus } from "../hooks";
import { useMachine } from '@xstate/react';
import { Machine, assign } from "xstate";

export function useReactiveValue(type, field) {
    const bus = useEventBus();
    const [state] = useMachine(Machine({
        id: "useReactiveValue",
        initial: "value",
        states: { value: {} },
        context: { value: null },
        on: {
            [type]: {
                actions: assign({
                    value: (context, event) => event[field]
                })
            }
        },
        invoke: { id: "bus", src: "bus" }
    }), {
        devTools: true,
        services: { bus }
    });

    return state.context.value;
}