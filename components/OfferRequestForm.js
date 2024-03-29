import { Machine, assign, actions } from "xstate";
import { useMachine } from "@xstate/react";
import "./xStateInspector";
import { useEffect, useCallback } from "react";
import {useTranslation, useEventBus} from '../hooks';
import translations from './OfferRequestForm.yaml'; 
import { Match, State } from "./Match";
import CowCount from "./CowCount";
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } 
    from "@geoapify/react-geocoder-autocomplete";


const geoapifyApiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

const offerRequestMachine = Machine({
    id: "OfferRequestForm",
    context: {
        name: "",
        email: "",
        phone: "",
        cowCount: 100,
        postPartumTracking: true
    },
    initial: "form",
    states: {
        form: {
            initial: "halfway",
            states: {
                halfway: {
                    always : [
                        { cond: "valid", target: "ready" },
                    ],
                },
                ready: {
                    on: { SUBMIT: "#OfferRequestForm.submission" }
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
                        id: "post-offer-request",
                        src: "postOfferRequest",
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
                            target: "#OfferRequestForm.form",
                            actions: assign({ 
                                name: "", 
                                email: "", 
                                phone: "", 
                                postPartumTracking: true,
                                location: null
                            })
                        },
                        UPDATED_COW_COUNT: {
                            actions: [
                                actions.raise("ANOTHER"),
                                actions.raise((c,e) => e)
                            ]
                        }
                    }
                },
                error: {
                    entry: "logError",
                    exit: assign({ error: undefined }),
                    on: { RETRY: "#OfferRequestForm.form" }
                }
            }
        }
    },
    invoke: { id: "bus", src: "bus" },
    on: {
        UPDATE_COW_COUNT: {
            actions: [
                assign({ cowCount: (context, event) => event.count }),
                actions.send((context, event) => ({
                    ...event,
                    type: "UPDATED_COW_COUNT"
                }),{ to: "bus" })
            ]
        },
        UPDATED_COW_COUNT: {
            actions: assign({ cowCount: (context, event) => event.count })
        }
    }
}, {
    actions: {
        logError({error}) { console.error("Error requesting offer: ", error) }
    },
    guards: {
        valid({name, email, phone}) { 
            return name.match(/\S/) && 
                phone.match(/(?:\+|0)?[\s-.]?(?:\d+[\s-.]?)+\d+/) &&
                email.match(/\w+(?:[.+-]\w+)*@\w+(?:[-.]\w+)*\.[a-z]{2,}/i);
        }
    },
    services: {
        async postOfferRequest(context) {
            const response = await fetch("/api/offer-request", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(context)
            });
            return response.ok ? response.status : Promise.reject(response.status);
        }
    }
});



export default function OfferRequestForm() {
    const t = useTranslation(translations);
    const bus = useEventBus();

    const [state, send] = useMachine(offerRequestMachine, { 
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

    function update_check(event) {
        send({
            type: "UPDATE",
            field: event.target.name,
            value: event.target.checked
        });
    }

    function update_location(location) {
        send({
            type: "UPDATE",
            field: "location",
            value: location
        });
    }

    function submit(event) {
        event.preventDefault();
        send("SUBMIT");
    }

    // Make Webkit drop the forced autofill styles
    // by rewriting input values
    useEffect(() => {
        ["name", "email", "phone"]
        .map(id => document.getElementById(`offer-request-${id}`))
        .map(element => { element.value = `${element.value}`})
    });

    // set disabled state for the GeoApify location input
    // imperative code required to reach the component internals
    useEffect(() => {
        document
            .getElementsByClassName("geoapify-autocomplete-input")[0]
            .disabled = !state.matches("form");
    }, [state.matches("form")]) 

    const { cowCount } = state.context; 
    const UPDATE_COW_COUNT = useCallback((count) => { send({ type: "UPDATE_COW_COUNT", count }) }, []);


    return <aside className="OfferRequestForm">
        <form autoComplete="on" onSubmit={submit}>
            <label htmlFor="offer-request-name">{t.name.label}</label>
            <input id="offer-request-name" name="name"
                type="text" autoComplete="name" 
                placeholder={t.name.placeholder}
                disabled={!state.matches("form")}
                value={state.context.name} onChange={update}
                />

            <label htmlFor="offer-request-email">{t.email.label}</label>
            <input id="offer-request-email" type="email" name="email"
                placeholder={t.email.placeholder} 
                disabled={!state.matches("form")}
                value={state.context.email} onChange={update}
                />

            <label htmlFor="offer-request-phone">{t.phone.label}</label>
            <input id="offer-request-phone" type="tel" name="phone"
                placeholder={t.phone.placeholder} 
                disabled={!state.matches("form")}
                value={state.context.phone} onChange={update}
                />

            <label htmlFor="offer-request-location">{t.location.label}</label>
            <GeoapifyContext apiKey={geoapifyApiKey}>
                <GeoapifyGeocoderAutocomplete 
                    value={state.context.location?.properties.formatted}
                    placeholder={t.location.placeholder}
                    type="city"
                    lang={t.language}
                    biasByCountryCode={t.location.bias}
                    placeSelect={update_location}
                />
            </GeoapifyContext>

            <label htmlFor="offer-request-cows">{t.cowCount.label}</label>
            <CowCount id="offer-request-cows" 
                value={cowCount} onChange={UPDATE_COW_COUNT}
                disabled={!state.matches("form")}
                />

            <div className="tracking-types">
                <label>{t.tracking.start} </label>
                <label>
                    <input type="checkbox" checked disabled />
                    {t.tracking.calving}
                </label>
                <label> {t.tracking.mid} </label>
                <label>
                    <input type="checkbox"
                        name="postPartumTracking"
                        checked={state.context.postPartumTracking} 
                        onChange={update_check} 
                        disabled={!state.matches("form")}
                        />
                    {t.tracking.postPartum}
                </label>
                <label> {t.tracking.end}</label>
            </div>

            <Match state={state}>
                <State match="form.invalid">
                    <button id="request-offer" disabled>{t.button.invalid}</button>
                </State>
                <State match="form">
                    <button id="request-offer" type="submit">{t.button.submit}</button>
                </State>
                <State match="submission.error">
                    <label htmlFor="request-offer" className="problem">
                        {t.button.error.label}
                    </label>
                    <button id="request-offer" onClick={()=>send("RETRY")}>{t.button.error.text}</button>
                </State>
                <State match="submission.done">
                    <label htmlFor="request-offer">{t.button.done.label}</label>
                    <button id="request-offer" onClick={()=>send("ANOTHER")}>
                        {t.button.done.text}
                    </button>
                </State>
                <State match="submission.pending">
                    <button id="request-offer" disabled>{t.button.pending}</button>
                </State>
            </Match>
        </form>
    </aside>
}

