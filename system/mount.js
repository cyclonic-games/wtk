const Painter = require('picasso/core/Painter');

const fragment = require('../shaders/fragment');
const vertex = require('../shaders/vertex');

const paint = require('./paint');
const render = require('./render');
const state = require('./state');
const symbols = require('./symbols');

function mount (canvas, type, properties, children) {
    const webgl = new Painter(canvas);

    webgl.initialize('wtk', fragment, vertex);
    webgl.uniform('wtk_Resolution', new Float32Array([ canvas.width, canvas.height ]));

    state.set(symbols.OWNER, [ ]);
    state.set(symbols.WEBGL, webgl);

    const application = render(type, properties, children);

    application.subscribe('ready').forEach(() => paint(application));

    console.log(application)

    return application;
}

module.exports = mount;
