const symbols = require('./symbols');

function diff (a, b) {

    if (!a && !b) {
        return null;
    }

    if (a && !b) {
        return null;
    }

    if (!a && b) {
        return b;
    }

    if (a.constructor !== b.constructor) {
        return b;
    }

    if (a.children.length > b.children.length) {
        return Object.assign(a, b, {
            [ symbols.CHILDREN ]: a[ symbols.CHILDREN ].map((widget, i) => diff(widget, b[ symbols.CHILDREN ][ i ]))
        });
    }

    return Object.assign(a, b, {
        [ symbols.CHILDREN ]: b[ symbols.CHILDREN ].map((widget, i) => diff(a[ symbols.CHILDREN ][ i ], widget))
    });
}

module.exports = diff;
