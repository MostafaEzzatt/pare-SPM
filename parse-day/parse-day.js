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
  divideToFortyFive();
});

function splitToFlights(rawValue) {
  const lines = rawValue.split("\n");
  let allLines = [];
  let currentFlight = [];
  for (let i = 0; i < lines.length; i++) {
    currentLine = lines[i];
    if (currentLine.length === 0) {
      continue;
    }

    if (currentLine.includes("EGYPTAIR")) {
      i = i + 8;
      continue;
    }

    if (
      currentLine.includes(
        " ------------------------------------------------------------------------------"
      )
    ) {
      continue;
    }

    allLines.push(currentLine);
  }

  for (let i = 0; i < allLines.length; i++) {
    let currentLine = allLines[i];
    currentFlight.push(currentLine);

    if ((i + 1) % 12 === 0) {
      const final = currentFlight.join("\n");
      flights.push(final);
      currentFlight = [];
      continue;
    }
  }
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

function divideToFortyFive() {
  const header =
    getFirstNighnLines().join("\n").replace("CH                 ", "   ") + "\n";
  pre.innerHTML = header;
  let counter = 0;
  let pageNumber = 2;
  let isFirst = true;
  let content = "";

  const realLength = isNaN(parseInt(minus.value))
    ? flights.length
    : flights.length - [...flights].splice(0, parseInt(minus.value)).length;

  console.log(realLength, flights.length);

  for (let i = 0; i < realLength; i++) {
    const flight = flights[i].replace(
      "  CH                                           ",
      "                             "
    );

    if (isFirst) {
      content += flight + "\n";
      counter++;

      if (counter === 3) {
        isFirst = false;
        counter = 0;
        content += "\n" + replacePageNumber(header, pageNumber);
        pageNumber++;
        continue;
      }
      content +=
        " ------------------------------------------------------------------------------" +
        "\n";
    }

    if (!isFirst && typeof flight === "string") {
      let renderFlight =
        counter === 0
          ? " 077" + flight.split("").splice(4, flight.length).join("")
          : flight.replace("077", "   ");
      content += renderFlight + "\n";

      counter++;

      if (counter === 3) {
        isFirst = false;
        counter = 0;

        if (i !== flights.length - 1) {
          content += "\n" + replacePageNumber(header, pageNumber);
          pageNumber++;
        }

        continue;
      }
      content +=
        " ------------------------------------------------------------------------------" +
        "\n";
    }
  }

  pre.innerHTML += content;
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
