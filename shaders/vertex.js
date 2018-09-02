const Shader = require('picasso/core/Shader');

module.exports = new Shader('vertex', `
    uniform vec2 wtk_Resolution;
    in vec2 wtk_Coordinates;
    in vec2 wtk_Sample;

    out vec2 vertex_Sample;

    void main () {
        vec2 one = wtk_Coordinates / wtk_Resolution;
        vec2 two = one * 2.0;
        vec2 clip = two - 1.0;
        vec2 flip = vec2(1.0, -1.0);

        gl_Position = vec4(clip * flip, 0.0, 1.0);
        vertex_Sample = wtk_Sample;
    }
`);
