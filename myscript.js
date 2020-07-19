// DOM ELEMENTS
const docMain = document.querySelector('main');
const docCanvas = document.querySelector('#canvas');
const docColDiv = document.querySelectorAll('header div');
const docColInput = document.querySelectorAll('header input');

// VARIABLES
let canvasX = 16;
let canvasY = 16;

let isDrawing = false;
let col1 = docColInput[0].value;
let col2 = docColInput[1].value;

//If drawing outside and mouse-up, stop drawing
docMain.addEventListener('mouseup', function() { isDrawing = false; });

// CALCULATE CANVAS AND PIXEL SIZE
let pixelSize = 'height: 20px; width: 20px;'


// CREATE PAINTABLE CANVAS
for (i=0; i < canvasY; i++) {
    for (j=0; j < canvasX; j++) {
        let docDiv = document.createElement('div');
        docDiv.style.cssText = pixelSize;
        docDiv.classList.add('pixel');

        let currentPixelColor;

        docDiv.addEventListener('mouseover', function() {
            if (isDrawing == true) {
                this.style.cssText = `background-color: ${ col1 }; ${ pixelSize }`;
                currentPixelColor = col1;
            }
            else {
                this.style.cssText = `background-color: ${ col1 }; ${ pixelSize }`;
            }   
        });

        docDiv.addEventListener('mouseout', function() {
            this.style.cssText = `background-color: ${ currentPixelColor }; ${ pixelSize }`;
        });

        docDiv.addEventListener('mousedown', function(e) {
            e.preventDefault();
            this.style.cssText = `background-color: ${ col1 }; ${ pixelSize }`;
            currentPixelColor = col1;
            isDrawing = true;
        });

        docDiv.addEventListener('mouseup', function() {
            isDrawing = false;
        });

        docCanvas.appendChild(docDiv);
    }
}






// calculate size
// editable size
// event listeners for colDiv and colInputs

// COLORS
// background-color: black;
// background-color: blue;
// background-color: red;
// background-color: magenta;
// background-color: lime;
// background-color: cyan;
// background-color: yellow;
// background-color: white;
