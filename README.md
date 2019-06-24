# svg-utils-cli

A set of minimal CLIs that processes SVG data.

## svg-pathify

Convert shapes (circle,ellipse,line,polygon,polyline,rect) to paths.

$ cat [test.svg](./test/test.svg) | svg-pathify > [pathified.svg](./test/pathified.svg)

## svg-absify

Convert relative path commands (mlhvqcTtSsz) to absolute ones (MLHVQCZ).

$ cat [test.svg](./test/test.svg) | svg-absify > [absified.svg](./test/absified.svg)

## svg-ungroup

Copy all attributes of `g` to its children then remove it.

$ cat [test.svg](./test/test.svg) | svg-ungroup > [ungrouped.svg](./test/ungrouped.svg)

