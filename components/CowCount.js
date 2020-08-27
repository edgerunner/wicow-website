import React, { useState, useMemo, useEffect } from "react";

const values = [10, 20, 50, 100, 200, 500, 1000]

export default function CowCount(props) {
    const [position, setPosition] = useState(3);

    const value = useMemo(() => {
        const floor = Math.floor(position);
        const ceiling = Math.ceil(position);
        const pos = position - floor;

        const base = values[floor];
        const target = values[ceiling];
        const delta = target - base;

        const difference = Math.floor(delta * pos);
        const result = base + difference;

        return result;
    }, [position])

    useEffect(() => props.onChange?.(value), [value, props.onChange]);

    return <div> 
        <input type="range" 
            list="cow-count" 
            value={position}
            onChange={e => setPosition(e.target.value)}
            min={0}
            max={6}
            step={0.01}
            />
        <output 
            htmlFor={props.id} 
            style={{left: `${position*13.5 + 2}%`}}>
                {value}
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
        <style jsx>{`
            div {
                position: relative;
                z-index: 0;
            }
            input[type="range"] {
                appearance: none;
                background: transparent;
                width: 100%;
                height: 4rem;
                border: solid .25rem var(--darkish);
                border-radius: .5rem;
                margin: 0;
                padding: .25rem;
            }
            
            input[type="range"]:focus {
                outline: none;
                box-shadow: 0 0 0 .03125rem var(--light)
            }

            input[type=range]::-webkit-slider-thumb {
                appearance: none;
                height: 3rem;
                width: 14.28%;
                border-radius: .25rem;
                background: var(--wicow-blue);
                border: none;
                cursor: pointer;
                margin: 0; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
                border: 1px solid var(--dark);
            }
            
            input[type=range]::-moz-range-thumb {
                appearance: none;
                height: 3rem;
                width: 14.28%;
                border-radius: .25rem;
                background: var(--wicow-blue);
                border: none;
                cursor: pointer;
                margin: 0;
                border: 1px solid var(--dark);
            }

            datalist {
                display: flex;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                padding: 0 .5rem;
                align-items: center;
                justify-content: space-around;
                z-index: -1;
            }
            datalist > option {
                display: block;
                color: var(--darkish);
                text-align: center;
                width: 5ch;
            }
            output {
                position: absolute;
                width: 14.28%;
                top: .5em;
                bottom: 0;
                text-align: center;
                pointer-events: none;
                color: var(--dark);
            }
        `}</style>
    </div>;
}