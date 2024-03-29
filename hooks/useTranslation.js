import React, { useMemo } from 'react';
import { useLocale } from '.';
import harmonize from './harmonize';

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

    const [key, value] = Object.entries(keys)[0];

    if (key === "var") { return <>{mapping[value]}</>; }

    if (key === "map") {
        const [mapkey, choices] = Object.entries(value)[0];
        const chosen = mapping[mapkey];
        return <Translate keys={choices[chosen]} mapping={mapping} />;
    }

    if (key === "pluralize") { 
        const count = value?.count ? mapping[value.count] : (mapping.count || 0);
        return <Plural {...{...value, count}} />;
    }

    const key_harmonize = key.match(/^harmonize\.([.a-z]+)$/);
    if (key_harmonize) {
        return harmonize(key_harmonize[1], mapping[value]);
    }

    if (key.match(/^[A-Z]/)) {
        const Component = mapping[key];
        return <Component {...value} />;
    }

    if (key.match(/^[a-z]/)) {
        return React.createElement(key, {}, <Translate keys={value} mapping={mapping} />);
    }

    return null;
}

function Plural({count, singular, plural, zero}) {
    return (count > 1 && plural) || (!!count ? singular : zero) || null;
}