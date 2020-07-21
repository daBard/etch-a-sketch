// DOM ELEMENTS
const docMain = document.querySelector('main');
const docCanvas = document.querySelector('#canvas');
const docColDiv = document.querySelectorAll('header div');
const docColInput = document.querySelectorAll('header input');

// VARIABLES
let canvasX = 16;
let canvasY = 16;
let pixelSize;

let isDrawing = false;
let col1 = docColInput[0].value;
let col2 = docColInput[1].value;
let drawCol = col1;

//If drawing outside and mouse-up, stop drawing
docMain.addEventListener('mouseup', function() { isDrawing = false; });

// RESET CANVAS SIZE IF WINDOW RESIZE
window.addEventListener('resize', () => setCanvasSize());

// INITIALIZE PALETTE
for (i=0; i < docColDiv.length; i++) {
    // DIVS
    docColDiv[i].style.cssText = `background-color: ${ docColInput[i].value };`;
    docColDiv[i].addEventListener('click', function(e){
        for (j=0; j < docColDiv.length; j++) {
            docColInput[j].classList.add('hidden');
            docColDiv[j].classList.remove('hidden');
        }

        let target = e.target.id.slice(-1);
        
        docColDiv[target].classList.toggle('hidden');
        docColInput[target].classList.toggle('hidden');
        drawCol = docColInput[target].value;
    });

    // INPUTS    
    // event listener onchange of color, change drawcol
}

// INITIALIZE PAINTABLE CANVAS
for (i=0; i < canvasY; i++) {
    for (j=0; j < canvasX; j++) {
        let docDiv = document.createElement('div');
        docDiv.classList.add('pixel');

        let currentPixelColor;

        docDiv.addEventListener('mouseover', function() {
            if (isDrawing == true) {
                this.style.cssText = `background-color: ${ drawCol }; ${ pixelSize }`;
                currentPixelColor = drawCol;
            }
            else {
                this.style.cssText = `background-color: ${ drawCol }; ${ pixelSize }`;
            }   
        });

        docDiv.addEventListener('mouseout', function() {
            this.style.cssText = `background-color: ${ currentPixelColor }; ${ pixelSize }`;
        });

        docDiv.addEventListener('mousedown', function(e) {
            e.preventDefault();
            this.style.cssText = `background-color: ${ drawCol }; ${ pixelSize }`;
            currentPixelColor = drawCol;
            isDrawing = true;
        });

        docDiv.addEventListener('mouseup', function() {
            isDrawing = false;
        });

        docCanvas.appendChild(docDiv);
    }
}

setCanvasSize();

// CALCULATE CANVAS AND PIXEL SIZE
function setCanvasSize() {
    let maxSize = Math.min(docMain.clientHeight, docMain.clientWidth);
    let size;
    let bgCol;

    if ( canvasX > canvasY ) {
        size = maxSize / (canvasY + 2);
    }
    else {
        size = maxSize / (canvasX + 2);
    }

    size = Math.floor(size);

    pixelSize = `height: ${ size }px; width: ${ size }px;`;
    
    pixels = document.querySelectorAll('.pixel');
    
    for (i=0; i < pixels.length; i++) {
        bgCol = window.getComputedStyle(pixels[i]).getPropertyValue('background-color');
        pixels[i].style.cssText = `background-color: ${ bgCol }; ${ pixelSize }`;
    }

}

// editable size https://www.w3schools.com/cssref/tryit.asp?filename=trycss_js_grid-template-columns
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
