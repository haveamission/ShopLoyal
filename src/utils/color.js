export const RGBAToHSLA = (r, g, b, a) => {
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);

    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta === 0) h = 0;
    // Red is max
    else if (cmax === r) h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax === g) h = (b - r) / delta + 2;
    // Blue is max
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0) h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    // Specific override to generate exactly the color that SL wants. I left the rest of this code generation in in case the algorithm
    // needs to be tweaked, but currently all they need is hue.

    let hsla = "hsla(" + h + "," + "50" + "%," + "50" + "%," + .8 + ")";
    return hsla;
}

export const lightestColor = (colors) => {
    let highestColor;
    let hspHighest = 0;
    colors.forEach(function (color) {
        let lightness = lightOrDark(color[0], color[1], color[2]);
        if (lightness > hspHighest && lightness < 200) {
            hspHighest = lightness;
            highestColor = color;
        }
    });
    let hsla = RGBAToHSLA(highestColor[0], highestColor[1], highestColor[2], highestColor[3]);
    return hsla;
}

export const lightOrDark = (r, g, b) => {
    let hsp;

    // HSP (Highly Sensitive P) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    return hsp;
}