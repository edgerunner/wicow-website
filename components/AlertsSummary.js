const dummyData = {
    perfect: 1812,
    eventual: 23,
    false: 4,
    missed: 2,
    latest: { name: "Sarıkız", country: "TR", time: Date.now() - 86400000 }
}

export default function AlertsSummary() {
    return <aside className="AlertsSummary">
        <dl>
            <dt>Calvings accurately detected on first attempt</dt>
            <dd><em>{dummyData.perfect}</em></dd>

            <dt>Calvings eventually detected on later attempts</dt>
            <dd>{dummyData.eventual}</dd>

            <dt>Undetected calvings with previous false alerts</dt>
            <dd>{dummyData.false}</dd>

            <dt>Undetected calvings without any alerts</dt>
            <dd>{dummyData.missed}</dd>
        </dl>
    </aside>;
}

