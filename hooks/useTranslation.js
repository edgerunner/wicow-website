import React, { useMemo } from 'react';
import { useLocale } from '.';

export function useTranslation(translations) {
    const locale = useLocale();
    return useMemo(() => translations[locale], [translations]);
}

export function Translate({ keys, mapping }) {
    if (!keys) { return null; }
    if (keys instanceof Array) {
        return keys.map((key, index) => <React.Fragment key={index}><Translate keys={key} mapping={mapping} /> </React.Fragment>
        );
    }

    if (typeof keys === "string") { return <>{keys}</>; }

    if (keys.hasOwnProperty('var')) { return <>{mapping[keys.var]}</>; }

    if (keys.hasOwnProperty('map')) {
        const [key, choices] = Object.entries(keys.map)[0];
        const chosen = mapping[key];
        return <Translate keys={choices[chosen]} mapping={mapping} />;
    }

    const [key, value] = Object.entries(keys)[0];
    if (key.match(/^[A-Z]/)) {
        const Component = mapping[key];
        return <Component {...value} />;
    }

    if (key.match(/^[a-z]/)) {
        return React.createElement(key, {}, <Translate keys={value} mapping={mapping} />);
    }

    return null;
}
