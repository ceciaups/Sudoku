window.onload = function() {

  var sudokuDB = ["004300209005009001070060043006002087190007400050083000600000105003508690042910300,864371259325849761971265843436192587198657432257483916689734125713528694542916378",
"040100050107003960520008000000000017000906800803050620090060543600080700250097100,346179258187523964529648371965832417472916835813754629798261543631485792254397186",
"600120384008459072000006005000264030070080006940003000310000050089700000502000190,695127384138459672724836915851264739273981546946573821317692458489715263562348197",
"497200000100400005000016098620300040300900000001072600002005870000600004530097061,497258316186439725253716498629381547375964182841572639962145873718623954534897261",
"005910308009403060027500100030000201000820007006007004000080000640150700890000420,465912378189473562327568149738645291954821637216397854573284916642159783891736425",
"100005007380900000600000480820001075040760020069002001005039004000020100000046352,194685237382974516657213489823491675541768923769352841215839764436527198978146352",
"009065430007000800600108020003090002501403960804000100030509007056080000070240090,289765431317924856645138729763891542521473968894652173432519687956387214178246395",
"000000657702400100350006000500020009210300500047109008008760090900502030030018206,894231657762495183351876942583624719219387564647159328128763495976542831435918276",
"503070190000006750047190600400038000950200300000010072000804001300001860086720005,563472198219386754847195623472638519951247386638519472795864231324951867186723945",
"060720908084003001700100065900008000071060000002010034000200706030049800215000090,163725948584693271729184365946358127371462589852917634498231756637549812215876493"];
  const sudokuBoxSize = 9;
  const sudokuSize = sudokuBoxSize * sudokuBoxSize;
  var quiz = "";
  var solution = "";
  var chosen = 0;
  var time = 0;
  var timer;

  var startPage = document.getElementById("start-page");
  var newGame = document.getElementById("new-game");
  var sudoku = document.getElementById("sudoku");
  var checkMsg = document.getElementById("check-message");
  var timerMin = document.getElementById("timer-min");
  var timerSec = document.getElementById("timer-sec");
  var btnStart = document.getElementById("button-start");
  var btnNew = document.getElementById("button-new");
  var btnCheck = document.getElementById("button-check");
  var btnNewYes = document.getElementById("button-new-confirm");
  var btnNewNo = document.getElementById("button-new-cancel");
  
  function genSudoku() {
    chosen = Math.floor(Math.random() * 10);
    quiz = sudokuDB[chosen].split(",")[0];
    solution = sudokuDB[chosen].split(",")[1];
    checkMsg.innerHTML = "Puzzle #" + (chosen + 1);
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
    genSudoku();
    startPage.style.visibility = "hidden";
  }

  function confirmNewGame() {
    newGame.style.visibility = "visible";
    for (const child of sudoku.children) {
      child.style.visibility = "hidden";
    }
    clearInterval(timer);
    btnNewYes.addEventListener("click", startNewGame, { once: true });
    btnNewNo.addEventListener("click", resumeGame, { once: true });
  }

  function startNewGame() {
    newGame.style.visibility = "hidden";
    for (const child of sudoku.children) {
      child.style.visibility = "visible";
    }
    sudoku.innerHTML = "";
    timerMin.innerHTML = "00";
    timerSec.innerHTML = "00";
    time = 0;
    checkMsg.style.color = "var(--blue-300)";
    genSudoku();
    btnNewNo.removeEventListener("clicked", resumeGame)
  }

  function resumeGame() {
    newGame.style.visibility = "hidden";
    for (const child of sudoku.children) {
      child.style.visibility = "visible";
    }
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

  btnStart.onclick = startGame;
  btnNew.onclick = confirmNewGame;
  btnCheck.onclick = checkSudoku;
}