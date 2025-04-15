window.setTimeout(() => {
  if (localStorage.getItem("makesafe") !== "true") {
    console.log("welcome");
    window.location.href = "https://www.google.com/";
  }
}, 2000);
