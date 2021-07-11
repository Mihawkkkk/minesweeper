const grid = document.querySelector(".grid");
const icon = document.querySelector("button i");
let width = 10;
let number_of_div = 100;
grid.style.width = "400px";
grid.style.height = "400px";
let flag = 0;
let bombs = 15;
let squares = [];
let gameover = false;
function createBoard() {
  // create array
  const bombArray = Array(bombs).fill("bomb");
  const emptyArray = Array(number_of_div - bombs).fill("valid");
  const gameArray = emptyArray.concat(bombArray);
  const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
  //create divs
  for (let i = 0; i < number_of_div; i++) {
    const square = document.createElement("div");
    square.setAttribute("id", i);
    square.classList.add("main");
    square.classList.add(shuffledArray[i]);
    grid.appendChild(square);
    squares.push(square);
    // add click event
    square.addEventListener("click", function (e) {
      clickk(square);
    });
    //right click
    square.oncontextmenu = function (e) {
      e.preventDefault();
      addFlag(square);
    };
  }
  //add number
  for (let i = 0; i < squares.length; i++) {
    const isLeftEdge = i % width === 0;
    const isRightEdge = i % width === width - 1;
    let total = 0;
    if (squares[i].classList.contains("valid")) {
      if (i % width === 0) {
        let r = squares[i + 1];
        let t = squares[i - width];
        let tr = squares[i - width + 1];
        let b = squares[i + width];
        let br = squares[i + width + 1];
        let contact = [r, t, tr, b, br];
        for (let j = 0; j < 5; j++) {
          let one = contact[j];
          if (one != undefined) {
            if (one.classList.contains("bomb")) total++;
          }
        }
      } else if (i % width === width - 1) {
        let l = squares[i - 1];
        let t = squares[i - width];
        let tl = squares[i - width - 1];
        let b = squares[i + width];
        let bl = squares[i + width - 1];
        let contact = [l, t, tl, b, bl];
        for (let j = 0; j < 5; j++) {
          let one = contact[j];
          if (one != undefined) {
            if (one.classList.contains("bomb")) total++;
          }
        }
      } else {
        let l = squares[i - 1];
        let r = squares[i + 1];
        let t = squares[i - width];
        let tl = squares[i - width - 1];
        let tr = squares[i - width + 1];
        let b = squares[i + width];
        let bl = squares[i + width - 1];
        let br = squares[i + width + 1];
        let contact = [l, r, t, tl, tr, b, bl, br];
        for (let j = 0; j < 8; j++) {
          let one = contact[j];
          if (one != undefined) {
            if (one.classList.contains("bomb")) total++;
          }
        }
      }
      squares[i].setAttribute("data", total);
    }
  }
}
createBoard();
function addFlag(sq) {
  if (gameover) return;
  if (!sq.classList.contains("cheked")) {
    if (!sq.classList.contains("flag")) {
      sq.classList.add("flag");
      let i = document.createElement("i");
      i.classList.add("fas");
      i.classList.add("fa-flag");
      sq.appendChild(i);
      flag++;
      checkForWin();
    } else {
      sq.classList.remove("flag");
      sq.innerHTML = "";
      flag--;
      checkForWin();
    }
  }
}
function clickk(sq) {
  let currentId = sq.id;
  if (gameover) return;
  if (sq.classList.contains("cheked") || sq.classList.contains("flag")) return;
  if (sq.classList.contains("bomb")) {
    gameOver(sq);
  } else {
    let total = sq.getAttribute("data");
    if (total != 0) {
      sq.classList.add("cheked");
      sq.innerHTML = total;
      return;
    }
    checkSquare(currentId);
  }
  sq.classList.add("cheked");
}

function checkSquare(currentId) {
  const isLeftEdge = currentId % width === 0;
  const isRightEdge = currentId % width === width - 1;
  setTimeout(() => {
    if (currentId > 0 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1].id;
      const newSquare = document.getElementById(newId);
      clickk(newSquare);
    }
    if (currentId > width - 1 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 - width].id;
      const newSquare = document.getElementById(newId);
      clickk(newSquare);
    }
    if (currentId > width) {
      const newId = squares[parseInt(currentId - width)].id;
      const newSquare = document.getElementById(newId);
      clickk(newSquare);
    }
    if (currentId > width + 1 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 - width].id;
      const newSquare = document.getElementById(newId);
      clickk(newSquare);
    }
    if (currentId < number_of_div - 2 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1].id;
      const newSquare = document.getElementById(newId);
      clickk(newSquare);
    }
    if (currentId < number_of_div - width && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 + width].id;
      const newSquare = document.getElementById(newId);
      clickk(newSquare);
    }
    if (currentId < number_of_div - width - 2 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 + width].id;
      const newSquare = document.getElementById(newId);
      clickk(newSquare);
    }
    if (currentId < number_of_div - width - 1) {
      const newId = squares[parseInt(currentId) + width].id;
      const newSquare = document.getElementById(newId);
      clickk(newSquare);
    }
  }, 10);
}
function gameOver(sq) {
  gameover = true;
  document.querySelector("button").setAttribute("data-text", "OMG you lost");
  icon.classList = "";
  icon.classList.add("fas");
  icon.classList.add("fa-grin-squint-tears");
  document.querySelectorAll(".main").forEach((one) => {
    if (one.classList.contains("bomb")) {
      if (!one.classList.contains("flag")) {
        let i = document.createElement("i");
        i.classList.add("fas");
        i.classList.add("fa-bomb");
        one.appendChild(i);
      }
    } else {
      if (one.classList.contains("flag")) {
        let i = document.createElement("i");
        i.classList.add("fas");
        i.classList.add("fa-times");
        one.appendChild(i);
      }
    }
  });
}
function checkForWin() {
  let matches = 0;
  for (let i = 0; i < squares.length; i++) {
    if (
      squares[i].classList.contains("flag") &&
      squares[i].classList.contains("bomb")
    ) {
      matches++;
    }
    if (matches === bombs && flag === bombs) {
      gameover = true;
      icon.classList = "";
      icon.classList.add("fas");
      icon.classList.add("fa-smile-wink");
      document.querySelector("button").setAttribute("data-text", "GOOD JOB");
      return;
    }
  }
}
document.querySelector(".reset").addEventListener("click", function () {
  document
    .querySelector("button")
    .setAttribute("data-text", "I am reset button");
  icon.classList = "";
  icon.classList.add("fas");
  icon.classList.add("fa-smile");
  flag = 0;
  squares = [];
  gameover = false;
  for (let i = 0; i < number_of_div; i++) {
    grid.removeChild(grid.lastChild);
  }
  createBoard();
  responsive();
});
document.querySelector(".easy").addEventListener("click", function () {
  document
    .querySelector("button")
    .setAttribute("data-text", "I am reset button");
  icon.classList = "";
  icon.classList.add("fas");
  icon.classList.add("fa-smile");
  for (let i = 0; i < number_of_div; i++) {
    grid.removeChild(grid.lastChild);
  }
  flag = 0;
  squares = [];
  width = 10;
  number_of_div = 100;
  grid.style.width = "400px";
  grid.style.height = "400px";
  bombs = 15;
  gameover = false;
  createBoard();
  responsive();
});
document.querySelector(".hard").addEventListener("click", function () {
  document
    .querySelector("button")
    .setAttribute("data-text", "I am reset button");
  icon.classList = "";
  icon.classList.add("fas");
  icon.classList.add("fa-smile");
  for (let i = 0; i < number_of_div; i++) {
    grid.removeChild(grid.lastChild);
  }
  flag = 0;
  squares = [];
  width = 20;
  number_of_div = 200;
  grid.style.width = "800px";
  grid.style.height = "400px";
  bombs = 35;
  gameover = false;
  createBoard();
  responsive();
});
window.addEventListener("resize", responsive);

function responsive() {
  if (width == 10) {
    if (window.innerWidth < 450) {
      grid.style.width = "200px";
      grid.style.height = "200px";
      grid.childNodes.forEach((one) => {
        one.style.width = "20px";
        one.style.height = "20px";
      });
    } else {
      grid.style.width = "400px";
      grid.style.height = "400px";
      grid.childNodes.forEach((one) => {
        one.style.width = "40px";
        one.style.height = "40px";
      });
    }
  } else {
    if (window.innerWidth < 830) {
      grid.style.width = "400px";
      grid.style.height = "200px";
      grid.childNodes.forEach((one) => {
        one.style.width = "20px";
        one.style.height = "20px";
      });
    } else {
      grid.style.width = "800px";
      grid.style.height = "400px";
      grid.childNodes.forEach((one) => {
        one.style.width = "40px";
        one.style.height = "40px";
      });
    }
  }
}
