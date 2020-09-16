import { useEffect, useReducer } from "react";
import { useLocale } from "../hooks";


export default function AlertsSummary() {
    const [state, dispatch] = useReducer(reducer, { initial: true });

    useEffect(() => {
        if (state.initial) {
            dispatch({type: "loading"});
            async function fetchAlerts() {
                const res = await fetch("/api/alerts");
                res
                    .json()
                    .then(data => dispatch({type: "success", data}))
                    .catch(error => dispatch({type: "error", error}));
            };
            fetchAlerts();
        }
    }, []);



    return <aside className="AlertsSummary">{
        state?.data 
        ? <dl>
            <dt>Calvings accurately detected on first attempt</dt>
            <dd><em><Number value={state.data.perfect}/></em></dd>

            <dt>Calvings eventually detected on later attempts</dt>
            <dd><Number value={state.data.eventual}/></dd>

            <dt>Undetected calvings with previous false alerts</dt>
            <dd><Number value={state.data.false_}/></dd>

            <dt>Undetected calvings without any alerts</dt>
            <dd><Number value={state.data.missed}/></dd>
        </dl>
        : <>…</>
    }</aside>;
}

function reducer(state, action) {
    switch (action.type) {
        case "success": return { data: action.data };
        case "error": return { error: action.error };
        case "loading": return { loading: true };
    }
}

function Number({value}) {
    const locale = useLocale();
    return <data value={value}>{value.toLocaleString(locale)}</data>;
}
