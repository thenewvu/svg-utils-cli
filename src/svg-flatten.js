#!/usr/bin/env node

const xmldom = require('xmldom')
const DOMParser = xmldom.DOMParser
const XMLSerializer = xmldom.XMLSerializer

const stdin = process.stdin
stdin.setEncoding('utf8');

const stdout = process.stdout
stdout.setEncoding('utf8');

const stderr = process.stderr
stderr.setEncoding('utf8');

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

    flatten(dom)

    stdout.write(new XMLSerializer().serializeToString(dom))
});

function flatten(dom) {
    const slice = obj => Array.prototype.slice.call(obj)

    const on_child = (node, attrs) => {
        if (!node.tagName) {
            return
        }

        const tag = node.tagName.toLowerCase()
        const children = slice(node.childNodes)
        const parent = node.parentNode

        if (parent.tagName.toLowerCase() === 'g') {
            parent.parentNode.insertBefore(node, parent)
        }

        if (tag !== 'g') {
            slice(attrs).forEach(a => {
                node.setAttribute(a.name, a.value)
            })
        }

        if (tag === 'g') {
            attrs = [...new Set([...attrs, ...slice(node.attributes)])]
        }

        children.forEach(child => {
            on_child(child, attrs)
        })

        if (tag === 'g') {
            parent.removeChild(node)
        }
    }

    slice(dom.documentElement.childNodes).forEach(child => {
        on_child(child, [])
    })
}

