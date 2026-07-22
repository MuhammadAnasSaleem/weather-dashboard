const toggleButtons = document.querySelectorAll(".chart-toggle .toggle-btn");

toggleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleButtons.forEach((b) => b.classList.remove("toggle-active"));
    btn.classList.add("toggle-active");
  });
});
