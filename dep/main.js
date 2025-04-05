const txtarea = document.querySelector("textarea");
const clean = document.querySelector("#clean");
const reset = document.querySelector("#reset");
const print = document.querySelector("#print");
const pre = document.querySelector("pre");
const content = document.querySelector(".content");
let header = "";
let result = [];

clean.addEventListener("click", () => {
  const rawValue = txtarea.value;
  const removedLines = removeEmptyLines(rawValue);
  let firstHeader = false;
  let result = [];

  for (let i = 0; i < removedLines.length; i++) {
    const line = removedLines[i];

    if (line.includes("EGYPTAIR") && !firstHeader) {
      header += line + "\n";
      header += removedLines[i + 1] + "\n";
      header += removedLines[i + 2] + "\n";
      header += removedLines[i + 3] + "\n";
      // header += removedLines[i + 3] + "\n";
      header +=
        "                            كشف رحلات القيام اليومى بمصر للطيران\n";
      header += "                        -----------------------------------\n";
      // header += removedLines[i + 4] + "\n";
      // header += removedLines[i + 5] + "\n";
      header += removedLines[i + 6] + "\n";
      header +=
        " CUS    FLIGHT NO       R    O    U    T    E       A/C     A.T.D    NO.OF\n";
      // header += removedLines[i + 7] + "\n";
      header +=
        " ---  -وقت القيام   ----    ----------------------------   -الحرف--الرقم   SECTOR\n";
      // header += removedLines[i + 8] + "\n";
      i = i + 8;
      firstHeader = true;
      continue;
    } else if (line.includes("EGYPTAIR") && firstHeader) {
      i = i + 8;
      continue;
    }

    const splitLine = [
      line.substring(0, 6).trim(),
      line.substring(6, 10).trim(),
      line.substring(10, 16).trim(),
      line.substring(16, 28).trim(),
      line.substring(28, 53).trim(),
      line.substring(53, 57).trim(),
      line.substring(57, 69).trim(),
      line.substring(16, 28).trim().includes(" ") ? "2" : "1",
    ];

    console.log(splitLine);
    result.push(splitLine);
  }

  pre.innerHTML = header;
  renderLines(result);
});

function createDIVElement(className) {
  const div = document.createElement("div");
  div.className = className;
  return div;
}

function renderLines(linesArr) {
  for (let i = 0; i < linesArr.length; i++) {
    const raw = createDIVElement("raw");
    const line = linesArr[i];

    const customerNumber = createDIVElement("customer-number");
    customerNumber.innerHTML = line[0];

    const flightNumber = createDIVElement("flight-number");
    flightNumber.innerHTML = line[1];

    const registery = createDIVElement("registery");
    registery.innerHTML = line[2];

    const route = createDIVElement("route");
    route.innerHTML = line[3];

    const routeAR = createDIVElement("route-ar");
    routeAR.innerHTML = findARDIST(line[3]);

    const ac = createDIVElement("ac");
    ac.innerHTML = line[5];

    const atd = createDIVElement("atd");
    atd.innerHTML = line[6];

    const sector = createDIVElement("sector");
    sector.innerHTML = line[7];

    raw.appendChild(customerNumber);
    raw.appendChild(flightNumber);
    raw.appendChild(registery);
    raw.appendChild(route);
    raw.appendChild(routeAR);
    raw.appendChild(ac);
    raw.appendChild(atd);
    raw.appendChild(sector);
    content.appendChild(raw);

    if (i % 31 === 0 && i !== 0) {
      const pageBreak = document.createElement("pre");
      pageBreak.className =
        "mx-auto w-fit mt-3 print:text-black roboto-mono-mostafa";
      pageBreak.innerHTML = header;
      content.appendChild(pageBreak);
    }
  }
}

function findARDIST(code) {
  if (code.includes(" ")) {
    let codeArr = code.replace(/\s+/g, " ").split(" ");
    return `${ports.find((p) => p.Code === codeArr[0])["cap-ar"] || ""} ${
      ports.find((p) => p.Code === codeArr[1])["cap-ar"] || ""
    }`;
  }

  let isExist = ports.find((p) => p.Code === code);

  if (!isExist) {
    return "*************";
  }

  return isExist["cap-ar"];
}

function prepArDIST(txt) {
  const max = 27;
  const txtLength = txt.length;
  let diff = max > txtLength ? max - txtLength : 0;

  const realDiff = txt.includes(" ") ? diff - 1 : diff;

  let result = "";

  if (txt.includes("*")) {
    result += "      ";
  } else {
    for (let i = 0; i < realDiff; i++) {
      result += " ";
    }
  }
  result += txt;

  return result;
}

function removeEmptyLines(text) {
  return text
    .split("\n")
    .map((line) =>
      line
        .replace("            CH                 ", "  ")
        .replace("  CH                 ", "  ")
        .replace("  CH", "")
    )
    .filter((line) => line.trim() !== "");
}

reset.addEventListener("click", () => {
  result = [];
  txtarea.value = "";
  pre.innerHTML = "";
  content.innerHTML = "";
  header = "";
});

print.addEventListener("click", () => {
  window.print();
});
