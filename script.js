/* Listen to dragstat and dragends on body and if they are
  divs with .task then change their css properties */

document.body.addEventListener("dragstart", function (e) {
  // Add a dragging class to indicate the dragged element
  if (e.target.classList.value == "task") {
    e.target.classList.toggle("dragging");
    setTimeout(() => {
      e.target.style.display = "none";
    }, 0);
  }
  // Remove the old task behind form the place taken
});

document.body.addEventListener("dragend", function (e) {
  if (e.target.classList.contains("task")) {
    e.target.classList.toggle("dragging");
    // Add the task if not dropped elsewhere
    setTimeout(() => {
      e.target.style.display = "block";
    }, 0);
  }
});

// Listen to the drop on the other zones
const dropZones = ["starting", "ongoing", "completed"];
dropZones.forEach((element) => {
  const dropZoneElement = document.querySelector(`#${element}`);

  // handle the acutal drop
  dropZoneElement.addEventListener("drop", function (e) {
    e.preventDefault();
    this.style.backgroundColor = "";
    if (
      e.target.id === "tasks" ||
      e.target.id === "ongoing" ||
      e.target.id === "starting"
    ) {
      // Select the dragged element and add it to the new target
      const draggedElement = document.querySelector(".dragging");
      // Check if its the completed tab and append to #tasks or else append normally
      if (this.firstElementChild.id === "tasks") {
        this.firstElementChild.append(draggedElement);
        return;
      }
      this.append(draggedElement);
    }
  });

  // Prevent default to allow for drop zones
  dropZoneElement.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  // highlight the drop zone
  dropZoneElement.addEventListener("dragenter", function (e) {
    this.style.backgroundColor = "#b6e8a7";
  });

  // remove the highlight from the drop zone
  dropZoneElement.addEventListener("dragleave", function (e) {
    this.style.backgroundColor = "";
  });
});

// DELETE FUNCTIONS
const deleteBin = document.querySelector("#delete-bin");
deleteBin.addEventListener("dragover", function (e) {
  e.preventDefault();
  if (e.target.id === "delete-bin") {
    // console.log('YES')
    const draggedElement = document.querySelector(".dragging");
    if (draggedElement != null) {
      draggedElement.parentElement.removeChild(draggedElement);
    }
  }
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
