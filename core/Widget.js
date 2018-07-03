const Event = require('vorge/core/Event');

module.exports = class Widget extends Event.Emitter {

    constructor (options) {
        super('widget');

        Object.apply(this, {
            position: {
                x: options.x || 0,
                y: options.y || 0
            },
            size: {
                width: options.width || 0,
                height: options.height || 0
            },
            style: options.style,
            texture: options.texture
        });
    }

    render () {
        const { position, size } = this;
        const { x, y } = position;
        const { width, height } = size;

        const sample = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1
        ]);

        const coordinates = new Float32Array([
            (x | 0), (y | 0),
            (x | 0) + width, (y | 0),
            (x | 0), (y | 0) + height,
            (x | 0), (y | 0) + height,
            (x | 0) + width, (y | 0),
            (x | 0) + width, (y | 0) + height
        ]);
    }
};
