import { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";
import { parseHTML } from "linkedom";
import chalk from "chalk";
import { generateClasses } from "./function";

function dracoCss(): Plugin {
    return {
        name: "DracoCss",
        configResolved() {
            console.log(
                chalk.hex("#f1b46c")("[DracoCss] ") + "Configuration resolved"
            );
            console.log(
                chalk.hex("#f1b46c")("[DracoCss] ") +
                generateClasses().length +
                " classes loaded"
            );
        },
        handleHotUpdate({ file, server }) {
            console.log(
                chalk.hex("#f1b46c")("[DracoCss] ") + "Hot update detected in " + file
            );

            const classSet = new Set();
            const fileContent = fs.readFileSync(file, "utf-8");

            const document = parseHTML(fileContent);
            let elements = document.document.querySelectorAll("[class]");
            const templateMatch = fileContent.match(/<template[^>]*>([\s\S]*?)<\/template>/);
            if (elements.length === 0) {
                if (templateMatch) {
                    elements = parseHTML(templateMatch[1]).document.querySelectorAll("[class]");
                }
            }

            elements.forEach((element) => {
                const classes = element.getAttribute("class");
                classes.split(" ").forEach((classItem) => {
                    classSet.add(classItem);
                });
            });

            console.log(classSet);

            const generatedClasses = generateClasses();

            // Utiliser le dossier racine du projet
            const projectRoot = process.cwd();
            const distFile = path.resolve(projectRoot, "draco.dist.css");

            if (!fs.existsSync(distFile)) {
                fs.writeFileSync(distFile, "");
            }

            generatedClasses.forEach((c) => {
                if (classSet.has(c.className)) {
                    if (fs.readFileSync(distFile, "utf-8").includes(`.${c.className}`)) {
                        return;
                    }
                    console.log(`Writing class ${c.className}`);
                    fs.appendFileSync(distFile, `.${c.className} {${c.cssRule}}\n\n`);
                }
            });

            server.ws.send({
                type: "full-reload",
            });
        },
    };
}

export default dracoCss;
