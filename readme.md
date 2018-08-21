# wtk
WebGL Toolkit

Please talk me out of doing this...

Widgets for WebGL; think GTK, but for the web. Why? Because it doesn't exist, and I need it.

```javascript
const mount = require('wtk/system/mount');
const render = require('wtk/system/render');

const Button = require('wtk/widgets/Button');
const Frame = require('wtk/widgets/Frame');
const Pane = require('wtk/widgets/Pane');

function main () {
    const canvas = global.document.createElement('canvas');

    mount(canvas, { width: 800, height: 600 }, [
        render(Frame, { title: 'Foo Bar' }, [
            render(Pane, { }, [
                render(Button, { text: 'Ok' })
            ]);
        ])
    ]);
}

main();
```
