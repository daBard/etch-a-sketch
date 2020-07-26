// DOM ELEMENTS
const docMain = document.querySelector('main');
const docCanvas = document.querySelector('#canvas');
const docColDiv = document.querySelectorAll('.palette div');
const docColInput = document.querySelectorAll('.palette input');
const docMenuTgl = document.querySelector('#menu-tgl');
const docMenu = document.querySelector('#menu');
const docSaveBtn = document.querySelector('#save-btn');
const docClearBtn = document.querySelector('#clear-btn');
const docSizeBtn = document.querySelector('#size-btn');
const docSizeBox = document.querySelector('#set-size');
const docSizeX = document.querySelector('#size-x');
const docSizeY = document.querySelector('#size-y');
const docResizeY = document.querySelector('#resize-y');

// VARIABLES
let canvasX = 16;
let canvasY = 16;
let pixelSize;

let isDrawing = false;
let drawCol = docColInput[0].value;

// INITIALIZE FIRST CANVAS
initCanvas();
setCanvasSize();

//If drawing outside and mouse-up, stop drawing
docMain.addEventListener('mouseup', function() { isDrawing = false; });

// RESET CANVAS SIZE IF WINDOW RESIZE
window.addEventListener('resize', () => setCanvasSize());

// SHOW/HIDE MENU
docMenuTgl.addEventListener('click', function() {
    docMenu.classList.toggle('hidden');
    if (docMenu.classList.contains('hidden')) {
        docMenuTgl.textContent = '▼Menu';
    }
    else {
        docMenuTgl.textContent = '▲Menu';
    }
});

// RESIZE CANVAS
docSizeBtn.addEventListener('click', function() {
    docSizeBox.classList.toggle('blocker');
    docSizeBox.classList.toggle('hidden');
});

docSizeBox.addEventListener('click', function(e){
    if (docSizeBox == e.target) {
        docSizeBox.classList.toggle('blocker');
        docSizeBox.classList.toggle('hidden');
    }
});

docResizeY.addEventListener('click', function() {
    canvasX = docSizeX.value;
    canvasY = docSizeY.value;
    console.log(canvasX + ', ' + canvasY);
    //wipe all pixels
    //set css grid (maybe inside initCanvas?)
    initCanvas();
    setCanvasSize();
    docSizeBox.classList.toggle('blocker');
    docSizeBox.classList.toggle('hidden');
});

// INITIALIZE PALETTE
for (i=0; i < docColDiv.length; i++) {
    // DIVS
    docColDiv[i].style.cssText = `background-color: ${ docColInput[i].value };`;
    docColDiv[i].addEventListener('click', function(e) {
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
    docColInput[i].addEventListener('input', function(e) {
        let target = e.target.id.slice(-1);
        
        docColDiv[target].style.cssText = `background-color: ${ docColInput[target].value };`;
        drawCol = docColInput[target].value;
    });
}

// INITIALIZE PAINTABLE CANVAS
function initCanvas() {
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
}

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
// grid overlay https://onagova.github.io/etch-a-sketch/
// clear button
// save button (save div as image)???
// accordion menu
