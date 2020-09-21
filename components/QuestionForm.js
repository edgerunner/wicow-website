import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { inspect } from "@xstate/inspect";
import { useEffect } from "react";
import {useTranslation, Translate} from '../hooks';
import translations from './QuestionForm.yaml';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_DEVELOPER_TOOLS) {
    inspect({
        url: "https://statecharts.io/inspect",
        iframe: false
    });          
}

const machine = Machine({
    id: "root",
    type: "parallel",
    context: {
        name: "",
        email: "",
        question: ""
    },
    states: {
        question: {
            id: "question",
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
                            on: { SUBMIT: "#question.submission" }
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
                                    target: "#question.form",
                                    actions: assign({ name: "", email: "", question: "" })
                                }
                            }
                        },
                        error: {
                            entry: "logError",
                            exit: assign({ error: undefined }),
                            on: { RETRY: "#question.form" }
                        }
                    }
                }
            }
        },
        agent: {
            id: "agent",
            initial: "unknown",
            states: {
                unknown: {},
                pending: {
                    invoke: {
                        id: "get-agent",
                        src: "getAgent",
                        onDone: {
                            target: "selected",
                            actions: assign({ agent: (context, event) => event.data })
                        },
                        onError: "unknown" 
                    },
                    after: { 15000: "unknown" },
                    on: { SET_LANGUAGE: undefined }
                },
                selected: {},
            },
            on: { 
                SET_LANGUAGE: { 
                    target: ".pending",
                    actions: assign({ language: (context, event) => event.language })
                }
            } 
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
        async getAgent(context) {
            const response = await fetch(`/api/agent?language=${context.language}`);
            return response.ok ? response.json() : Promise.reject(response.status);
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

    const t = useTranslation(translations);

    useEffect(() => { 
        send({ type: "SET_LANGUAGE", language: t.language }); }, 
        [t.language]);

    function WithAgent({t}) {
        return state.matches("agent.selected")
            ? <Translate keys={t.agent} 
                mapping={{agentName: state.context.agent.name}}/>
            : t.generic;
    }

    return <aside className="QuestionForm">
        <form autoComplete="on" onSubmit={submit}>
            <label htmlFor="question-name">{t.name.label}</label>
            <input id="question-name" name="name"
                type="text" autoComplete="name" 
                placeholder={t.name.placeholder}
                disabled={!state.matches("question.form")}
                value={state.context.name} onChange={update}
                />

            <label htmlFor="question-email">{t.email.label}</label>
            <input id="question-email" type="email" name="email"
                placeholder={t.email.placeholder} 
                disabled={!state.matches("question.form")}
                value={state.context.email} onChange={update}
                />

            <label htmlFor="question-question">{t.question.label}</label>
            <textarea id="question-question" name="question" 
                placeholder={t.question.placeholder} onChange={update}
                disabled={!state.matches("question.form")}
                value={state.context.question} />
            
            

            { state.matches("question.form.invalid")
            ? <button id="question-ask" disabled>{t.button.invalid}</button>
            : state.matches("question.form") 
            ? <button id="question-ask" type="submit">
                <WithAgent t={t.button.submit} />
              </button>
            : state.matches("question.submission.error")
            ? <>
                <label htmlFor="question-ask" className="problem">
                    {t.button.error.label}
                </label>
                <button id="question-ask" onClick={()=>send("RETRY")}>{t.button.error.text}</button>
              </>
            : state.matches("question.submission.done")
            ? <>
                <label htmlFor="question-ask">
                    <WithAgent t={t.button.done.label} />
                </label>
                <button id="question-ask" onClick={()=>send("ANOTHER")}>
                    {t.button.done.text}
                </button>
              </>
            : state.matches("question.submission.pending")
            ? <button id="question-ask" disabled>
                <WithAgent t={t.button.pending} />
              </button>
            : null
            }
        </form>
    </aside>
}

