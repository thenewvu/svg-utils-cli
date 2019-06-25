# svg-utils-cli

A set of minimal CLIs that processes SVG data.

## svg-pathify

Convert shapes (circle,ellipse,line,polygon,polyline,rect) to paths.

$ cat [test.svg](./test/test.svg) | svg-pathify > [pathified.svg](./test/pathified.svg)

## svg-absify

Convert relative path commands (mlhvqcTtSsaz) to absolute ones (MLHVQCAZ).

$ cat [test.svg](./test/test.svg) | svg-absify > [absified.svg](./test/absified.svg)

## svg-ungroup

Copy all attributes of `g` to its children then remove it recursively.

$ cat [test.svg](./test/test.svg) | svg-ungroup > [ungrouped.svg](./test/ungrouped.svg)

## svg-defsify

Move (mask|clipPath|linearGradient|radialGradient|filter) to a single `defs` at
the end of svg document.

$ cat [test.svg](./test/test.svg) | svg-defsify > [defsified.svg](./test/defsified.svg)

