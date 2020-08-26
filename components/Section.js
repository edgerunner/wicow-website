export default function Section({title, subtitle}) {
    
    return ({children: content}) =>
        {
            return <section>
                <h1>{title}</h1>
                <h2>{subtitle}</h2>
                {content}
            </section>;
        }
}