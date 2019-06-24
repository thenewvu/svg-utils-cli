#!/usr/bin/env node

const xmldom = require('xmldom')
const DOMParser = xmldom.DOMParser
const XMLSerializer = xmldom.XMLSerializer
const toPath = require('svg-points').toPath

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

    pathify(dom)

    stdout.write(new XMLSerializer().serializeToString(dom))
});

function pathify(dom) {
    const slice = obj => Array.prototype.slice.call(obj)

    const SHAPES = {
        circle: ['cx', 'cy', 'r'],
        ellipse: ['cx', 'cy', 'rx', 'ry'],
        line: ['x1', 'y1', 'x2', 'y2'],
        polygon: ['points'],
        polyline: ['points'],
        rect: ['x', 'y', 'width', 'height', 'rx', 'ry'],
    }

    const on_child = node => {
        if (!node.tagName) {
            return
        }

        const tag = node.tagName.toLowerCase()
        if (tag in SHAPES) {
            const new_node = dom.createElement('path')
            const shape = {type: tag}
            SHAPES[tag].forEach(a => {
                if (a === 'points') {
                    shape[a] = node.getAttribute(a)
                } else {
                    shape[a] = parseFloat(node.getAttribute(a))
                }
                node.removeAttribute(a)
            })
            new_node.setAttribute('d', toPath(shape))
            slice(node.attributes).forEach(a => {
                new_node.setAttribute(a.name, a.value)
            })
            node.parentNode.replaceChild(new_node, node)
        }

        slice(node.childNodes).forEach(on_child)
    }

    slice(dom.documentElement.childNodes).forEach(on_child)
}

