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
      console.log(
        `${draggedElement.outerText.trim()} is dragged to ${this.id}`
      );
      udpateLocalStorage(draggedElement.outerText.trim(), this.id, "moved");
      // Check if its the completed tab and append to #tasks or else append normally
      if (this.firstElementChild.id === "tasks") {
        this.firstElementChild.append(draggedElement);
        return;
      }
      this.append(draggedElement);
    }
    /* DELETE TASKS */
    if (e.target.id === "delete-bin") {
      // console.log('YES')
      const draggedElement = document.querySelector(".dragging");
      console.log(`${draggedElement.outerText.trim()} is going to be trashed`);
      udpateLocalStorage(draggedElement.outerText.trim(), undefined, "removed");
      if (draggedElement != null) {
        draggedElement.parentElement.removeChild(draggedElement);
      }
    }
  });

  // Prevent default to allow for drop zones
  dropZoneElement.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.style.backgroundColor = "#b6e8a7";
  });

  // remove the highlight from the drop zone
  dropZoneElement.addEventListener("dragleave", function (e) {
    this.style.backgroundColor = "";
  });
});

// Handle submits for input
const input = document.querySelector("input");
// input focus clears value set
input.addEventListener("click", function () {
  this.value = "";
});

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
  storeTaskInitially(taskInput);
  input.value = "";
  // create a new element and add to this starting tab
  const div = createTask(taskInput);
  document.querySelector("#starting").append(div);
});

function createTask(taskInput) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");
  div.innerHTML = taskInput;
  return div;
}

// Get selectors for different tabs. --> Can do better for cleanups
const starting = document.querySelector("#starting");
const ongoing = document.querySelector("#ongoing");
const tasks = document.querySelector("#tasks");

// INIT APP GET FROM LOCAL AND UPDATE TASKS
document.addEventListener("DOMContentLoaded", function (e) {
  const todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ID)) || [];
  todos.forEach((todo) => {
    const div = createTask(todo.task);
    switch (todo.tab) {
      case "starting":
        starting.append(div);
        break;
      case "ongoing":
        ongoing.append(div);
        break;
      case "completed":
        tasks.append(div);
        break;
    }
  });
});

// LOCAL STORAGE STUFF
const LOCAL_STORAGE_ID = "[NEW_TAB_TODOS] todos";

function getFromStorage() {
  const todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ID)) || [];
  return todos;
}

function storeToStorage(todosArr) {
  localStorage.setItem(LOCAL_STORAGE_ID, JSON.stringify(todosArr));
}

function storeTaskInitially(task) {
  const todos = getFromStorage();
  todos.push({ task, tab: "starting" });
  storeToStorage(todos);
}

function udpateLocalStorage(task, tab, mode) {
  // Handle when tasks are moved
  if (mode === "moved") {
    const todos = getFromStorage();
    const index = todos.findIndex((ele) => ele.task === task);
    // if index == -1 handle if such a task not there in LS.
    todos[index] = {
      task,
      tab,
    };
    storeToStorage(todos);
  }
  // Tasks are removed
  else if (mode === "removed") {
    const todos = getFromStorage();
    const index = todos.findIndex((ele) => ele.task === task);
    // Handle -1 if not there. can be ignored too
    todos.splice(index, 1);
    storeToStorage(todos);
  }
}
