const txtarea = document.querySelector("textarea");
const clean = document.querySelector("#clean");
const reset = document.querySelector("#reset");
const copy = document.querySelector("#copy");
const pre = document.querySelector("pre");
let first = false;

const maxWidth = 213;
const maxHeight = 32;
let result = [];

clean.addEventListener("click", () => {
  const rawValue = txtarea.value;

  editData(rawValue);
  joineArray(result);
});

function joineArray(data) {
  let addSep = [];

  for (let i = 0; i < data.length; i++) {
    const currentLine = data[i];

    if (currentLine.includes("EGYPTAIR") && first == false) {
      first = true;
      addSep.push(currentLine.replace("CH                 ", "   "));
    } else if (currentLine.includes("EGYPTAIR") && first == true) {
      addSep.push(
        " ------------------------------------------------------------------------------"
      );
      addSep.push(
        " ------------------------------------------------------------------------------"
      );
      addSep.push(currentLine.replace("CH                 ", " "));
    } else {
      addSep.push(
        currentLine.replace(
          "  CH                                           ",
          "                             "
        )
      );
    }
  }

  let final = addSep.join("\n");
  pre.innerHTML = final;
}

function editData(txt) {
  const splitedText = txt.split("\n");

  for (let i = 0; i < splitedText.length; i++) {
    const currentLine = splitedText[i];

    if (currentLine.length == 0) continue;

    result.push(currentLine);
  }
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
