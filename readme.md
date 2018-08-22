# wtk
WebGL Toolkit

Widgets for WebGL; think GTK, but for the web. Why? Because it doesn't exist, and I need it.

```javascript
const Widget = require('wtk/core/Widget');

const mount = require('wtk/system/mount');
const render = require('wtk/system/render');

const rgba = require('wtk/color/rgba');

const Button = require('wtk/widgets/Button');
const Frame = require('wtk/widgets/Frame');
const Pane = require('wtk/widgets/Pane');

const canvas = global.document.createElement('canvas');

class UserInterface extends Widget {

    get style () {
        return {
            default: {
                myPane: {
                    fill: rgba(255, 0, 0, 255)
                }
            },
            hover: {
                myPane: {
                    fill: rgba(0, 255, 0, 255)
                }
            }
        };
    }

    render () {
        return [
            render(Frame, { title: 'Foo' }, [
                render(Pane, { id: 'myPane' }, [
                    render(Button, { text: 'Ok', onClick () { alert('clicked') } })
                ])
            ])
        ];
    }
}

mount(canvas, render(UserInterface));
```
