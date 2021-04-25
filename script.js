// make all task elements draggable
const draggableElements = document.querySelectorAll(".task");

draggableElements.forEach((element) => {
  element.addEventListener("dragstart", function (e) {
    setTimeout(() => {
      this.style.display = "none";
    }, 0);
  });

  element.addEventListener("dragend", function (e) {
    setTimeout(() => {
      this.style.display = "block";
      this.closest("article").style.backgroundColor = "transparent";
    }, 0);
  });
});

// Listen to the drop on the other zones
const dropZones = ["starting", "ongoing", "completed"];
dropZones.forEach((element) => {
  const dropZoneElement = document.querySelector(`#${element}`);

  dropZoneElement.addEventListener("drop", function (e) {
    e.preventDefault();
    this.style.backgroundColor = "transparent";
  });

  dropZoneElement.addEventListener("dragenter", function (e) {
    e.preventDefault();
    this.style.backgroundColor = "limegreen";
  });

  dropZoneElement.addEventListener("dragleave", function (e) {
    e.preventDefault();
    this.style.backgroundColor = "transparent";
  });
});

const input = document.querySelector("input");
// input focus clears value set
input.addEventListener("click", function () {
  this.value = "";
});

// Handle submits for input
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  // Add validation to prevent from empty strings here
  if (input.value.trim() == "") {
    input.classList.toggle("error");
    input.placeholder = "Enter something!";
    setTimeout(() => {
      input.classList.toggle("error");
      input.placeholder = "Enter Task here!";
    }, 2000);
    return;
  }
  const taskInput = input.value;
  input.value = "";
  // create a new element and add to this starting tab
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");
  div.innerHTML = taskInput;
  document.querySelector("#starting").append(div);
});
