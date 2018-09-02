function rgba (r, g, b, a) {
    return Object.assign(new Uint8Array([ r, g, b, a]), {
        width: 1,
        height: 1
    });
}

module.exports = rgba;
