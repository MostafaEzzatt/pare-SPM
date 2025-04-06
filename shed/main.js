const txtarea = document.querySelector("textarea");
const clean = document.querySelector("#clean");
const reset = document.querySelector("#reset");
const print = document.querySelector("#print");
const pre = document.querySelector("pre");
const content = document.querySelector(".content");
let header = "";

clean.addEventListener("click", () => {
  // page is 50 line
  const rawValue = txtarea.value;
  let value = rawValue.replaceAll("CH                 ", " ");
  const lines = value.split("\n");
  const lineCount = lines.length - 1;
  const pageCount = Math.ceil(lineCount / 72);
  let result = [];

  for (let i = 0; i < pageCount; i++) {
    const start = i * 72;
    const end = start + 72;
    const pageLines = lines.slice(start, end);
    const pageContent = pageLines.join("\n");
    result.push(pageContent);
  }

  // make page line count 50

  for (let i = 0; i < result.length; i++) {
    const pageLines = result[i].split("\n");
    const pageLineCount = pageLines.length;

    result[i] = pageLines.splice(0, 50).join("\n");
  }

  console.log(result);
  pre.innerHTML = result.join("\n");
});

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
