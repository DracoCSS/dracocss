import { classic, value as properties, text } from "./properties";
import { value as types } from "./value";

export function generateClasses() {
    const classes : {className: string, cssRule: string}[] = []

    Object.keys(types).forEach((typeKey) => {
        const typeProperties = types[typeKey];

        const valueSetKey = typeProperties["valueSet"];
        let valueSet;

        switch (valueSetKey) {
            case "properties":
                valueSet = properties;
                break;
            case "classic":
                valueSet = classic;
                break;
            case "text":
                valueSet = text;
                break;
            default:
                valueSet = {};
        }

        Object.keys(typeProperties).forEach((propertyKey) => {
            if (propertyKey === "valueSet") return;

            const cssProperty = typeProperties[propertyKey];

            Object.keys(valueSet).forEach((valueKey) => {
                const cssValue = valueSet[valueKey];

                const className = `${propertyKey}-${valueKey}`;
                const cssRule = `${cssProperty}: ${cssValue};`;

                classes.push({ className, cssRule });
            });
        });
    });

    return classes;
}
