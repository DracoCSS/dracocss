import {classic} from "./properties";
import {margin, padding} from "./value";

export const generateClasses = (properties, value) => {
    const classes = {};

    for (const [key, rdProperty] of Object.entries(value)) {
        for (const [size, value] of Object.entries(properties)) {
            const className = `${key}${size === "" ? "" : "-"}${size}`;
            classes[className] = {
                [rdProperty]: typeof value === "number" ? `${value}rem` : value,
            };
        }
    }
    return classes
};

const p = generateClasses(classic, padding);
const m = generateClasses(classic, margin);