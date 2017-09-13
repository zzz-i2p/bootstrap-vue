#!/usr/bin/env node

const { resolve } = require("path");
const { readFileSync, existsSync, writeFile } = require("fs");
const { kebabCase } = require("lodash");
const BV = require("../dist/bootstrap-vue");
const cache = {
    "element-tags": {}
    // directives: {}
};

class JsonSet extends Set {
    toJSON() {
        return Array.from(this);
    }
}

function writeFile$(path, data, options) {
    return new Promise((resolve, reject) => {
        writeFile(path, data, options, err => {
            err ? reject(err) : resolve();
        });
    });
}

function cacheLibMeta() {
    BV.install({
        component(name, def) {
            const tagName = kebabCase(name);
            const metapath = resolve(
                __dirname,
                "../docs/components/",
                tagName
                    .split("-")
                    .filter(s => s !== "b")
                    .join("-"),
                "meta.json"
            );
            let metaDoc = {};
            if (existsSync(metapath)) {
                metaDoc = JSON.parse(readFileSync(metapath));
            }
            cache["element-tags"][tagName] = Object.keys(def.props || {}).reduce(
                (meta, prop) => {
                    meta.attributes.add(kebabCase(prop));
                    meta.description = metaDoc.description || `Bootstrap-Vue component: <${tagName}>`;
                    if (metaDoc.components) {
                        metaDoc.components.map(name => meta.subtags.add(kebabCase(name)));
                    }
                    if (metaDoc.events) {
                        metaDoc.events.map(e => meta.attributes.add(e.event));
                    }
                    return meta;
                },
                { attributes: new JsonSet(), subtags: new JsonSet(), description: "" }
            );
        },
        directive(name, def) {
            // cache.directives[kebabCase(name)] = def;
        }
    });
}

async function main() {
    cacheLibMeta();
    for (const basename in cache) {
        if (cache.hasOwnProperty(basename)) {
            await writeFile$(resolve(__dirname, "..", `${basename}.json`), JSON.stringify(cache[basename], null, 2));
        }
    }
}

try {
    main();
} catch (err) {
    console.error(err);
}
