import { Children } from "react"

export function Match({ children, state }) {
    let selected = null;
    Children.forEach(children, child => {
        if (!selected &&
            child.type === State &&
            state.matches(child.props.match)) {
            selected = child;
        }
    });
    return selected;
}
export function State({ children }) {
    return children;
}
