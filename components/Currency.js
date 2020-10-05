import { useMemo } from "react";
import { useLocale } from "../hooks";

export function Currency({ value, unit, fallback = null }) {
    if (!value) { return fallback; }
    const locale = useLocale();
    const formatter = useMemo(() => Intl.NumberFormat(locale, {
        style: 'currency', currency: unit, maximumSignificantDigits: 2
    }), [locale]);

    const parts = formatter.formatToParts(value);

    return <data value={value}>{
        parts.map((part, index) => 
            part.type === "currency" 
            ? <small key={index}>{part.value}</small>
            : part.value
        )
    }</data>;
}