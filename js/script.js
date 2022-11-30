window.onload = function() {

  // readTextFile("./csv/sudoku.txt");
  const sudokuBoxSize = 9;
  const sudokuSize = sudokuBoxSize * sudokuBoxSize;
  const quiz = "004300209005009001070060043006002087190007400050083000600000105003508690042910300";
  const solution = "864371259325849761971265843436192587198657432257483916689734125713528694542916378";
  var time = 0;
  var timer;

  var startPage = document.getElementById("start-page");
  var sudoku = document.getElementById("sudoku");
  var checkMsg = document.getElementById("check-message");
  var timerMin = document.getElementById("timer-min");
  var timerSec = document.getElementById("timer-sec");
  var btnStart = document.getElementById("button-start");
  var btnCheck = document.getElementById("button-check");
  
  function genSudoku() {
    for (let i=0; i < sudokuBoxSize; i++) {
      let sudokuBox = document.createElement("div");

      sudokuBox.classList.add("sudoku-box");
      sudokuBox.classList.add("sudoku-box" + i);

      for (let j=0; j < sudokuBoxSize; j++) {
        let number = findNumber(i, j, quiz);

        let sudokuInput = document.createElement("input");
        
        if (number == 0) {
          sudokuInput.classList.add("sudoku-input");
        }
        else {
          sudokuInput.classList.add("sudoku-input");
          sudokuInput.readOnly = true;
          sudokuInput.placeholder = number;
        }
    
        sudokuBox.appendChild(sudokuInput);
      }
      sudoku.appendChild(sudokuBox);
    }

    // Debug mode
    // for (let i=0; i < sudokuBoxSize; i++) {
    //   for (let j=0; j < sudokuBoxSize; j++) {
    //     let sudokuInput = sudoku.childNodes[i].childNodes[j];
    //     if (sudokuInput.placeholder == 0 && sudokuInput.value == 0) {
    //       let number = findNumber(i, j, solution);
    //       sudokuInput.value = number;
    //     }
    //   }
    // }
    
    startPage.style.zIndex = -1;
    timer = setInterval(displayTime, 1000);
  }

  function checkSudoku() {
    let wrongInput = 0;
    let correctInput = 0;
    for (let i=0; i < sudokuBoxSize; i++) {
      for (let j=0; j < sudokuBoxSize; j++) {
        let sudokuInput = sudoku.childNodes[i].childNodes[j];
        if (sudokuInput.value != 0) {
          let number = findNumber(i, j, solution);
          if (sudokuInput.value != number)
            wrongInput++;
          else
            correctInput++;
        }
        else if (sudokuInput.placeholder != 0)
          correctInput++;
      }
    }
    if (correctInput == sudokuSize) {
      var sudokuInput = document.querySelectorAll(".sudoku-input");
      sudokuInput.forEach(element => {
        element.readOnly = true;
      });
      clearInterval(timer);
      checkMsg.style.color = "var(--blue-300)";
      checkMsg.innerHTML = "You have completed the Sudoku in " + Math.floor(time/60) % 60 + " min and " + time % 60 + " sec!";
    }
    else if (wrongInput == 0) {
      checkMsg.style.color = "var(--blue-300)";
      checkMsg.innerHTML = "So far so good, keep going!";
    }
    else {
      checkMsg.style.color = "var(--red)";
      checkMsg.innerHTML = "You have " + wrongInput + " wrong input!";
    }
  }

  function displayTime() {
    time++;
		
		if (time/60 % 60 < 10)
			timerMin.innerHTML = "0" + Math.floor(time/60 % 60) + ":";
		else
			timerMin.innerHTML = Math.floor(time/60  % 60) + ":";
		if (time % 60 < 10)
			timerSec.innerHTML = "0" + time % 60;
		else
			timerSec.innerHTML = time % 60;
  }

  function findNumber(i, j, array) {
    return array[Math.floor(j / 3) * 9 + Math.floor(i / 3) * 27 + j % 3 + i % 3 * 3];
  }

  btnStart.onclick = genSudoku;
  btnCheck.onclick = checkSudoku;
}

// function readTextFile(file)
// {
//     console.log("reading");
//     var rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function ()
//     {
//         if(rawFile.readyState === 4)
//         {
//             if(rawFile.status === 200 || rawFile.status == 0)
//             {
//                 var allText = rawFile.responseText;
//                 alert(allText);
//             }
//         }
//     }
//     rawFile.send(null);
// }