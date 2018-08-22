# wtk
WebGL Toolkit

Widgets for WebGL; think GTK, but for the web. Why? Because it doesn't exist, and I need it.

```javascript
const Widget = require('wtk/core/Widget');

const mount = require('wtk/system/mount');
const render = require('wtk/system/render');

const Button = require('wtk/widgets/Button');
const Frame = require('wtk/widgets/Frame');
const Pane = require('wtk/widgets/Pane');

const canvas = global.document.createElement('canvas');

class UserInterface extends Widget {

    render () {
        return [
            render(Frame, { title: 'Foo Bar' }, [
                render(Pane, { }, [
                    render(Button, { text: 'Ok', onClick () { alert('clicked') } })
                ])
            ])
        ];
    }
}

mount(canvas, render(UserInterface));
```
