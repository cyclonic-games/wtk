const Event = require('./Event');

const diff = require('../system/diff');
const state = require('../system/state');
const symbols = require('../system/symbols');

class Widget extends Event.Emitter {

    [ symbols.RENDER ] () {
        state.get(symbols.OWNER).push(this);

        const before = this[ symbols.TREE ];
        const after = this.render();

        state.get(symbols.OWNER).pop();

        if (before.length > after.length) {
            this[ symbols.TREE ] = before.map((widget, i) => diff(widget, after[ i ]));
        }
        else {
            this[ symbols.TREE ] = after.map((widget, i) => diff(before[ i ], widget));
        }

        this.emit('render', null);
    }

    [ symbols.PAINT ] () {
        for (const widget of this[ symbols.TREE ]) if (widget) {
            widget[ symbols.PAINT ]();
        }

        this.paint();
        this.emit('paint', null);
    }

    [ symbols.UPDATE ] () {
        global.requestAnimationFrame(() => {
            this[ symbols.RENDER ]();

            global.requestAnimationFrame(() => {
                this[ symbols.PAINT ]();
            });
        });

        this.emit('update', null);
    }

    get children () {
        return this[ symbols.CHILDREN ];
    }

    get id () {
        return this[ symbols.ID ];
    }

    set id (id) {
        this[ symbols.ID ] = id;
    }

    get owner () {
        return this[ symbols.OWNER ];
    }

    get parent () {
        return this[ symbols.PARENT ];
    }

    get state () {
        return this[ symbols.STATE ];
    }

    get style () {
        return { };
    }

    set style (style) {
        this[ symbols.STYLE ].assigned = style;
    }

    constructor (properties = { }, children = [ ]) {
        super();

        Object.assign(this, this.constructor.defaultProperties, properties, {
            [ symbols.CACHE ]: global.document.createElement('canvas'),
            [ symbols.CHILDREN ]: children,
            [ symbols.CYCLE ]: new Widget.LifeCycle(this),
            [ symbols.ID ]: null,
            [ symbols.OWNER ]: state.get(symbols.OWNER)[ state.get(symbols.OWNER).length - 1 ],
            [ symbols.PARENT ]: null,
            [ symbols.STATE ]: new Widget.State(this, Object.entries(this.constructor.initialState)),
            [ symbols.STYLE ]: new Widget.Style(this),
            [ symbols.TREE ]: children,
            [ symbols.X ]: 0,
            [ symbols.Y ]: 0
        });

        for (const child of children) {
            child[ symbols.PARENT ] = this;
        }

        global.requestAnimationFrame(() => {
            this[ symbols.RENDER ]();

            global.requestAnimationFrame(() => {
                this[ symbols.PAINT ]();

                global.requestAnimationFrame(() => {
                    this.emit('ready', null);
                });
            });
        });

        this.emit('construct', null);
    }

    update () {
        this[ symbols.UPDATE ]();
    }

    paint () {
        const canvas = this[ symbols.CACHE ];
        const webgl = state.get(symbols.WEBGL);

        webgl.attach(canvas);

        for (const child of this[ symbols.CHILDREN ]) {
            const cache = child[ symbols.CACHE ];
            const x = child[ symbols.X ];
            const y = child[ symbols.Y ];

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
        }
    }

    render () {
        return this.children;
    }
};

Widget.defaultProperties = { };
Widget.initialState = { };

Widget.LifeCycle = class WidgetLifeCycle {

    constructor (widget) {
        widget.subscribe('construct').forEach(event => this.handle(event));
        widget.subscribe('render').forEach(event => this.handle(event));
        widget.subscribe('ready').forEach(event => this.handle(event));
        widget.subscribe('update').forEach(event => this.handle(event));

        this.widget = widget;
    }

    handle (event) {
        const callback = `onWidget${ event.type.replace(/^(.)/, c => c.toUpperCase()) }`;

        if (callback in this.widget) {
            this.widget[ callback ](event);
        }
    }
};

Widget.State = class WidgetState extends Map {

    constructor (widget, data) {
        super(data);

        this.modifier = 'default';
        this.widget = widget;
    }

    set (key, value) {
        super.set(key, value);
        this.widget.update();
    }
};

Widget.Style = class WidgetStyle {

    constructor (widget) {
        this.assigned = { };
        this.widget = widget;
    }

    get (id) {
        const assigned = this.assigned;
        const modifier = this.modifier;
        const modified = this.widget.style[ modifier ][ id ]
        const original = this.widget.style.default[ id ];

        if (id === symbols.HOST) {
            const inherited = this.widget.owner.style[ modifier ][ this.id ];

            return Object.assign({ }, original, modified, inherited, assigned);
        }

        return Object.assign({ }, original, modified, assigned);
    }
};

module.exports = Widget;
