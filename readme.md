# wtk
WebGL Toolkit

Please talk me out of doing this...

Widgets for WebGL; think GTK, but for the web. Why? Because it doesn't exist, and I need it.

```javascript
const wtk = require('wtk');

const Button = require('wtk/widgets/Button');
const Frame = require('wtk/widgets/Frame');
const Pane = require('wtk/widgets/Pane');

const canvas = global.document.createElement('canvas');

wtk.mount(canvas,
    wtk.render(Frame, { title: 'Foo Bar' }, [
        wtk.render(Pane, { }, [
            wtk.render(Button, { text: 'Ok', onClick () { alert('clicked') } })
        ]);
    ])
);
```
