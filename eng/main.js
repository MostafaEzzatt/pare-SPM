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
  const removedLines = removeEmptyLines(rawValue).join("\n");

  let value = removedLines.replace("CH                 ", "   ");
  value = value.replaceAll("  CH              ", "");

  console.log(value);
  pre.innerHTML = value;
});

function removeEmptyLines(text) {
  return text.split("\n").filter((line) => line.trim() !== "");
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
