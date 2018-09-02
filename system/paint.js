const state = require('./state');
const symbols = require('./symbols');

function paint (widget) {
    const webgl = state.get(symbols.WEBGL);
    const cache = widget[ symbols.CACHE ];
    const x = widget[ symbols.X ];
    const y = widget[ symbols.Y ];

    webgl.uniform('wtk_Texture', cache);
    webgl.texture(webgl.context.TEXTURE_2D, webgl.context.TEXTURE_MAG_FILTER, webgl.context.NEAREST);

    webgl.input('wtk_Sample', new Float32Array([
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1
    ]));

    webgl.input('wtk_Coordinates', new Float32Array([
        x, y,
        x + cache.width, y,
        x, y + cache.height,
        x, y + cache.height,
        x + cache.width, y,
        x + cache.width, y + cache.height
    ]));

    webgl.draw(6);

    // global.requestAnimationFrame(() => paint(widget));
}

module.exports = paint;
