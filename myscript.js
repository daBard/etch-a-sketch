// DOM ELEMENTS
const docCanvas = document.querySelector('#canvas');

// VARIABLES
canvasX = 16;
canvasY = 16;

// CALCULATE CANVAS MAX-SIZE

// CREATE CANVAS
for (i=0; i < canvasY; i++) {
    for (j=0; j < canvasX; j++) {
        let docDiv = document.createElement('div');
        docDiv.style.cssText = 'height: 20px; width: 20px';
        docDiv.classList.add('pixel');
        docCanvas.appendChild(docDiv);
    }
}


// Other pointer
// add listener for choosen color hover
// ass listener for choosen color paint
