const symbols = require('./symbols');

function render (type, properties, children = [ ]) {
    const widget = new type(properties, children);

    // TODO cache on own canvas

    return widget;
}

module.exports = render;
