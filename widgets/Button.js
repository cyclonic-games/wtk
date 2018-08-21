const Widget = require('../core/Widget');
const render = require('../system/render');

const Rectangle = require('../geometry/Rectangle');
const Text = require('../geometry/Text');

class Button extends Widget {

    get style () {
        return {
            default: {
                rectangle: {

                },
                text: {

                }
            },
            hover: {
                rectangle: {

                }
            }
        }
    }

    render () {
        return [
            render(Rectangle, { id: 'rectangle' }),
            render(Text, { id: 'text', value: this.text })
        ]
    }
}

Button.defaultProperties = {
    text: 'button'
};

module.exports = Button;
