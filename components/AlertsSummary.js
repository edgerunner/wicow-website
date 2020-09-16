import { useLocale } from "../hooks";

const dummyData = {
    perfect: 1812,
    eventual: 23,
    false_: 4,
    missed: 2,
    latest: { name: "Sarıkız", country: "TR", time: Date.now() - 86400000 }
}

export default function AlertsSummary() {
    return <aside className="AlertsSummary">
        <dl>
            <dt>Calvings accurately detected on first attempt</dt>
            <dd><em><Number value={dummyData.perfect}/></em></dd>

            <dt>Calvings eventually detected on later attempts</dt>
            <dd><Number value={dummyData.eventual}/></dd>

            <dt>Undetected calvings with previous false alerts</dt>
            <dd><Number value={dummyData.false_}/></dd>

            <dt>Undetected calvings without any alerts</dt>
            <dd><Number value={dummyData.missed}/></dd>
        </dl>

    </aside>;
}

function Number({value}) {
    const locale = useLocale();
    return <data value={value}>{value.toLocaleString(locale)}</data>;
}
