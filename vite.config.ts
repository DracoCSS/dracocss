import {defineConfig} from "vite";
import fs from 'fs'
import path from 'path'
import {parseHTML} from "linkedom";
import chalk from "chalk";
import {generateClasses} from "./src/function";

export default defineConfig({
    plugins: [
        {
            name: 'DracoCss',
            configResolved(config) {
                console.log(chalk.hex('#f1b46c')('[DracoCss] ') + 'Configuration resolved');
                console.log(chalk.hex('#f1b46c')('[DracoCss] ') + generateClasses().length + ' classes loaded');

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

                const generatedClasses = generateClasses();

                const distFile = "draco.dist.css";
                let fileExist = fs.existsSync(path.resolve(__dirname, distFile));
                if (!fileExist) {
                    fs.writeFileSync(path.resolve(__dirname, distFile));
                }
                fs.readFileSync(path.resolve(__dirname, distFile), "utf-8");


                generatedClasses.forEach((c) => {
                    if (classSet.has(c.className)) {
                        console.log(`Writing class ${c.className}`);
                        fs.writeFileSync(path.resolve(__dirname, distFile), `.${c.className} {${c.cssRule}}\n\n`, {flag: 'a'});
                    }
                    return;
                })

                server.ws.send({
                    type: 'full-reload',
                });

            }

        },
    ],
})