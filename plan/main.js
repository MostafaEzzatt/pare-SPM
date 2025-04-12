const txtarea = document.querySelector("textarea");
const clean = document.querySelector("#clean");
const reset = document.querySelector("#reset");
const print = document.querySelector("#print");
const pre = document.querySelector("pre");
const content = document.querySelector(".content");
let header = "";

clean.addEventListener("click", () => {
  const rawValue = txtarea.value;
  let first = false;

  let value = rawValue.replaceAll("  CH               ", "");
  value = value.replaceAll("CH                 ", "  ");
  value = value.replaceAll("  CH              ", " ");

  const lines = value.split("\n");
  let header = [];
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // remove empty lines
    if (line.trim() === "") {
      continue;
    }

    const inc = 7;

    // get header
    if (line.includes("COMPUTER CENTER") && !first) {
      header.push(lines[i - 1]);
      header.push(line);
      header.push(lines[i + 1]);
      header.push(lines[i + 2]);
      // header.push(lines[i + 3]);
      header.push("                             كشف الرحلات اليومية المخطط");
      header.push(lines[i + 4]);
      header.push(lines[i + 5]);
      header.push(lines[i + 6]);
      header.push(lines[i + 7]);

      result = result.slice(0, -1);
      i += inc;
      first = true;
      continue;
    } else if (line.includes("COMPUTER CENTER") && first) {
      result = result.slice(0, -1);
      i += inc;
      continue;
    }

    if (result.length > 0 && result[result.length - 1][0] !== "") {
      result.push([""]);
    }

    result.push(line);
  }

  const headLine = result[0].slice(0, 39).trim();

  result = result.map((line, idx) => {
    if (line.includes(headLine) && idx > 0) {
      return line.replace(headLine, "                           ");
    }
    return line;
  });

  pre.innerHTML = `${header.join("\n")}\n${result.join("\n")}`;
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
