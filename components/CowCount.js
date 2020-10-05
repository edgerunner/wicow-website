import React, { useMemo, useCallback } from "react";

const values = [10, 20, 50, 100, 200, 500, 1000]

function valueToPosition(value) {
    const lower = [...values].reverse().find(v => v <= value);
    const upper = values.find(v => v > value) || lower + 1;
    const range = upper - lower;

    const offset = value - lower;
    const delta = offset / range;
    
    const floor = values.indexOf(lower);
    const newPosition = floor + delta;

    return newPosition;
}

function positionToValue(position) {
    const floor = Math.floor(position);
    const ceiling = Math.ceil(position);
    const pos = position - floor;

    const base = values[floor];
    const target = values[ceiling];
    const delta = target - base;

    const difference = Math.round(delta * pos);
    const result = base + difference;

    return result;
}

export default function CowCount(props) {

    const position = useMemo(() => valueToPosition(props.value), [props.value]);

    const change = useCallback((event) => {
        props.onChange?.(positionToValue(event.target.value))
    }, [position, props.onChange]);

    return <div className="CowCount"> 
        <input type="range" 
            id={props.id}
            list="cow-count" 
            value={position}
            onChange={change}
            min={0}
            max={6}
            step={0.01}
            />
        <output 
            htmlFor={props.id} 
            style={{left: `${position*13.5 + 2}%`}}>
                {props.value}
        </output>
        <datalist id="cow-count">
            <option value={0}>10</option>
            <option value={1}>20</option>
            <option value={2}>50</option>
            <option value={3}>100</option>
            <option value={4}>200</option>
            <option value={5}>500</option>
            <option value={6}>1000</option>
        </datalist>
    </div>;
}