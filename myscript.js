// DOM ELEMENTS
const docMain = document.querySelector('main');
const docCanvas = document.querySelector('#canvas');
const docColDiv = document.querySelectorAll('.palette div');
const docColInput = document.querySelectorAll('.palette input');
const docMenuTgl = document.querySelector('#menu-tgl');
const docMenu = document.querySelector('#menu');
const docSaveBtn = document.querySelector('#save-btn');
const docGridBtn = document.querySelector('#grid-btn');
const docClearBtn = document.querySelector('#clear-btn');
const docSizeBtn = document.querySelector('#size-btn');
const docSizeBtnText = document.querySelector('#size-txt');
const docSizeBox = document.querySelector('#set-size');
const docSizeX = document.querySelector('#size-x');
const docSizeY = document.querySelector('#size-y');
const docResizeY = document.querySelector('#resize-y');

// GLOBAL VARIABLES
let canvasX = 16;
let canvasY = 16;
let pixelSize;

let grid = false;

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
    //docMenu.classList.toggle('hidden');
    //if (docMenu.classList.contains('hidden')) {
    if (docMenu.style.maxHeight == '82px') {
        docMenuTgl.textContent = '▼Menu';
        docMenu.style.maxHeight = '0px';
    }
    else {
        docMenuTgl.textContent = '▲Menu';
        docMenu.style.maxHeight = '82px';
    }
    for (i = 1; i < 25; i++) {
        setTimeout(setCanvasSize, i);
    }  
});

// SAVE BUTTON (DOM-TO-IMAGE)
docSaveBtn.addEventListener('click', async function() {
    let _grid = grid;

    docCanvas.classList.toggle('frame');
    if (_grid) { toggleGrid(docCanvas); }
    await saveToImage();
    docCanvas.classList.toggle('frame');
    if (_grid) { toggleGrid(docCanvas); }

    //VERSION WITH CLONE, DOMTOIMAGE WON'T ACCEPT CLONED NODE
    /*let clone = docCanvas.cloneNode(true);
    
    clone.classList.toggle('frame');
    if (_grid) { toggleGrid(clone); }
    await saveToImage(clone);*/
});

async function saveToImage() {
    await domtoimage.toBlob(docCanvas)
    .then(async function (blob) {
        await saveAs(blob, 'my-sketch.png');
    });
}

// GRID BUTTON
docGridBtn.addEventListener('click', function(){ toggleGrid(docCanvas) });

function toggleGrid(canvas) {
    let pixels = canvas.querySelectorAll('.pixel');
    grid = !grid;

    for (i = 0; i < pixels.length; i++) {
        for (j = 0; j < canvasX; j++) {
            for (k = 0; k < canvasY; k++) {
                if (grid) {
                    if (k != canvasX - 1) {
                         pixels[i].classList.add('cell-border-right');
                    }

                    if (j != canvasY - 1) {
                        pixels[i].classList.add('cell-border-bottom');
                    }
                }
                else {
                    if (k != canvasX - 1) {
                        pixels[i].classList.remove('cell-border-right');
                    }

                    if (j != canvasY - 1) {
                        pixels[i].classList.remove('cell-border-bottom');
                    }
                }
            }
        }
    }

    setCanvasSize();
}

// CLEAR BUTTON
docClearBtn.addEventListener('click', function() {
    if(confirm('WARNING!\nClearing the canvas will erase your current work!')) {
     
        let pixels = document.querySelectorAll('.pixel');

        for (i=0; i < pixels.length; i++) {
            pixels[i].parentNode.removeChild(pixels[i]);
        }

        initCanvas();
        setCanvasSize();
    }

});

// RESIZE CANVAS BUTTON
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

docSizeX.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) { resizeCanvas(); }
});
docSizeY.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) { resizeCanvas(); }
});
docResizeY.addEventListener('click', function() { resizeCanvas() });

function resizeCanvas() {
    let pixels = document.querySelectorAll('.pixel');
    let sugCanvasX = parseInt(docSizeX.value);
    let sugCanvasY = parseInt(docSizeY.value);

    if ((sugCanvasX > 0 && sugCanvasX <= 64) && (sugCanvasY > 0 && sugCanvasY <= 64)) {
        if(confirm('WARNING!\nResizing the canvas will erase your current work!')) {
            canvasX = sugCanvasX;
            canvasY = sugCanvasY;
        
            for (i=0; i < pixels.length; i++) {
                pixels[i].parentNode.removeChild(pixels[i]);
            }
    
            initCanvas();
            setCanvasSize();
            docSizeBox.classList.toggle('blocker');
            docSizeBox.classList.toggle('hidden');
        }
    }
    else {
        alert('Please pick a size between 1-64 pixels!');
    }
}

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
    docCanvas.style.gridTemplateColumns = `repeat(${ canvasX }, 1fr)`;
    for (i=0; i < canvasY; i++) {
        for (j=0; j < canvasX; j++) {
            let docPixel = document.createElement('div');
            docPixel.classList.add('pixel');

            let currentPixelColor;

            docPixel.addEventListener('mouseover', function() {
                if (isDrawing == true) {
                    this.style.cssText = `background-color: ${ drawCol }; ${ pixelSize }`;
                    currentPixelColor = drawCol;
                }
                else {
                    this.style.cssText = `background-color: ${ drawCol }; ${ pixelSize }`;
                }   
            });

            docPixel.addEventListener('mouseout', function() {
                this.style.cssText = `background-color: ${ currentPixelColor }; ${ pixelSize }`;
            });

            docPixel.addEventListener('mousedown', function(e) {
                e.preventDefault();
                this.style.cssText = `background-color: ${ drawCol }; ${ pixelSize }`;
                currentPixelColor = drawCol;
                isDrawing = true;
            });

            docPixel.addEventListener('mouseup', function() {
                isDrawing = false;
            });

            if (grid) {
                if (j != canvasX - 1) {
                    docPixel.classList.add('cell-border-right');
                }
    
                if (i != canvasY - 1) {
                    docPixel.classList.add('cell-border-bottom');
                }
            }
            

            docCanvas.appendChild(docPixel);
        }
    }
    docSizeBtnText.innerHTML = `Size:<br>${ canvasX }x${ canvasY }`;
}

// CALCULATE CANVAS AND PIXEL SIZE
function setCanvasSize() {
    let pixels = document.querySelectorAll('.pixel');
    let maxSize = Math.min(docMain.clientHeight, docMain.clientWidth);
    let size;
    let bgCol;

    if ( canvasX > canvasY ) {
        size = maxSize / (canvasX + 2);
    }
    else {
        size = maxSize / (canvasY + 2);
    }

    size = Math.floor(size);

    pixelSize = `height: ${ size }px; width: ${ size }px;`;
    
    

    for (i=0; i < pixels.length; i++) {
        bgCol = window.getComputedStyle(pixels[i]).getPropertyValue('background-color');
        pixels[i].style.cssText = `background-color: ${ bgCol }; ${ pixelSize }`;
    }

}

// touch functionality
