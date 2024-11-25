import {defineConfig} from "vite";
import fs from 'fs'
import path from 'path'
import {parseHTML} from "linkedom";
import chalk from "chalk";
import {value} from "./value";

export default defineConfig({
    plugins: [
        {
            name: 'DracoCss',
            configResolved(config) {
                console.log(chalk.hex('#f1b46c')('[DracoCss] ') + 'Configuration resolved');
                console.log(chalk.hex('#f1b46c')('[DracoCss] ') + 'Spacing configuration:');
                console.log(value);
            },
            handleHotUpdate({file, server}) {
                console.clear();
                console.log(chalk.hex('#f1b46c')('[DracoCss] ') + 'Hot update detected');

                const classSet = new Set();
                const fileContent = fs.readFileSync(file, "utf-8");

                let document = parseHTML(fileContent);
                const elements = document.document.querySelectorAll("[class]");


                elements.forEach((element) => {
                    const classes = element.getAttribute("class");
                    if (classes.split(" ").length > 1) {
                        classes.split(" ").forEach((classItem) => {
                            classSet.add(classItem);
                        });
                        return;
                    }
                    classSet.add(classes);
                });

                const cssFile = fs.readFileSync(path.resolve(__dirname, "draco.css"), "utf-8");
                const distFile = "draco.dist.css";
                let fileExist = fs.existsSync(path.resolve(__dirname, distFile));
                if (!fileExist) {
                    fs.writeFileSync(path.resolve(__dirname, distFile), 'utf-8');
                }
                fs.readFileSync(path.resolve(__dirname, distFile), "utf-8");
                const classObjects = {};

                const cssRegex = /\.(\w[\w-]*)\s*\{([^}]*)\}/g;
                let match;

                while ((match = cssRegex.exec(cssFile)) !== null) {
                    const className = match[1];
                    classObjects[className] = match[2].trim();
                }

                for (const className of classSet) {
                    if (classObjects[className] === undefined) {
                        continue;
                    }
                    console.log(`Writing class ${className}`);
                    if (fs.readFileSync(path.resolve(__dirname, distFile), "utf-8").includes(className)) {
                        const regex = new RegExp(`\\.${className}\\s*\\{([^}]*)\\}`, "g");
                        const match = regex.exec(fs.readFileSync(path.resolve(__dirname, distFile), "utf-8"));
                        if (match !== null) {
                            const oldClass = match[1].trim();
                            const newClass = classObjects[className];
                            if (oldClass === newClass) {
                                console.log(`Class ${className} is the same, skipping`);
                                continue;
                            }
                            console.log(`Class ${className} is different, updating`);
                            const newContent = fs.readFileSync(path.resolve(__dirname, distFile), "utf-8").replace(regex, `.${className} {${newClass}}`);
                            fs.writeFileSync(path.resolve(__dirname, distFile), newContent);
                            server.ws.send({
                                type: 'full-reload',
                            });
                        }
                    }
                    fs.writeFileSync(path.resolve(__dirname, distFile), `.${className} {${classObjects[className]}}\n\n`, {flag: 'a'});
                    server.ws.send({
                        type: 'full-reload',
                    });
                }
            }

        },
    ],
})