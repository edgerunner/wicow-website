export default function QuestionForm() {
    return <aside className="QuestionForm">
        <form autoComplete="on">
            <label htmlFor="question-name">Hello, my name is</label>
            <input id="question-name" 
                type="text" autoComplete="name" 
                placeholder="Peter? Simone? Rahul?"/>

            <label htmlFor="question-email">and my email address is</label>
            <input id="question-email" type="email" 
                placeholder="you@yourfarm.com"/>

            <label htmlFor="question-question">My question is</label>
            <textarea id="question-question" placeholder="How do I …"/>

            <button id="question-ask" type="submit">Ask Tolga</button>
        </form>
    </aside>
}