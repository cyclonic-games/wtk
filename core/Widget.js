const Event = require('./Event');

const diff = require('../system/diff');
const paint = require('../system/paint');
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
        for (const widget of this[ symbols.TREE ]) {
            paint(widget);
        }

        this.emit('paint', null);
    }

    [ symbols.UPDATE ] () {
        this.emit('update', null);

        global.requestAnimationFrame(() => {
            this[ symbols.RENDER ]();

            global.requestAnimationFrame(() => {
                this[ symbols.PAINT ]();
            });
        });
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

    constructor (properties, children) {
        super();

        Object.assign(this, this.constructor.defaultProperties, properties, {
            [ symbols.CACHE ]: null,
            [ symbols.CHILDREN ]: children,
            [ symbols.CYCLE ]: new Widget.LifeCycle(this),
            [ symbols.INTERFACE ]: null,
            [ symbols.PARENT ]: null,
            [ symbols.STATE ]: new Widget.State(this, Object.entries(this.constructor.initialState)),
            [ symbols.STYLE ]: new Widget.Style(this),
            [ symbols.TREE ]: [ ]
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
    }

    update () {
        this[ symbols.UPDATE ]();
    }

    render () {
        return [ ];
    }
};

Widget.defaultProperties = { };
Widget.initialState = { };

Widget.LifeCycle = class WidgetLifeCycle {

    constructor (widget) {
        widget.subscribe('render').forEach(event => this.handle(event));
        widget.subscribe('update').forEach(event => this.handle(event));
        widget.subscribe('ready').forEach(event => this.handle(event));
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

Widget.Style = class WidgetStyle extends Style {

};

module.exports = Widget;
