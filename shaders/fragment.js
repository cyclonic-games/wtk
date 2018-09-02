const Shader = require('picasso/core/Shader');

module.exports = new Shader('fragment', `
    precision mediump float;

    uniform sampler2D wtk_Texture;
    in vec2 vertex_Sample;

    out vec4 fragment_Color;

    void main () {
        fragment_Color = texture(wtk_Texture, vertex_Sample);
    }
`);
