#!/usr/bin/env node

const xmldom = require('xmldom')
const DOMParser = xmldom.DOMParser
const XMLSerializer = xmldom.XMLSerializer
const svgpath = require('svgpath')

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

    absify(dom)

    stdout.write(new XMLSerializer().serializeToString(dom))
});

function absify(dom) {
    const slice = obj => Array.prototype.slice.call(obj)

    const on_child = node => {
        if (!node.tagName) {
            return
        }

        if (node.tagName.toLowerCase() === 'path') {
            const transform = node.getAttribute('transform')
            node.removeAttribute('transform')
            const d = svgpath(node.getAttribute('d')).transform(transform).abs().unshort().toString()
            node.setAttribute('d', d)
        }
        

        slice(node.childNodes).forEach(on_child)
    }

    slice(dom.documentElement.childNodes).forEach(on_child)
}

