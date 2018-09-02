const Widget = require('../core/Widget');

const rgba = require('../color/rgba');
const sample = require('../color/sample');

const state = require('../system/state');
const symbols = require('../system/symbols');

class Rectangle extends Widget {

    get style () {
        return {
            default: {
                [ symbols.HOST ]: {
                    width: 100,
                    height: 100,
                    fill: rgba(0, 0, 0, 255),
                    sample: sample(0, 0, 1, 1),
                    stroke: rgba(255, 0, 0, 255),
                    border: 12,
                    shadow: rgba(0, 0, 0, 255),
                    blur: 0
                }
            }
        }
    }

    paint () {
        const canvas = this[ symbols.CACHE ];
        const style = this[ symbols.STYLE ];
        const webgl = this[ symbols.WEBGL ];
        const { blur, border, fill, height, sample, stroke, width } = style.get(symbols.HOST);

        canvas.width = width + (border * 2);
        canvas.height = height + (border * 2);

        webgl.attach(canvas);
        webgl.viewport(0, 0, canvas.width, canvas.height);
        webgl.clear(0, 0, 0, 0);

        webgl.uniform('wtk_Resolution', new Float32Array([
            canvas.width,
            canvas.height
        ]));

        webgl.uniform('wtk_Texture', fill);
        webgl.texture(webgl.context.TEXTURE_2D, webgl.context.TEXTURE_MAG_FILTER, webgl.context.NEAREST);

        webgl.input('wtk_Sample', sample);

        webgl.input('wtk_Coordinates', new Float32Array([
            border, border,
            width + border, border,
            border, height + border,
            border, height + border,
            width + border, border,
            width + border, height + border
        ]));

        webgl.draw(6);

        if (border) {
            const coordinates = [
                new Float32Array([
                    0, 0,
                    width + (border * 2), 0,
                    border, border,
                    border, border,
                    width + (border * 2), 0,
                    width + border, border
                ]),
                new Float32Array([
                    width + border, border,
                    width + (border * 2), 0,
                    width + border, height + border,
                    width + border, height + border,
                    width + (border * 2), 0,
                    width + (border * 2), height + (border * 2)
                ]),
                new Float32Array([
                    border, height + border,
                    width + border, height + border,
                    0, height + (border * 2),
                    0, height + (border * 2),
                    width + border, height + border,
                    width + (border * 2), height + (border * 2)
                ]),
                new Float32Array([
                    0, 0,
                    border, border,
                    0, height + (border * 2),
                    0, height + (border * 2),
                    border, border,
                    border, height + border
                ])
            ];

            for (let i = 0, count = 4; i < count; i++) {
                webgl.uniform('wtk_Texture', stroke);
                webgl.texture(webgl.context.TEXTURE_2D, webgl.context.TEXTURE_MAG_FILTER, webgl.context.NEAREST);

                webgl.input('wtk_Sample', sample);

                webgl.input('wtk_Coordinates', coordinates[ i ]);

                webgl.draw(6);
            }
        }
    }
}

module.exports = Rectangle;
