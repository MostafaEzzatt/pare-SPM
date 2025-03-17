const txtarea = document.querySelector("textarea");
const minus = document.querySelector("#minus");
const clean = document.querySelector("#clean");
const reset = document.querySelector("#reset");
const print = document.querySelector("#print");
const pre = document.querySelector("pre");
let first = false;

const flights = [];
let result = [];

print.addEventListener("click", () => {
  window.print();
});

clean.addEventListener("click", () => {
  const rawValue = txtarea.value;

  splitToFlights(rawValue);
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
      cleanLine = cleanLine
        .replace(
          "  CH                                           ",
          "                             "
        )
        .replace(
          "  CH                                        ",
          "                          "
        );
    }

    allLines.push(cleanLine);
  }

  // pre.innerHTML = allLines.join("\n");
  createSpace(allLines);
}

function addHeaderSpaces(header, spac) {
  console.log({ header, spac });
  return (
    header.substr(0, 24) +
    spac +
    header.substr(24, 29) +
    spac +
    header.substr(53, 100)
  );
}

function createSpace(allLines) {
  let result = [];

  for (let i = 0; i < allLines.length; i++) {
    const currentLine = allLines[i];

    // add next 9 lines if found "EGYPTAIR"
    if (currentLine.includes("EGYPTAIR")) {
      result.push(addHeaderSpaces(currentLine, "      "));
      result.push(addHeaderSpaces(allLines[i + 1], "      "));
      result.push(addHeaderSpaces(allLines[i + 2], "      "));
      result.push(addHeaderSpaces(allLines[i + 3], "      "));
      result.push(addHeaderSpaces(allLines[i + 4], "      "));
      result.push(allLines[i + 5]);

      let correctSpace =
        allLines[i + 6].substr(0, 43) +
        "----" +
        allLines[i + 6].substr(43, 17) +
        "----" +
        allLines[i + 6].substr(61, 15) +
        "----" +
        allLines[i + 6].substr(76, 16);
      result.push(correctSpace);

      i = i + 6;
    } else if (currentLine.includes("-")) {
      result.push(currentLine + "-----------");
      continue;
    } else {
      let correctSpace =
        allLines[i].substr(0, 43) +
        "    " +
        allLines[i].substr(43, 17) +
        "   " +
        allLines[i].substr(61, 15) +
        "     " +
        allLines[i].substr(76, 16);

      result.push(correctSpace);
    }
  }

  pre.innerHTML = result.join("\n");
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
