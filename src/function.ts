import {Base} from "./lib/base";
import {Classes} from "./utils/classes";

export function generateClasses() {
    const customClasses: { className: string; cssRule: string }[] = [];

    Object.keys(Classes).forEach((classKey) => {
        const set = Classes[classKey]["set"];
        const value = Classes[classKey]["value"];

        if (value === "all") {
            Object.keys(Base[set]).forEach((colorKey) => {
                const colorValues = Base[set][colorKey];
                if (typeof colorValues === "object") {
                    Object.keys(colorValues).forEach((shade) => {
                        const cssRule = Classes[classKey][classKey];
                        const className = `${classKey}-${colorKey}-${shade}`;
                        customClasses.push({
                            className,
                            cssRule: `${cssRule}: ${colorValues[shade]};`
                        });
                    });
                } else {
                    const cssRule = Classes[classKey][classKey];
                    const className = `${classKey}-${colorKey}`;
                    customClasses.push({
                        className,
                        cssRule: `${cssRule}: ${colorValues};`
                    });
                }
            });
        } else {
            Object.entries(Classes[classKey]).forEach(([shortKey, cssProp]) => {
                if (shortKey === "set" || shortKey === "value") return;
                Object.keys(Base[set][value]).forEach((key) => {
                    const cssRule = cssProp;
                    const className = `${shortKey}-${key}`;
                    customClasses.push({
                        className,
                        cssRule: `${cssRule}: ${Base[set][value][key]};`
                    });
                });
            });
        }
    });

    return customClasses;
}