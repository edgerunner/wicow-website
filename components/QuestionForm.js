import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { inspect } from "@xstate/inspect";
import { useEffect } from "react";

if (typeof window !== 'undefined') {
    inspect({
        url: "https://statecharts.io/inspect",
        iframe: false
    });          
}

const machine = Machine({
    id: "question",
    initial: "form",
    context: {
        name: "",
        email: "",
        question: ""
    },
    states: {
        form: {
            initial: "halfway",
            states: {
                blank: {}, 
                halfway: {
                    always : [
                        { cond: "valid", target: "ready" },
                        { cond: "empty", target: "blank" },
                    ],
                    on: { SUBMIT: "invalid" }
                },
                ready: {
                    on: { SUBMIT: "#question.submission" }
                },
                invalid: {}
            },
            on: {
                UPDATE: {
                    target: ".halfway",
                    internal: true,
                    actions: assign((context, event) => 
                        ({...context, [event.field]: event.value })),
                },
            },
        }, 
        submission: {
            initial: "pending",
            states: {
                pending: {
                    invoke: {
                        id: "post-question",
                        src: "postQuestion",
                        onDone: "done",
                        onError: {
                            target: "error",
                            actions: assign({ error: (context, event) => event })
                        }
                    },
                    after: { 15000: "error" }
                },
                done: {
                    on: { 
                        ANOTHER: {
                            target: "#question.form",
                            actions: assign({ name: "", email: "", question: "" })
                        }
                    }
                },
                error: {
                    exit: assign({ error: undefined }),
                    on: { RETRY: "#question.form" }
                }
            }
        }
    }
}, {
    guards: {
        valid({name, email, question}) { 
            return name.match(/\S/) && 
                question.match(/\S/) &&
                email.match(/\w+(?:[.+-]\w+)*@\w+(?:[-.]\w+)*\.[a-z]{2,}/i);
        },
        empty({name, email, question}) { 
            return [name, email, question].join("").match(/^\s*$/)
        }
    },
    services: {
        async postQuestion(context) {
            const response = await fetch("/api/question", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(context)
            });
            return response.ok ? response.status : Promise.reject(response.status);
        }
    }
});

export default function QuestionForm() {
    const [state, send] = useMachine(machine, { devTools: true });
    function update(event) {
        send({
            type: "UPDATE",
            field: event.target.name,
            value: event.target.value
        });
    }

    function submit(event) {
        event.preventDefault();
        send("SUBMIT");
    }

    // Make Webkit drop the forced autofill styles
    // by rewriting input values
    useEffect(() => {
        ["name", "email"]
        .map(id => document.getElementById(`question-${id}`))
        .map(element => { element.value = `${element.value}`})
    });

    return <aside className="QuestionForm">
        <form autoComplete="on" onSubmit={submit}>
            <label htmlFor="question-name">Hello, my name is</label>
            <input id="question-name" name="name"
                type="text" autoComplete="name" 
                placeholder="Peter? Simone? Rahul?"
                disabled={!state.matches("form")}
                value={state.context.name} onChange={update}
                />

            <label htmlFor="question-email">and my email address is</label>
            <input id="question-email" type="email" name="email"
                placeholder="you@yourfarm.com" 
                disabled={!state.matches("form")}
                value={state.context.email} onChange={update}
                />

            <label htmlFor="question-question">My question is</label>
            <textarea id="question-question" name="question" 
                placeholder="How do I …" onChange={update}
                disabled={!state.matches("form")}
                value={state.context.question} />
            
            <button id="question-ask" type="submit">Ask Tolga</button>
        </form>
    </aside>
}

