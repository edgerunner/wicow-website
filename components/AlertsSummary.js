import { useCallback, useEffect, useReducer } from "react";
import { useLocale } from "../hooks";

const polling_timeout = process.env.NEXT_PUBLIC_FETCH_POLLING_INTERVAL;
const retry_timeout = process.env.NEXT_PUBLIC_FETCH_RETRY_INTERVAL;

export default function AlertsSummary() {
    const [state, dispatch] = useReducer(reducer, { initial: true });

    const getAlerts = useCallback(() => {
        dispatch({type: "start"});
        fetchAlerts()
            .then(data => dispatch({type: "success", data}))
            .catch(error => dispatch({type: "error", error}));
    }, [dispatch]);

    useEffect(() => {
        if (state.initial) { getAlerts() }
        if (state.error) { return timeout(getAlerts, retry_timeout); }
        if (state.data) { return timeout(getAlerts, polling_timeout); }
    }, [state]);



    return <aside className="AlertsSummary">
        <dl>
            <dt>Calvings accurately detected on first attempt</dt>
            <dd><em><Number value={state.data?.perfect} fallback="…"/></em></dd>

            <dt>Calvings eventually detected on later attempts</dt>
            <dd><Number value={state.data?.eventual} fallback="…"/></dd>

            <dt>Undetected calvings with previous false alerts</dt>
            <dd><Number value={state.data?.false_} fallback="…"/></dd>

            <dt>Undetected calvings without any alerts</dt>
            <dd><Number value={state.data?.missed} fallback="…"/></dd>
        </dl>
    </aside>;
}

async function fetchAlerts() { return (await fetch("/api/alerts")).json(); }

function timeout(callback, duration) {
    const id = setTimeout(callback, duration);
    return () => clearTimeout(id);
}

function reducer(state, action) {
    switch (action.type) {
        case "success": return { data: action.data };
        case "error": return { error: action.error, data: state.data };
        case "start": return { loading: true, error: state.error, data: state.data };
    }
}

function Number({value, fallback = null}) {
    if (!value) { return fallback; }
    const locale = useLocale();
    return <data value={value}>{value.toLocaleString(locale)}</data>;
}
