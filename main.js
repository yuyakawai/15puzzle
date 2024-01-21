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
  cells[0].update();
  cells[0].swapNumber();
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
          if (gameStatus.isGameClear || gameStatus.isGameOver) {
            return;
          }
          selfObject.swapCell(selfObject);
        };
      };

      if (window.ontouchstart === null) {
        cells[index].element.ontouchstart = handleEvent(cells[index]);
      } else {
        cells[index].element.onpointerdown = handleEvent(cells[index]);
      }
    },

    update: () => {
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
    },

    swapNumber: () => {
      [...Array(10000)].forEach(() => {
        cells[0].swapCell(
          cells[Math.trunc(Math.random() * (cells.length - 1))]
        );

        let num = Math.trunc(Math.random() * (cells.length - 1));
        if (num >= 16) {
          console.log(num);
        }
      });

      cells[0].update();
    },

    swapCell: (selfObject) => {
      const directions = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
      ];

      let prevCell = selfObject;

      let nextCell = directions
        .map((direction) => {
          if (
            cells[
              selfObject.x +
                direction.x +
                (selfObject.y + direction.y) * cellRow
            ] !== undefined &&
            cells[
              selfObject.x +
                direction.x +
                (selfObject.y + direction.y) * cellRow
            ].isEmpty
          ) {
            return cells[
              selfObject.x +
                direction.x +
                (selfObject.y + direction.y) * cellRow
            ];
          }
        })
        .find((cell) => cell !== undefined);
      if (nextCell === undefined) {
        return;
      }

      [prevCell.number, nextCell.number] = [nextCell.number, prevCell.number];
      [prevCell.isEmpty, nextCell.isEmpty] = [
        nextCell.isEmpty,
        prevCell.isEmpty,
      ];

      cells[0].update();
      checkClear();
    },
  };
});

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
