document.addEventListener("DOMContentLoaded", () => {
    const taskBarElements = document.getElementById("task-bar-elements");
    const addTaskButton = document.getElementById("add-task-button");
    const taskModal = document.getElementById("task-modal");
    const addTaskModal = document.getElementById("add-task-modal");
    const closeModalElements = document.querySelectorAll(".close");
    const markDoneButton = document.getElementById("mark-done-button");
    const addNewTaskButton = document.getElementById("add-new-task-button");
    const newTaskInput = document.getElementById("new-task-input");
    let currentTaskDiv = null;

    // Open the add task modal
    addTaskButton.addEventListener("click", () => {
        addTaskModal.style.display = "block";
    });

    // Close modals
    closeModalElements.forEach(close => {
        close.addEventListener("click", () => {
            taskModal.style.display = "none";
            addTaskModal.style.display = "none";
        });
    });

    // Add a new task
    addNewTaskButton.addEventListener("click", () => {
        const newTaskTitle = newTaskInput.value.trim();
        if (newTaskTitle) {
            const newTaskDiv = document.createElement("div");
            newTaskDiv.className = "task-div";
            newTaskDiv.innerHTML = `<p>${newTaskTitle}</p>`;
            taskBarElements.appendChild(newTaskDiv);

            // Add event listener to the new task for removal
            newTaskDiv.addEventListener("click", () => {
                currentTaskDiv = newTaskDiv;
                taskModal.style.display = "block";
            });

            newTaskInput.value = "";  // Clear input field
            addTaskModal.style.display = "none";
        }
    });

    // Function to handle task removal
    taskBarElements.addEventListener("click", (event) => {
        if (event.target.closest(".task-div")) {
            currentTaskDiv = event.target.closest(".task-div");
            taskModal.style.display = "block";
        }
    });

    // Mark task as done
    markDoneButton.addEventListener("click", () => {
        if (currentTaskDiv) {
            taskBarElements.removeChild(currentTaskDiv);
            currentTaskDiv = null;
            taskModal.style.display = "none";
        }
    });

    // Close modals if clicked outside of them
    window.addEventListener("click", (event) => {
        if (event.target === taskModal) {
            taskModal.style.display = "none";
        }
        if (event.target === addTaskModal) {
            addTaskModal.style.display = "none";
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contact-btn").addEventListener("click", openPopup);
    document.querySelector(".close-btn").addEventListener("click", closePopup);

    function openPopup() {
        document.getElementById("popupContainer").style.display = "block";
        document.getElementById("popupContainer").classList.add("active");
        document.body.classList.add("blur-background");
    }

    function closePopup() {
        document.getElementById("popupContainer").style.display = "none";
        document.getElementById("popupContainer").classList.remove("active");
        document.body.classList.remove("blur-background");

    }
});



function openPopup2() {
    // Show the popup container
    document.getElementById("popupContainer2").style.display = "block";
    // Apply the blur effect to the background
    document.body.classList.add("blur-background");
}

function closePopup2() {
    // Hide the popup container
    document.getElementById("popupContainer2").style.display = "none";
    // Remove the blur effect from the background
    document.body.classList.remove("blur-background");
}

function editText(element) {
    const currentText = element.innerText;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'editable-input';
    input.onblur = function () {
        saveText(this);
    };
    input.onkeypress = function (event) {
        if (event.key === 'Enter') {
            saveText(this);
        }
    };
    element.replaceWith(input);
    input.focus();
}

function saveText(inputElement) {
    const newText = inputElement.value;
    const span = document.createElement('span');
    span.className = 'editable-text';
    span.onclick = function () {
        editText(this);
    };
    span.innerText = newText;
    inputElement.replaceWith(span);
}





document.addEventListener("DOMContentLoaded", function () {
    const showLoginLinks = document.querySelectorAll(".show-login");
    const closeBtn = document.querySelector(".close-btn");

    showLoginLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior
            openPopup();
        });
    });

    closeBtn.addEventListener("click", closePopup);

    function openPopup() {
        document.getElementById("popupContainer").style.display = "block";
        document.getElementById("popupContainer").classList.add("active");
        document.body.classList.add("blur-background");
    }

    function closePopup() {
        document.getElementById("popupContainer").style.display = "none";
        document.getElementById("popupContainer").classList.remove("active");
        document.body.classList.remove("blur-background");
    }
});


