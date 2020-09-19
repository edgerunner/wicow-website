import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { inspect } from "@xstate/inspect";

if (typeof window !== 'undefined') {
    inspect({
        url: "https://statecharts.io/inspect",
        iframe: false
    });          
}

const machine = Machine({
    id: "question-form",
    initial: "form",
    context: {
        name: "",
        email: "",
        question: ""
    },
    states: {
        form: {
            initial: "blank",
            states: {
                blank: {}, 
                halfway: {},
                ready: {},
                invalid: {}
            },
            on: {
                UPDATE: {
                    target: ".halfway",
                    actions: assign((context, event) => 
                        ({...context, [event.field]: event.value })),
                },
            }
        }, 
        submission: {
            initial: "pending",
            states: {
                pending: {},
                done: {},
                error: {}
            }
        }
    }
});

export default function QuestionForm() {
    const [current, send] = useMachine(machine, { devTools: true });
    function update(event) {
        send({
            type: "UPDATE",
            field: event.target.name,
            value: event.target.value
        });
    }

    return <aside className="QuestionForm">
        <form autoComplete="on">
            <label htmlFor="question-name">Hello, my name is</label>
            <input id="question-name" name="name"
                type="text" autoComplete="name" 
                placeholder="Peter? Simone? Rahul?"
                value={current.context.name} onChange={update}
                />

            <label htmlFor="question-email">and my email address is</label>
            <input id="question-email" type="email" name="email"
                placeholder="you@yourfarm.com" 
                value={current.context.email} onChange={update}/>

            <label htmlFor="question-question">My question is</label>
            <textarea id="question-question" name="question" 
                placeholder="How do I …" onChange={update} 
                value={current.context.question} />

            <button id="question-ask" type="submit">Ask Tolga</button>
        </form>
    </aside>
}

