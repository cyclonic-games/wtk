function sample (x, y, width, height) {
    return new Float32Array([
        x, y,
        x + width, y,
        x, y + height,
        x, y + height,
        x + width, y,
        x + width, y + height
    ]);
}

module.exports = sample;
