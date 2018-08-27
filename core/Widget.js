const Event = require('./Event');

const diff = require('../system/diff');
const symbols = require('../system/symbols');

class Widget extends Event.Emitter {

    [ symbols.RENDER ] () {
        const before = this[ symbols.TREE ];
        const after = this.render();

        if (before.length > after.length) {
            this[ symbols.TREE ] = before.map((widget, i) => diff(widget, after[ i ]));
        }
        else {
            this[ symbols.TREE ] = after.map((widget, i) => diff(before[ i ], widget));
        }

        for (const widget of this[ symbols.TREE ]) {
            widget[ symbols.PARENT ] = this;
        }

        this.emit('render', null);
    }

    [ symbols.PAINT ] () {
        // TODO
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

    get parent () {
        return this[ symbols.PARENT ];
    }

    get state () {
        return this[ symbols.STATE ];
    }

    get style () {
        return { };
    }

    constructor (properties = { }, children = [ ]) {
        super();

        Object.assign(this, this.constructor.defaultProperties, properties, {
            [ symbols.CACHE ]: global.document.createElement('canvas'),
            [ symbols.CHILDREN ]: children,
            [ symbols.CYCLE ]: new Widget.LifeCycle(this),
            [ symbols.GEOMETRY ]: [ ],
            [ symbols.INTERFACE ]: null,
            [ symbols.PARENT ]: null,
            [ symbols.STATE ]: new Widget.State(this, Object.entries(this.constructor.initialState)),
            [ symbols.STYLE ]: new Widget.Style(this),
            [ symbols.TREE ]: [ ],
            [ symbols.WEBGL ]: null
        });

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
        void 0;
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
        this.widget = widget;
    }

    set (key, value) {
        super.set(key, value);
        this.widget.update();
    }
};

Widget.Style = class WidgetStyle {

    get fill () {

    }

    get height () {

    }

    get sample () {

    }

    get stroke () {

    }

    get width () {

    }

    constructor (widget) {
        this.widget = widget;
    }
};

module.exports = Widget;
