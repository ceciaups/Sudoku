window.onload = function() {

  const sudokuBoxSize = 9;
  const sudokuSize = sudokuBoxSize * sudokuBoxSize;

  var sudokuContainer = document.getElementById("sudoku-container");
  
  for (let i=0; i < sudokuBoxSize; i++) {
    let sudokuBox = document.createElement("div");

    sudokuBox.classList.add("sudoku-box");
    sudokuBox.classList.add("sudoku-box" + i);

    for (let j=0; j < sudokuBoxSize; j++) {
      let sudokuInput = document.createElement("input");
  
      sudokuInput.classList.add("sudoku-input");
  
      sudokuBox.appendChild(sudokuInput);
    }

    // console.log(i);
    // console.log(sudokuBox);
    sudokuContainer.appendChild(sudokuBox);
  }

  
}