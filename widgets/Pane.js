const Widget = require('../core/Widget');
const render = require('../system/render');

const Rectangle = require('../geometry/Rectangle');

class Pane extends Widget {

    render () {
        return [
            render(Rectangle, {  }, this.children)
        ];
    }
}

module.exports = Pane;
