import {ref} from "vue";
import ColorThief from "colorthief";


const backgroundColor = ref("#ffffff");

function isDarkColor(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
}

function getDominantColor(imageSrc, callback, alpha = 0.2) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img);
        if (dominantColor) {
            let [r, g, b] = dominantColor;
            const whiteR = 255, whiteG = 255, whiteB = 255;
            r = Math.floor(r + alpha * (whiteR - r));
            g = Math.floor(g + alpha * (whiteG - g));
            b = Math.floor(b + alpha * (whiteB - b));
            callback(`rgb(${r}, ${g}, ${b})`);
        } else {
            console.error("Failed to extract dominant color.");
            callback("rgb(200, 200, 200)");
        }
    };
}

function updateBackground (path) {
    getDominantColor(path, (color) => {
        backgroundColor.value = color;
    });
}


export {getDominantColor, updateBackground, backgroundColor}




