#!/usr/bin/env node

const xmldom = require('xmldom')
const DOMParser = xmldom.DOMParser
const XMLSerializer = xmldom.XMLSerializer

const stdin = process.stdin
stdin.setEncoding('utf8');

const stdout = process.stdout
stdout.setDefaultEncoding('utf8');

const stderr = process.stderr
stderr.setDefaultEncoding('utf8');

let data = ''

stdin.on('data', (chunk) => {
  data += chunk
});
stdin.on('end', () => {
    const dom = new DOMParser().parseFromString(data, 'application/xml')
    if (!dom.documentElement) {
        stderr.write('Failed to parser svg data.\n')
        process.exit(1)
    }

    defsify(dom)

    stdout.write(new XMLSerializer().serializeToString(dom))
});

function defsify(dom) {
    const slice = obj => Array.prototype.slice.call(obj)

    const root = dom.documentElement
    const rootChildren = slice(root.childNodes)
    let lastChild = null
    for (let i = rootChildren.length - 1; i >= 0; i-- ) {
        lastChild = rootChildren[i]
        if (lastChild && lastChild.tagName) break
    }
    let lastDefs = null
    if (lastChild.tagName.toLowerCase() === 'defs') {
        lastDefs = lastChild
    } else {
        lastDefs = dom.createElement('defs')
        root.appendChild(lastDefs)
    }

    const on_child = node => {
        if (!node.tagName) {
            return
        }

        const tag = node.tagName.toLowerCase()

        if (tag === 'defs') {
            if (node !== lastDefs) {
                slice(node.childNodes).forEach((child) => {
                    lastDefs.appendChild(child)
                })
                node.parentNode.removeChild(node)
                lastDefs.appendChild(node)
            }
            return
        }
        else
        if (tag === 'mask' || 
            tag === 'clipPath' || 
            tag === 'linearGradient' ||
            tag === 'radialGradient' ||
            tag === 'filter') {
            lastDefs.appendChild(node)
            return
        }

        slice(node.childNodes).forEach(on_child)
    }

    slice(dom.documentElement.childNodes).forEach(on_child)
}

