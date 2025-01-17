const txtarea = document.querySelector("textarea");
const cleanButton = document.querySelector("button");
const renderELem = document.querySelector(".table");
const walkedThrough = [];
const allSPM = [];

function createDivWithClass(classListtxt) {
  const elem = document.createElement("div");
  elem.classList = classListtxt;
  return elem;
}

function renderData(data) {
  for (let d = 0; d < data.length; d++) {
    const mainElement = createDivWithClass("table-row");
    const mealType = createDivWithClass("");
    mealType.innerHTML = data[d]["meal-type"];

    const classElem = createDivWithClass("");
    classElem.innerHTML = data[d]["class"];

    const count = createDivWithClass("");
    count.innerHTML = data[d]["count"];

    mainElement.appendChild(mealType);
    mainElement.appendChild(classElem);
    mainElement.appendChild(count);

    renderELem.appendChild(mainElement);
  }
}

function getRecordMeal(data, recordNumber) {
  let recordIdx = -1;

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    if (!element.includes("SSR")) {
      const currentRecordNumber = parseInt(element.trim().split(" ")[0]);
      if (currentRecordNumber == recordNumber + 1) {
        recordIdx = i;
        break;
      }
    }
  }

  return recordIdx;
}

function cleanData() {
  const txtValue = txtarea.value;
  const valueSplited = txtValue.split("\n");

  let cleanedValueSplitedOne = valueSplited.filter(
    (i) => i !== ")>" && i !== ">" && i !== "m"
  );

  let cleanedValueSplitedTwo = cleanedValueSplitedOne.splice(
    5,
    cleanedValueSplitedOne.length - 7
  );

  for (let i = 0; i < cleanedValueSplitedTwo.length; i++) {
    currentLine = cleanedValueSplitedTwo[i];

    if (!currentLine.includes("SSR")) {
      // Get Flight Class
      cureLine = currentLine.trim().replaceAll(/\s+/gm, " ").split(" ");
      flightClass = cureLine[cureLine.length - 4];

      const currentRecordNumber = parseInt(cureLine[0]);
      const nextRecordIDX = getRecordMeal(
        cleanedValueSplitedTwo,
        currentRecordNumber
      );

      const cureNextLine = cleanedValueSplitedTwo[nextRecordIDX - 1]
        ? cleanedValueSplitedTwo[nextRecordIDX - 1].trim().split(" ")
        : cleanedValueSplitedTwo[i + 1].trim().split(" ");

      const horusClassChar = ["d", "j", "c", "r", "a", "i", "z"];
      const setClass = horusClassChar.includes(
        cureLine[cureLine.length - 4].trim().toLowerCase()
      )
        ? "H"
        : "Y";
      const mealType = cureNextLine[1];

      if (walkedThrough.includes(currentRecordNumber)) {
        continue;
      } else {
        walkedThrough.push(currentRecordNumber);
      }

      if (mealType == "MOML") {
        continue;
      }

      const isObjectExist = allSPM.findIndex(
        (elem) => elem["class"] == setClass && elem["meal-type"] == mealType
      );

      if (isObjectExist == -1) {
        allSPM.push({
          class: setClass,
          "meal-type": mealType,
          count: 1,
        });
      } else {
        allSPM[isObjectExist]["count"] += 1;
      }
    }
  }
  renderData(allSPM);
}

cleanButton.addEventListener("click", cleanData);
