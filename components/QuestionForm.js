import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import "./xStateInspector";
import { useEffect } from "react";
import {useTranslation, Translate, useEventBus} from '../hooks';
import translations from './QuestionForm.yaml'; 
import { Match, State } from "./Match";

const agentMachine = Machine({
    id: "Agent",
    initial: "pending",
    context: {},
    states: {
        pending: {
            invoke: {
                id: "get-agent",
                src: "getAgent",
                onDone: {
                    target: "selected",
                    actions: assign({ agent: (context, event) => event.data })
                },
                onError: { 
                    target: "error",
                    actions: (context, event) => { console.error(event) }
                }
            },
            after: { 15000: "pending" }
        },
        error: {
            after: { 5000: "pending" }
        },
        selected: {
            type: "final",
            data: { agent: ({ agent }) => agent }
        },
    }
}, {
    services: {
        async getAgent(context) {
            const response = await fetch(`/api/agent?language=${context.language}`);
            return response.ok ? response.json() : Promise.reject(response.status);
        }
    }
});

const questionMachine = Machine({
    id: "QuestionForm",
    context: {
        name: "",
        email: "",
        question: ""
    },
    initial: "form",
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
                },
                ready: {
                    on: { SUBMIT: "#QuestionForm.submission" }
                },
                invalid: {
                    after: { 5000: "halfway" }
                }
            },
            on: {
                UPDATE: {
                    target: ".halfway",
                    internal: true,
                    actions: assign((context, event) => 
                    ({...context, [event.field]: event.value })),
                },
                SUBMIT: ".invalid"
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
                            target: "#QuestionForm.form",
                            actions: assign({ name: "", email: "", question: "" })
                        }
                    }
                },
                error: {
                    entry: "logError",
                    exit: assign({ error: undefined }),
                    on: { RETRY: "#QuestionForm.form" }
                }
            }
        }
    },
    invoke: [
        {
            id: "agent",
            src: "agentMachine",
            data: { language: context => context.language },
            onDone: { actions: assign({ agent: (context, event) => event.data.agent }) }
        },
        { id: "bus", src: "bus" }
    ],
    on: {
        UPDATE_COW_COUNT: {
            actions: assign({ cowCount: (context, event) => event.count })
        }
    }
}, {
    actions: {
        logError({error}) { console.error("Error submitting question: ", error) }
    },
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
        },
        agentMachine
    }
});



export default function QuestionForm() {
    const t = useTranslation(translations);
    const bus = useEventBus();

    const [state, send] = useMachine(questionMachine, { 
        devTools: true, 
        context: { language: t.language },
        services: { bus }
    });

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

    function WithAgent({t}) {
        return state.context.agent
            ? <>
                <Translate keys={t.agent}
                    mapping={{agentName: state.context.agent.name}}/>
                <picture className="avatar">
                    <source type="image/webp" 
                        srcSet={`/avatars/${state.context.agent.id}.webp`}/>
                    <img src={`/avatars/${state.context.agent.id}.jpg`}/>
                </picture>
              </>
            : t.generic;
    }

    return <aside className="QuestionForm">
        <form autoComplete="on" onSubmit={submit}>
            <label htmlFor="question-name">{t.name.label}</label>
            <input id="question-name" name="name"
                type="text" autoComplete="name" 
                placeholder={t.name.placeholder}
                disabled={!state.matches("form")}
                value={state.context.name} onChange={update}
                />

            <label htmlFor="question-email">{t.email.label}</label>
            <input id="question-email" type="email" name="email"
                placeholder={t.email.placeholder} 
                disabled={!state.matches("form")}
                value={state.context.email} onChange={update}
                />

            <label htmlFor="question-question">{t.question.label}</label>
            <textarea id="question-question" name="question" 
                placeholder={t.question.placeholder} onChange={update}
                disabled={!state.matches("form")}
                value={state.context.question} />

            <Match state={state}>
                <State match="form.invalid">
                    <button id="question-ask" disabled>{t.button.invalid}</button>
                </State>
                <State match="form">
                    <button id="question-ask" type="submit">
                        <WithAgent t={t.button.submit} />
                    </button>
                </State>
                <State match="submission.error">
                    <label htmlFor="question-ask" className="problem">
                        {t.button.error.label}
                    </label>
                    <button id="question-ask" onClick={()=>send("RETRY")}>{t.button.error.text}</button>
                </State>
                <State match="submission.done">
                    <label htmlFor="question-ask">
                        <WithAgent t={t.button.done.label} />
                    </label>
                    <button id="question-ask" onClick={()=>send("ANOTHER")}>
                        {t.button.done.text}
                    </button>
                </State>
                <State match="submission.pending">
                    <button id="question-ask" disabled>
                        <WithAgent t={t.button.pending} />
                    </button>
                </State>
            </Match>
        </form>
    </aside>
}

