// make all task elements draggable
const draggableElements = document.querySelectorAll(".task");

draggableElements.forEach((element) => {
  element.addEventListener("dragstart", function (e) {
    // Add a dragging class to indicate the dragged element
    this.classList.toggle("dragging");
    // Remove the old task behind form the place taken
    setTimeout(() => {
      this.style.display = "none";
    }, 0);
  });

  element.addEventListener("dragend", function (e) {
    this.classList.toggle("dragging");
    // Add the task if not dropped elsewhere
    setTimeout(() => {
      this.style.display = "block";
    }, 0);
  });
});

// Listen to the drop on the other zones
const dropZones = ["starting", "ongoing", "completed"];
dropZones.forEach((element) => {
  const dropZoneElement = document.querySelector(`#${element}`);

  // handle the acutal drop
  dropZoneElement.addEventListener("drop", function (e) {
    e.preventDefault();
    this.style.backgroundColor = "";
    // Select the dragged element and add it to the new target
    const draggedElement = document.querySelector('.dragging');
    e.target.append(draggedElement)
  });

  // Prevent default to allow for drop zones
  dropZoneElement.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  // highlight the drop zone
  dropZoneElement.addEventListener("dragenter", function (e) {
    this.style.backgroundColor = "limegreen";
  });

  // remove the highlight from the drop zone
  dropZoneElement.addEventListener("dragleave", function (e) {
    this.style.backgroundColor = "";
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
