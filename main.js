const initialRemainingTime = 360;
const cellSize = 70;
const cellRow = 4;
const cellCol = 4;

const gameStatus = {
  isGameStart: true,
  isGameClear: false,
  isGameOver: false,
  startTime: 0,
  remainingTime: 0,
};

const mainContainer = {
  element: null,
  width: 320,
  height: 480,
};

const screenContainer = {
  element: null,
  width: cellSize * cellRow,
  height: cellSize * cellCol,
};

const timeMessageContainer = {
  element: null,
  width: screenContainer.width,
  height: screenContainer.height * 0.1,
};

const init = () => {
  mainContainer.element = document.getElementById("main-container");
  mainContainer.element.style.position = "relative";
  mainContainer.element.style.width = mainContainer.width + "px";
  mainContainer.element.style.height = mainContainer.height + "px";
  mainContainer.element.style.margin = "5px";
  mainContainer.element.style.fontFamily =
    "'Helvetica Neue',Arial, 'Hiragino Kaku Gothic ProN','Hiragino Sans', Meiryo, sans-serif";
  mainContainer.element.style.backgroundColor = "#f5deb3";
  mainContainer.element.style.border = "2px solid #deb887";
  mainContainer.element.style.boxSizing = "border-box";
  mainContainer.element.style.borderRadius = "5px";
  mainContainer.element.style.display = "flex";
  mainContainer.element.style.alignItems = "center";
  mainContainer.element.style.justifyContent = "center";
  mainContainer.element.style.flexDirection = "column";
  mainContainer.element.style.overflow = "hidden";
  mainContainer.element.style.userSelect = "none";
  mainContainer.element.style.webkitUserSelect = "none";

  screenContainer.element = document.createElement("div");
  screenContainer.element.style.position = "relative";
  screenContainer.element.style.width = screenContainer.width + "px";
  screenContainer.element.style.height = screenContainer.height + "px";
  screenContainer.element.style.margin = "1px";
  screenContainer.element.style.display = "flex";
  screenContainer.element.style.alignItems = "center";
  screenContainer.element.style.justifyContent = "center";
  screenContainer.element.style.backgroundColor = "black";
  mainContainer.element.appendChild(screenContainer.element);

  timeMessageContainer.element = document.createElement("div");
  timeMessageContainer.element.style.position = "relative";
  timeMessageContainer.element.style.width = timeMessageContainer.width + "px";
  timeMessageContainer.element.style.height =
    timeMessageContainer.height + "px";
  timeMessageContainer.element.style.margin = "1px";
  timeMessageContainer.element.style.fontSize = "20px";
  timeMessageContainer.element.textContent =
    "⌛ " + initialRemainingTime.toFixed(2);
  mainContainer.element.appendChild(timeMessageContainer.element);

  cells.forEach((cell) => cell.init());
};

const cells = Array.from({ length: cellRow * cellCol - 1 }).map((_, index) => ({
  element: null,
  number: index + 1,
  x: 0,
  y: 0,
  init() {
    this.x = index % cellRow;
    this.y = Math.trunc(index / cellRow);
    this.element = document.createElement("div");
    this.element.style.position = "absolute";
    this.element.style.width = cellSize + "px";
    this.element.style.height = cellSize + "px";
    this.element.style.left = this.x * cellSize + "px";
    this.element.style.top = this.y * cellSize + "px";
    this.element.style.border = "3px ridge #cb986f";
    this.element.style.backgroundColor = "#ccb28e";
    this.element.style.boxSizing = "border-box";
    this.element.style.fontSize = cellSize * 0.6 + "px";
    this.element.style.display = "flex";
    this.element.style.alignItems = "center";
    this.element.style.justifyContent = "center";
    this.element.style.cursor = "pointer";
    this.element.textContent = this.number;
    screenContainer.element.appendChild(this.element);

    if (window.ontouchstart === null) {
      this.element.ontouchstart = this.handleButtonDown(this);
    } else {
      this.element.onpointerdown = this.handleButtonDown(this);
    }
  },

  getCell(x, y) {
    return cells[y * cellRow + x];
  },

  update() {
    this.checkClear();
    this.swapNumber();
  },

  swapNumber() {
    let prevIndex = Math.trunc(Math.random() * cells.length);
    //let prevIndex = Math.trunc(Math.random() * cells.length)

    //cells[].number
  },

  checkClear() {
    if (cells.every((cell) => cell.number === cell.x + cell.y * cellRow + 1)) {
      gameStatus.isGameClear = true;
      showGameClearMessage();
    }
  },

  handleButtonDown(selfObject) {
    return (e) => {
      e.preventDefault();
      if (gameStatus.isGameClear || gameStatus.isGameOver) {
        return;
      }
      selfObject.update();
    };
  },
}));

const showGameClearMessage = () => {
  let messageElement = document.createElement("div");
  messageElement.style.position = "relative";
  messageElement.style.zIndex = "1";
  messageElement.style.width = screenContainer.width + "px";
  messageElement.style.height = screenContainer.height * 0.9 + "px";
  messageElement.style.display = "flex";
  messageElement.style.alignItems = "center";
  messageElement.style.justifyContent = "center";
  messageElement.style.color = "blue";
  messageElement.style.fontSize = "32px";
  messageElement.textContent = "Game Clear !!";
  screenContainer.element.appendChild(messageElement);
};

const showGameOverMessage = () => {
  let messageElement = document.createElement("div");
  messageElement.style.position = "relative";
  messageElement.style.zIndex = "1";
  messageElement.style.width = screenContainer.width + "px";
  messageElement.style.height = screenContainer.height * 0.9 + "px";
  messageElement.style.display = "flex";
  messageElement.style.alignItems = "center";
  messageElement.style.justifyContent = "center";
  messageElement.style.color = "red";
  messageElement.style.fontSize = "32px";
  messageElement.textContent = "Game Over";
  screenContainer.element.appendChild(messageElement);
};

const tick = () => {
  if (gameStatus.isGameClear || gameStatus.isGameOver) {
    return;
  }

  if (gameStatus.isGameStart) {
    if (gameStatus.startTime === 0) {
      gameStatus.startTime = performance.now();
    }

    gameStatus.remainingTime = Math.max(
      0,
      initialRemainingTime - (performance.now() - gameStatus.startTime) / 1000
    );

    timeMessageContainer.element.textContent =
      "⌛ " + gameStatus.remainingTime.toFixed(2);

    if (gameStatus.remainingTime <= 0) {
      gameStatus.isGameOver = true;
      showGameOverMessage();
    }
  }

  requestAnimationFrame(tick);
};

window.onload = () => {
  init();
  tick();
};
