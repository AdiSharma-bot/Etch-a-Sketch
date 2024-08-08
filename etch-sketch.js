//contain references to html elements
const container = document.querySelector(".container");
const resizeButton = document.querySelector(".resize");
const canvas = document.querySelector(".canvas");
const colorPickerLabel = document.querySelector(".color-picker-label");
const colorPickerInput = document.querySelector("#color-picker");
const clearBtn = document.querySelector(".reset");
const eraserBtn = document.querySelector(".eraser");
const penBtn = document.querySelector(".pen");
const randomColorBtn = document.querySelector(".random-color");
const resizeRange = document.querySelector("#resizeRange");
const rangeValue = document.querySelector("#range-value");
const noBorderBtn = document.querySelector(".toggle-borders");
const hoverBtn = document.querySelector(".hover-mouse");
const darkenBtn = document.querySelector(".darken");

//Buttons for toggling different tools or features
let isDarkenMode = false;
let isBorderMode = true; //Set true for default borders to be on
let isPenMode = false;
let isRandomMode = false;
let isMouseDown = false;
let isEraserMode = false;
let isHoverMode = false;

function createGrid(rows, columns) {
  canvas.innerHTML = ""; // to clear the previous grid when a new one is created
  const fragment = document.createDocumentFragment(); //invisible container to hold the grid rows
  for (let i = 0; i < rows; i++) {
    const divRow = document.createElement("div");
    divRow.classList.add("rows"); //First rows are created
    for (let j = 0; j < columns; j++) {
      const divColumn = document.createElement("div"); //create a div for each column
      divColumn.classList.add("columns");
      divColumn.id = `row ${i + 1} column ${j + 1}`;
      divRow.appendChild(divColumn); //then columns are created and appended to the rows this is how grid is created
    }
    fragment.appendChild(divRow);
  }
  canvas.appendChild(fragment);
  addColorChangeListeners();
}
let resizeTimeout; //Declare a variable to hold the timeout id
resizeRange.addEventListener("input", (event) => {
  //to create the input range (that slider thingy)
  const size = Number(event.target.value); //input value stored in a variable
  rangeValue.textContent = `${size} x ${size}`;
  clearTimeout(resizeTimeout); //to clear previous timeout set by the user and to prevent multiple grid creation in quick succession i.e if user creates the grid quickly
  resizeTimeout = setTimeout(() => {
    createGrid(size, size); // this will help create grid after 100ms
  }, 100);
});
resizeButton.addEventListener("click", () => { //custom resize button
  const columns = Number(
    prompt("Type in the number of squares between 2 and 100!")
  );
  const rows = columns;
  if (columns < 2 || columns >= 100) {
    alert("Please type in a valid number");
    throw new Error("Please type in the valid number!");
  } else {
    createGrid(rows, columns);
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const defaultColumns = 16;
  createGrid(defaultColumns, defaultColumns);
});

// function to add color inside the columns

function addColorChangeListeners() {
  const allColumns = document.querySelectorAll(".columns");
  const changeColor = (column) => {
    column.style.backgroundColor = colorPickerInput.value; //to change the background color of the columns based on the color picker value
  };
  const eraseColor = (column) => {
    column.style.backgroundColor = "";
    column.dataset.opacity = 0; //to also clear the opacity i.e the darkened columns
    column.style.setProperty("--overlay-opacity", 0);
  };
  const randomColor = (column) => {
    //function exp. for that rainbow button i.e. which gives random background colors to the columns
    let initialHash = "#";
    const hexValues = "0123456789abcdef";
    for (let i = 0; i < 6; i++) {
      //loop will add 6 random values to the initial hash value
      const randomIndex = Math.floor(Math.random() * hexValues.length);
      const randomValue = hexValues[randomIndex];
      initialHash += randomValue;
    }
    column.style.backgroundColor = initialHash;
  };
  const darkenColumn = (column) => {
    if (!column.dataset.opacity) {
      //if the opacity is not set then set it to 0
      column.dataset.opacity = 0;
    }
    let currentOpacity = parseFloat(column.dataset.opacity); //to pass the value
    if (currentOpacity < 0.7) {
      currentOpacity = Math.min(currentOpacity + 0.1, 0.7); //to increase the opacity level by 10% till it is below 100%
      column.dataset.opacity = currentOpacity; //here dataset is used to track the opacity levels of the columns and can be seen on the html element itself
      column.style.setProperty("--overlay-opacity", currentOpacity); //to set that custom css variable and give it the value which is set in currentOpacity variable
    }
  };
  allColumns.forEach((column) => {
    column.addEventListener("mousedown", (e) => {
      /*here an event listener is added in which when the mouse is down only then these functions will run with other conditions as well*/
      isMouseDown = true; //when mouse is down isMouseDown variable is set to true
      if (isEraserMode) {
        eraseColor(column);
      } else if (isRandomMode) {
        //when randomMode is on only when the columns get random colors
        randomColor(column);
      } else if (isPenMode) {
        //here when the pen mode is on only then we can change background color of the columns
        changeColor(column);
      } else if (isDarkenMode) {
        darkenColumn(column);
      } else {
        return; //don't do anything
      }
      e.preventDefault(); //to prevent the default selection of columns which turned on hover effect
    });
    /* when hover mode is on mouse move event can be fired independently of the mouse down event */
    column.addEventListener("mousemove", () => {
      if (isMouseDown || isHoverMode) {
        // here this event will run when mouse is down or hover mode is on
        if (isEraserMode) {
          //eraser mode
          eraseColor(column);
        } else if (isRandomMode) {
          //random mode
          randomColor(column);
        } else if (isPenMode) {
          // color mode
          changeColor(column);
        } else if (isDarkenMode) {
          darkenColumn(column);
        } else {
          return;
        }
      }
    });
    column.addEventListener("mouseup", () => {
      isMouseDown = false;
    });
  });

  document.addEventListener("mouseup", () => {
    isMouseDown = false; //to prevent all the functions to be fired outside the container
  });
}
clearBtn.addEventListener("click", () => {
  //to clear columns background color as well as the opacity
  const allColumns = document.querySelectorAll(".columns");
  allColumns.forEach((column) => {
    column.style.backgroundColor = "";
    column.dataset.opacity = 0;
    column.style.setProperty("--overlay-opacity", 0);
  });
});

function addHoverEffect(button) {
  //to add the hover affects to the buttons and add appropriate styles with appropriate classes
  //and to avoid inline styles, they are assigned to their classes (see CSS)
  button.addEventListener("mouseenter", () => {
    if (!button.classList.contains("active")) {
      button.classList.add("hover");
    }
  });
  button.addEventListener("mouseleave", () => {
    if (!button.classList.contains("active")) {
      button.classList.remove("hover");
    }
  });
  button.addEventListener("mousedown", () => {
    button.classList.add("active");
  });
  button.addEventListener("mouseup", () => {
    button.classList.remove("active");
  });
}
function setButtonStyles(button, active = false) {
  if (active) {
    button.classList.add("active"); //only add active class if active is set to true
  } else {
    button.classList.remove("active");
  }
}
function updateButtonStates(excludeButton = "") {
  //this parameter here specifies which button's state should be preserved i.e. not set to false
  //here the value inside the exclude button retains its state i.e if it is true then it remains true otherwise it is set to false
  isPenMode = excludeButton === "pen" ? isPenMode : false; /*like here if the excludeButton has pen string in it then it retains its state and all other buttons state is set to false  or if it does not have pen value in it then it is set to false*/
  isRandomMode = excludeButton === "random" ? isRandomMode : false;
  isDarkenMode = excludeButton === "darken" ? isDarkenMode : false;
  isEraserMode = excludeButton === "eraser" ? isEraserMode : false;

  //update their styles based on their current states
  setButtonStyles(penBtn, isPenMode);
  setButtonStyles(randomColorBtn, isRandomMode);
  setButtonStyles(darkenBtn, isDarkenMode);
  setButtonStyles(eraserBtn, isEraserMode);

  //also their text content
  eraserBtn.textContent = isEraserMode ? "Eraser: ON" : "Eraser: OFF";
  penBtn.textContent = isPenMode ? "Pen: ON" : "Pen: OFF";
  randomColorBtn.textContent = isRandomMode ? "Rainbow: ON" : "Rainbow: OFF";
  darkenBtn.textContent = isDarkenMode ? "Darken: ON" : "Darken: OFF";
}
eraserBtn.addEventListener("click", (event) => {
  isEraserMode = !isEraserMode;
  //setButtonStyles(eraserBtn, isEraserMode);

  updateButtonStates("eraser"); //here eraser button state should be preserved and others state to false
});

penBtn.addEventListener("click", () => {
  //toggle pen mode only if eraser mode is false
  if (!isEraserMode) {
    isPenMode = !isPenMode; //set the value of isPenMode to true if it is false and vice versa
    updateButtonStates("pen");
  }
});
randomColorBtn.addEventListener("click", () => {
  //toggle random mode only if eraser mode is off
  if (!isEraserMode) {
    isRandomMode = !isRandomMode;
    updateButtonStates("random");
  }
});
noBorderBtn.addEventListener("click", () => {
  //to toggle borders on or off
  const allColumns = document.querySelectorAll(".columns");
  isBorderMode = !isBorderMode;
  allColumns.forEach((column) => {
    if (isBorderMode) {
      column.style.border = "none";
    } else {
      column.style.border = "1px solid grey";
    }
  });
});
hoverBtn.addEventListener("click", () => {
  //toggle hover mode
  isHoverMode = !isHoverMode;
  hoverBtn.textContent = isHoverMode ? "Hover: ON" : "Hover: OFF";
  setButtonStyles(hoverBtn, isHoverMode);
});
darkenBtn.addEventListener("click", () => {
  if (!isPenMode && !isRandomMode && !isEraserMode) {
    //to only turn the darken mode when these buttons are turned off
    isDarkenMode = !isDarkenMode;
    updateButtonStates("darken");
  }
});

//add hover and active styles to below buttons
addHoverEffect(hoverBtn);
addHoverEffect(penBtn);
addHoverEffect(eraserBtn);
addHoverEffect(randomColorBtn);
addHoverEffect(darkenBtn);
