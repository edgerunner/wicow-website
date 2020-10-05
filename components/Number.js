import { useLocale } from "../hooks";

export function Number({ value, fallback = null }) {
    if (!value) { return fallback; }
    const locale = useLocale();
    return <data value={value}>{value.toLocaleString(locale)}</data>;
}
