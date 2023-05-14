
window.onload = function() {

  const sudokuBoxSize = 9;
  const sudokuSize = sudokuBoxSize * sudokuBoxSize;
  const dbSize = 1000000;
  var quiz = "";
  var solution = "";
  var sudokuID;
  var time = 0;
  var timer;

  var startPage = document.getElementById("start-page");
  var newGame = document.getElementById("new-game");
  var sudoku = document.getElementById("sudoku");
  var checkMsg = document.getElementById("check-message");
  var timerMin = document.getElementById("timer-min");
  var timerSec = document.getElementById("timer-sec");
  var btnStart = document.getElementById("button-start");
  var btnNew = document.getElementById("button-new");;
  var btnPause = document.getElementById("button-pause");
  var btnCheck = document.getElementById("button-check");
  var btnNewYes = document.getElementById("button-new-confirm");
  var btnNewNo = document.getElementById("button-new-cancel");
  
  async function getSudoku(callback) {

    sudokuID = Math.floor(Math.random() * dbSize);
    var url = "/api/sudokuDB/" + sudokuID;
    
    var response = await fetch(url);

    if (response.status === 200) {
      var data = await response.json();
      quiz = data[0];
      solution = data[1];
      callback();
    }
    else {
      location.innerHTML = "API call was unsuccessful";
      console.log(xhr.status);
    }

    // let xhr = new XMLHttpRequest();

    // xhr.callback = callback;

    // xhr.onreadystatechange = function() {
    //   if (xhr.readyState === 4) {
    //     if (xhr.status === 200) {
    //       const data = xhr.response;
    //       quiz = data[0];
    //       solution = data[1];
    //     }
    //     else {
    //       location.innerHTML = "API call was unsuccessful";
    //       console.log(xhr.status);
    //     }
    //   }
    // }

    // xhr.onload = xhr.callback;
    // xhr.open("GET", url, true);
    // xhr.responseType = "json";
    // xhr.send();
  }

  function genSudoku() {
    checkMsg.innerHTML = "Puzzle #" + (sudokuID + 1);
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
    
    timer = setInterval(displayTime, 1000);
  }

  function startGame() {
    getSudoku(genSudoku);
    startPage.style.visibility = "hidden";
    enableButton();
  }

  function confirmNewGame() {
    disableButton();
    newGame.style.visibility = "visible";
    for (const child of sudoku.children) {
      child.style.visibility = "hidden";
    }
    clearInterval(timer);
    btnNewYes.addEventListener("click", startNewGame, { once: true });
    btnNewNo.addEventListener("click", resumeGame, { once: true });
  }

  function pauseGame() {
    disableButton();
    startPage.style.visibility = "visible";
    for (const child of sudoku.children) {
      child.style.visibility = "hidden";
    }
    clearInterval(timer);
    btnStart.innerHTML = "Resume";
    btnStart.addEventListener("click", resumeGame, { once: true });
  }

  function startNewGame() {
    enableButton();
    newGame.style.visibility = "hidden";
    for (const child of sudoku.children) {
      child.style.visibility = "visible";
    }
    sudoku.innerHTML = "";
    timerMin.innerHTML = "00";
    timerSec.innerHTML = "00";
    time = 0;
    checkMsg.style.color = "var(--blue-300)";
    getSudoku(genSudoku);
    btnNewNo.removeEventListener("clicked", resumeGame);
  }

  function resumeGame() {
    startPage.style.visibility = "hidden";
    newGame.style.visibility = "hidden";
    for (const child of sudoku.children) {
      child.style.visibility = "visible";
    }
    timer = setInterval(displayTime, 1000);
    btnNewYes.removeEventListener("clicked", startNewGame);
    enableButton();
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
			timerMin.innerHTML = "0" + Math.floor(time/60 % 60);
		else
			timerMin.innerHTML = Math.floor(time/60  % 60);
		if (time % 60 < 10)
			timerSec.innerHTML = "0" + time % 60;
		else
			timerSec.innerHTML = time % 60;
  }

  function findNumber(i, j, array) {
    return array[Math.floor(j / 3) * 9 + Math.floor(i / 3) * 27 + j % 3 + i % 3 * 3];
  }

  function disableButton() {
    btnNew.style.pointerEvents = "none";
    btnPause.style.pointerEvents = "none";
    btnCheck.style.pointerEvents = "none";
  }
  
  function enableButton() {
    btnNew.style.pointerEvents = "initial";
    btnPause.style.pointerEvents = "initial";
    btnCheck.style.pointerEvents = "initial";
  }

  btnStart.addEventListener("click", startGame, { once: true });
  btnNew.onclick = confirmNewGame;
  btnPause.onclick = pauseGame;
  btnCheck.onclick = checkSudoku;
}

