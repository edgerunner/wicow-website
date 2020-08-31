export default function Section() {
    return ({children: content, id}) => 
            <section id={id}>{content}</section>;  
}