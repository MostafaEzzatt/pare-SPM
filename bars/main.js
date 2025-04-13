const txtarea = document.querySelector("#main-textarea");
const firstPrag = document.querySelector("#first-paragraph");
const secondPrag = document.querySelector("#second-paragraph");
const clean = document.querySelector("#clean");
const update = document.querySelector("#update-text");
const reset = document.querySelector("#reset");
const print = document.querySelector("#print");
const pre = document.querySelector("pre");
const content = document.querySelector(".content");
let header = "";

function splitTextIntoPages(text) {
  // Split the input text by line breaks
  const lines = text.split(/\r?\n/);

  // Array to hold the pages and a temporary array to collect lines for the current page
  const pages = [];
  let currentPage = [];

  // Iterate through each line
  lines.forEach((line) => {
    // Check if the line contains the marker "EGYPTAIR"
    if (line.includes("EGYPTAIR")) {
      // If currentPage already has content, push it as a new page
      if (currentPage.length > 0) {
        pages.push(currentPage.join("\n"));
        currentPage = [];
      }
    }
    // Add the current line to the current page
    currentPage.push(line);
  });

  // Push the final collected page if there are remaining lines
  if (currentPage.length > 0) {
    pages.push(currentPage.join("\n"));
  }

  // Output the result for verification
  // console.log(pages);

  // For example, you could also display how many pages were found:
  // console.log("Number of pages:", pages.length);

  return pages;
}

function removePipedLines(text) {
  // Split the input text by line breaks.
  const lines = text.split(/\r?\n/);

  // Filter out the lines that consist solely of "|" characters (and any whitespace)
  const filteredLines = lines.filter((line) => {
    // Remove leading/trailing whitespace
    let trimmed = line.trim();
    trimmed = trimmed.replace(/\s+/gm, "");
    // Use a regular expression: if the trimmed line is one or more "|" characters, remove it.
    return !/^[|]+$/.test(trimmed);
  });

  // Join the filtered lines back into one text string.
  return filteredLines.join("\n");
}

function removeEmptyLines(text) {
  // Split the input text into an array of lines (handles both Unix and Windows line breaks)
  const lines = text.split(/\r?\n/);

  // Filter out lines that are empty or contain only whitespace characters
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  // Join the filtered lines back into a single string with newline separators
  return nonEmptyLines.join("\n");
}

function saveTextToLocalStorage(key, text) {
  // Check if the key exists in local storage
  if (localStorage.getItem(key) === null) {
    console.log(`Key "${key}" does not exist. Adding new entry.`);
  } else {
    console.log(`Key "${key}" exists. Replacing the existing value.`);
  }

  // Save (or replace) the text in local storage under the given key
  localStorage.setItem(key, text);
}

function replaceLinesBetweenMarkers(text, replacement) {
  // Split text into an array of lines (handles both Unix and Windows line breaks)
  const lines = text.split(/\r?\n/);

  // Find the last index of a line that contains a "|"
  let lastPipeIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("|")) {
      lastPipeIndex = i;
    }
  }

  // If no line includes "|" then there's nothing to replace; return the original text.
  if (lastPipeIndex === -1) {
    return text;
  }

  // Starting from the line after the lastPipeIndex, find the first line that includes "STORE KEEPER"
  let storeKeeperIndex = -1;
  for (let i = lastPipeIndex + 1; i < lines.length; i++) {
    if (lines[i].includes("STORE KEEPER")) {
      storeKeeperIndex = i;
      break;
    }
  }

  // If no "STORE KEEPER" line is found after the last pipe line, return the original text.
  if (storeKeeperIndex === -1) {
    return text;
  }

  // Build the new list of lines:
  // 1. All lines up through the last line containing "|"
  // 2. The replacement text
  // 3. From the "STORE KEEPER" line to the end.
  const newLines = [
    ...lines.slice(0, lastPipeIndex + 1),
    replacement,
    ...lines.slice(storeKeeperIndex),
  ];

  // Join the new lines into a single string and return it
  return newLines.join("\n");
}

function processText(text, replacementBetween, replacementAfter) {
  // Split text into an array of lines (handles both Unix and Windows line breaks)
  let lines = text.split(/\r?\n/);

  // ----- Step 1: Replace lines between last "|" line and "STORE KEEPER" -----

  // Find the last index of a line that contains a "|"
  let lastPipeIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("|")) {
      lastPipeIndex = i;
    }
  }

  // If a line with "|" was found, search forward for the first line that contains "STORE KEEPER"
  if (lastPipeIndex !== -1) {
    let storeKeeperIndex = -1;
    for (let i = lastPipeIndex + 1; i < lines.length; i++) {
      if (lines[i].includes("STORE KEEPER")) {
        storeKeeperIndex = i;
        break;
      }
    }

    // If we found a "STORE KEEPER" line, rebuild the text with replacement
    if (storeKeeperIndex !== -1) {
      // Keep all lines up to (and including) the last line with "|"
      const beforeReplacement = lines.slice(0, lastPipeIndex + 1);

      // Keep the rest of the lines from the "STORE KEEPER" line onward
      const afterReplacement = lines.slice(storeKeeperIndex);

      // Rebuild lines with the replacement text inserted in between
      lines = [...beforeReplacement, replacementBetween, ...afterReplacement];
    }
  }

  // ----- Step 2: Remove lines after the line including "STEWARD ARRIVAL" -----

  // Find the first index of a line that contains "STEWARD ARRIVAL"
  let stewardArrivalIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("STEWARD ARRIVAL")) {
      stewardArrivalIndex = i;
      break;
    }
  }

  // If found, remove all lines after this line and append the new replacement text.
  if (stewardArrivalIndex !== -1) {
    // Keep all lines up to (and including) the "STEWARD ARRIVAL" line
    const contentUpToSteward = lines.slice(0, stewardArrivalIndex + 1);
    // Append the replacement text
    lines = [...contentUpToSteward, replacementAfter];
  }

  // Join the modified lines back together into a single string
  return lines.join("\n");
}

window.addEventListener("load", function () {
  // Check if the first and second paragraphs exist in local storage
  const firstText = localStorage.getItem("firstText");
  const secondText = localStorage.getItem("secondText");

  // If they exist, set their values in the respective input fields
  if (firstText) {
    firstPrag.value = firstText;
  }
  if (secondText) {
    secondPrag.value = secondText;
  }
});

update.addEventListener("click", () => {
  const firstText = firstPrag.value;
  const secondText = secondPrag.value;

  saveTextToLocalStorage("firstText", firstText);
  saveTextToLocalStorage("secondText", secondText);
  alert("first and second pragraphs saved 👍");
});

clean.addEventListener("click", () => {
  const rawValue = txtarea.value;

  let value = rawValue.replaceAll("CH                 ", "  ");
  value = value.replaceAll("  CH               ", " ");
  value = value.replaceAll("  CH              ", " ");
  value = value.replaceAll(
    "                               ",
    "                              "
  );
  const pages = splitTextIntoPages(value);
  const removePipedLinesValue = pages.map((page) => removePipedLines(page));
  const removeEmptyLinesValue = removePipedLinesValue.map((page) =>
    removeEmptyLines(page)
  );

  pre.innerHTML = removeEmptyLinesValue
    .map((page) =>
      processText(
        page,
        `<span class="rtl">\n${firstPrag.value}\n</span>`,
        `<span class="rtl">\n${secondPrag.value}\n</span>`
      )
    )
    .join("\n");
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
