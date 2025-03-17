const txtarea = document.querySelector("textarea");
const minus = document.querySelector("#minus");
const clean = document.querySelector("#clean");
const reset = document.querySelector("#reset");
const copy = document.querySelector("#copy");
const pre = document.querySelector("pre");
let first = false;

const flights = [];
let result = [];

clean.addEventListener("click", () => {
  const rawValue = txtarea.value;

  splitToFlights(rawValue);
  // divideToFortyFive();
});

function splitToFlights(rawValue) {
  const lines = rawValue.split("\n");
  let allLines = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];

    if (currentLine.length === 0) continue;

    let cleanLine = currentLine;
    if (currentLine.includes("EGYPTAIR")) {
      cleanLine = currentLine.replace("CH                 ", "  ");
    } else {
      cleanLine = cleanLine.replace(
        "  CH                                           ",
        "                             "
      );
    }

    console.log(cleanLine);
    allLines.push(cleanLine);
  }
  pre.innerHTML = allLines.join("\n");
}

function getFirstNighnLines() {
  const content = txtarea.value.split("\n");
  return content.slice(0, 9).filter((line) => line.length > 0);
}

function mentainClientNumber(flight, number) {
  return number + flight.split("").splice(2, flight.length)[1];
}

function replacePageNumber(header, number) {
  return header.replace(
    "PAGE 01",
    `PAGE ${number <= 9 ? `0${number}` : number}`
  );
}

reset.addEventListener("click", () => {
  txtarea.value = "";
  pre.innerHTML = "";
  result = [];
  first = false;
});

copy.addEventListener("click", () => {
  const copyText = pre.innerText;
  navigator.clipboard.writeText(copyText);
});
