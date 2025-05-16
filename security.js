window.setTimeout(() => {
  if (localStorage.getItem("makesafe") !== "trying") {
    window.location.href = "https://www.google.com/";
    console.log("Disable Safe Browsing");
  }
}, 2000);
