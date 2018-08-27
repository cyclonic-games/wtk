const Widget = require('../core/Widget');

const rgba = require('../color/rgba');

const symbols = require('../system/symbols');

class Rectangle extends Widget {

    paint () {
        const { border, fill, height, sample, stroke, width } = this[ symbols.STYLE ];
        const canvas = this[ symbols.CACHE ];
        const webgl = this[ symbols.WEBGL ];

        canvas.width = width + (border * 2);
        canvas.height = height + (border * 2);

        webgl.attach(canvas);

        webgl.uniform('wtk_Texture', fill);
        webgl.context.texParameteri(webgl.context.TEXTURE_2D, webgl.context.TEXTURE_MAG_FILTER, webgl.context.NEAREST);

        webgl.input('wtk_Sample', sample);

        webgl.input('wtk_Points', new Float32Array([
            border, border ,
            width + border, border,
            border, height + border,
            border, height + border,
            width + border, border,
            width + border, height + border
        ]));

        webgl.draw(6);
    }
}

module.exports = Rectangle;
