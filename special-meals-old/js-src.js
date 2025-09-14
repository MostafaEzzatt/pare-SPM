const txtarea = document.querySelector("textarea");
const cleanButton = document.querySelector("#clean");
const resetButton = document.querySelector("#reset");
const renderELem = document.querySelector(".table");
let walkedThrough = [];
let allSPM = [];

function createDivWithClass(classListtxt) {
  const elem = document.createElement("div");
  elem.classList = classListtxt;
  return elem;
}

function renderData(data) {
  for (let d = 0; d < data.length; d++) {
    const mainElement = createDivWithClass(
      "mx-auto flex w-fit border-b border-zinc-700"
    );
    const mealType = createDivWithClass("");
    mealType.classList =
      "w-28 py-1.5 border-r-2 border-zinc-700 text-center last-of-type:border-r-0";
    mealType.innerHTML = data[d]["meal-type"].toUpperCase();

    const classElem = createDivWithClass("");
    classElem.classList =
      "w-28 py-1.5 border-r-2 border-zinc-700 text-center last-of-type:border-r-0";
    classElem.innerHTML = data[d]["class"];

    const count = createDivWithClass("");
    count.classList =
      "w-28 py-1.5 border-r-2 border-zinc-700 text-center last-of-type:border-r-0";
    count.innerHTML = data[d]["count"];

    mainElement.classList.add(
      data[d]["class"] === "H" ? "bg-sky-500" : "bg-teal-500"
    );

    mainElement.appendChild(mealType);
    mainElement.appendChild(classElem);
    mainElement.appendChild(count);

    renderELem.appendChild(mainElement);
  }
}

function getRecordMeal(data, recordNumber) {
  return data.findIndex((element) => {
    if (!element.includes("SSR")) {
      const currentRecordNumber = parseInt(element.trim().split(" ")[0]);
      return currentRecordNumber === recordNumber + 1;
    }
    return false;
  });
}

function cleanData() {
  const txtValue = txtarea.value.trim();
  const valueSplitted = txtValue.toLowerCase().split("\n");

  const splitArgOne = valueSplitted.findIndex((el) => el.trim() == ">");
  const cleanContent = valueSplitted
    .slice(splitArgOne + 5)
    .filter((i) => ![")>", ">", "m", "md", "end of display"].includes(i));

  console.log(cleanContent);
  for (let i = 0; i < cleanContent.length; i++) {
    currentLine = cleanContent[i];

    if (!currentLine.includes("ssr")) {
      // Get Flight Class
      const cureLine = currentLine.trim().replaceAll(/\s+/gm, " ").split(" ");
      const flightClass = currentLine.trim().charAt(42);

      const currentRecordNumber = parseInt(cureLine[0]);
      const nextRecordIDX = getRecordMeal(cleanContent, currentRecordNumber);

      const cureNextLine = cleanContent[nextRecordIDX - 1]
        ? cleanContent[nextRecordIDX - 1].trim().split(" ")
        : cleanContent[i + 1].trim().split(" ");

      if (cureNextLine.length > 4) continue;

      const horusClassChar = ["d", "j", "c", "r", "a", "i", "z", "p", "o", "f"];

      if (cureLine[cureLine.length - 4] == undefined) {
        console.log({ cureLine });
        continue;
      }

      const setClass = horusClassChar.includes(
        cureLine[cureLine.length - 4].trim().toLowerCase()
      )
        ? "H"
        : "Y";

      let mealType = "";

      switch (cureNextLine[1]) {
        case "vlml":
          mealType = "vgml";
          break;
        case "avml":
          mealType = "vgml";
          break;
        case "vjml":
          mealType = "vgml";
          break;

        // case "lcml":
        //   mealType = "vgml";
        //   break;
        // case "lfml":
        //   mealType = "vgml";
        //   break;

        default:
          mealType = cureNextLine[1];
          break;
      }

      if (walkedThrough.includes(currentRecordNumber) || mealType == "moml") {
        continue;
      }

      walkedThrough.push(currentRecordNumber);

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
  renderELem.innerHTML = "";
  console.log({ allSPM });
  renderData(allSPM);
}

function clearData() {
  txtarea.value = "";
  renderELem.innerHTML = "";
  walkedThrough = [];
  allSPM = [];
}

cleanButton.addEventListener("click", cleanData);
resetButton.addEventListener("click", clearData);
