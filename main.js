const initialRemainingTime = 300;
const cellSize = 70;
const cellRow = 4;
const cellCol = 4;
const cellSwapCount = 1000;

const gameStatus = {
  isGameStart: false,
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

const controllerContainer = {
  element: null,
  width: screenContainer.width,
  height: mainContainer.height * 0.15,
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

  controllerContainer.element = document.createElement("div");
  controllerContainer.element.style.position = "relative";
  controllerContainer.element.style.width = controllerContainer.width + "px";
  controllerContainer.element.style.height = controllerContainer.height + "px";
  controllerContainer.element.style.margin = "0px";
  controllerContainer.element.style.fontSize = "32px";
  controllerContainer.element.style.boxSizing = "border-box";
  controllerContainer.element.style.display = "flex";
  controllerContainer.element.style.alignItems = "center";
  controllerContainer.element.style.justifyContent = "center";
  mainContainer.element.appendChild(controllerContainer.element);

  cells.forEach((cell) => cell.init());
  controller.init();
  updateCell();
};

const controller = {
  button: { element: null, isPressed: false },

  init: () => {
    let buttonElement = document.createElement("div");
    buttonElement.style.position = "relative";
    buttonElement.style.width = controllerContainer.width * 0.5 + "px";
    buttonElement.style.height = controllerContainer.height * 0.6 + "px";
    buttonElement.style.margin = "15px";
    buttonElement.style.fontSize = controllerContainer.width * 0.08 + "px";
    buttonElement.style.backgroundColor = "orange";
    buttonElement.style.borderBottom = "5px solid #b84c00";
    buttonElement.style.borderRadius = "7px";
    buttonElement.style.boxSizing = "border-box";
    buttonElement.style.cursor = "pointer";
    buttonElement.style.display = "flex";
    buttonElement.style.alignItems = "center";
    buttonElement.style.justifyContent = "center";
    buttonElement.textContent = "スタート";
    controller.button.element = buttonElement;
    controllerContainer.element.appendChild(buttonElement);

    const handleButtonDown = (e) => {
      e.preventDefault();
      controller.changeStatus(!controller.button.isPressed);
    };

    const handleButtonUp = (e) => {
      e.preventDefault();
      gameStatus.isGameStart = true;
      resetGame();
      buttonElement.textContent = "リセット";
      controller.changeStatus(!controller.button.isPressed);
    };

    if (window.ontouchstart === null) {
      buttonElement.ontouchstart = handleButtonDown;
      buttonElement.ontouchend = handleButtonUp;
    } else {
      buttonElement.onpointerdown = handleButtonDown;
      buttonElement.onpointerup = handleButtonUp;
    }

    controller.update();
  },

  changeStatus: (isPressed) => {
    controller.button.isPressed = isPressed;
    controller.update();
  },

  update: () => {
    if (controller.button.isPressed) {
      controller.button.element.style.borderBottom = "1px solid #b84c00";
      controller.button.element.style.backgroundColor = "#b84c00";
    } else {
      controller.button.element.style.borderBottom = "5px solid #b84c00";
      controller.button.element.style.backgroundColor = "orange";
    }
  },
};

const cells = [...Array(cellRow * cellCol)].map((_, index) => {
  return {
    element: null,
    number: index + 1,
    isEmpty: false,
    x: 0,
    y: 0,
    init: () => {
      cells[index].x = index % cellRow;
      cells[index].y = Math.trunc(index / cellRow);
      cells[index].element = document.createElement("div");
      cells[index].element.style.position = "absolute";
      cells[index].element.style.width = cellSize + "px";
      cells[index].element.style.height = cellSize + "px";
      cells[index].element.style.left = cells[index].x * cellSize + "px";
      cells[index].element.style.top = cells[index].y * cellSize + "px";
      cells[index].element.style.border = "3px ridge #cb986f";
      cells[index].element.style.backgroundColor = "#ccb28e";
      cells[index].element.style.boxSizing = "border-box";
      cells[index].element.style.fontSize = cellSize * 0.6 + "px";
      cells[index].element.style.display = "flex";
      cells[index].element.style.alignItems = "center";
      cells[index].element.style.justifyContent = "center";
      cells[index].element.style.cursor = "pointer";
      cells[index].element.textContent = cells[index].number;
      screenContainer.element.appendChild(cells[index].element);

      if (index === cells.length - 1) {
        cells[index].isEmpty = true;
      }

      const handleEvent = (selfObject) => {
        return (e) => {
          e.preventDefault();
          if (
            gameStatus.isGameStart === false ||
            gameStatus.isGameClear ||
            gameStatus.isGameOver
          ) {
            return;
          }
          swapCell(selfObject);
        };
      };

      if (window.ontouchstart === null) {
        cells[index].element.ontouchstart = handleEvent(cells[index]);
      } else {
        cells[index].element.onpointerdown = handleEvent(cells[index]);
      }
    },
  };
});

const updateCell = () => {
  cells.forEach((cell) => {
    if (cell.isEmpty) {
      cell.element.style.backgroundColor = "black";
      cell.element.style.border = "none";
      cell.element.textContent = "";
    } else {
      cell.element.style.border = "3px ridge #cb986f";
      cell.element.style.backgroundColor = "#ccb28e";
      cell.element.textContent = cell.number;
    }
  });
};

const swapCell = (selfCell) => {
  const directions = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
  ];

  let nextCell = directions
    .map((direction) => {
      if (
        selfCell.x + direction.x < 0 ||
        selfCell.x + direction.x >= cellRow ||
        selfCell.y + direction.y < 0 ||
        selfCell.y + direction.y >= cellCol
      ) {
        return undefined;
      }
      let targetCell =
        cells[selfCell.x + direction.x + (selfCell.y + direction.y) * cellRow];
      if (targetCell !== undefined && targetCell.isEmpty) {
        return targetCell;
      }
    })
    .find((cell) => cell !== undefined);
  if (nextCell === undefined) {
    return;
  }

  [selfCell.number, nextCell.number] = [nextCell.number, selfCell.number];
  [selfCell.isEmpty, nextCell.isEmpty] = [nextCell.isEmpty, selfCell.isEmpty];

  updateCell();
  checkClear();
};

const resetGame = () => {
  gameStatus.startTime = performance.now();
  gameStatus.remainingTime = initialRemainingTime;
  [...Array(cellSwapCount)].forEach(() => {
    swapCell(cells[Math.trunc(Math.random() * (cells.length - 1))]);
  });

  if (gameStatus.isGameOver || gameStatus.isGameClear) {
    gameStatus.isGameOver = false;
    gameStatus.isGameClear = false;
    screenContainer.element.removeChild(screenContainer.element.lastChild);
    requestAnimationFrame(tick);
  }
};

const checkClear = () => {
  if (cells.every((cell) => cell.number === cell.x + cell.y * cellRow + 1)) {
    gameStatus.isGameClear = true;
    showGameClearMessage();
  }
};

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
