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
    // addTaskButton.addEventListener("click", () => {
    //     addTaskModal.style.display = "block";
    // });

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
    document.getElementById("contact-btn").addEventListener("click", openPopup2);
    // document.getElementById("close-btn").addEventListener("click", closePopup2);

    function openPopup2() {
        document.getElementById("popupContainer2").style.display = "block";
        document.getElementById("popupContainer2").classList.add("active");
        document.body.classList.add("blur-background");
    }
    // function closePopup2() {
    //     document.getElementById("popupContainer2").style.display = "none";
    //     document.getElementById("popupContainer2").classList.remove("active");
    //     document.body.classList.remove("blur-background");

    // }
});

function closePopup2() {
    document.getElementById("popupContainer2").style.display = "none";
    document.getElementById("popupContainer2").classList.remove("active");
    document.body.classList.remove("blur-background");

}

function openPopup3() {
    // Show the popup container
    document.getElementById("popupContainer3").style.display = "block";
    // Apply the blur effect to the background
    document.body.classList.add("blur-background");
}

function closePopup3() {
    // Hide the popup container
    document.getElementById("popupContainer3").style.display = "none";
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
    console.log(newText)
    // const span = document.createElement('span');
    // span.className = 'editable-text';
    // span.onclick = function () {
    //     editText(this);
    // };
    // span.innerText = newText;
    // inputElement.replaceWith(span);
}





document.addEventListener("DOMContentLoaded", function () {
    const showLoginLinks = document.querySelectorAll(".show-login");
    const closeBtn = document.querySelector(".close-btn");

    showLoginLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior
            const scanId = parseInt(this.getAttribute('data-scan-id'));
            const drId = parseInt(this.getAttribute('data-dr-id'));
            const picIndex = parseInt(this.getAttribute('data-pic-index'));
            console.log(scanId)
            console.log(drId)
            console.log(picIndex)


            openPopup(scanId, drId, picIndex);
        });
    });

    closeBtn.addEventListener("click", closePopup);

    function openPopup(scanId, drId, picIndex) {
        document.getElementById("popupContainer").style.display = "block";
        document.getElementById("popupContainer").classList.add("active");
        document.getElementById('scanId').value = scanId;
        document.getElementById('drId').value = drId;
        document.getElementById('picIndex').value = picIndex;
        document.body.classList.add("blur-background");
    }

    function closePopup() {
        document.getElementById("popupContainer").style.display = "none";
        document.getElementById("popupContainer").classList.remove("active");
        document.body.classList.remove("blur-background");
    }
});

// document.getElementById('update').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent the form from submitting the traditional way

//     var formData = new FormData(this);
//     formData.forEach((value, key) => {
//         console.log(key + ': ' + value);
//     });

// You can also convert FormData to an object if you prefer
// const formObject = Object.fromEntries(formData.entries());});
document.getElementById('updateForm').addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    //     const form = document.getElementById('updateForm');
    //     const formData = new FormData(form);

    //     formData.forEach((value, key) => {
    //         console.log(key + ': ' + value);
    //     });
    //     const formDataObject = {};
    //  formData.forEach((value, key) => {
    //     formDataObject[key] = value;
    // });
    //     console.log(formDataObject)
    const form = document.getElementById('updateForm');
    const formData = new FormData(form);

    let file;
    const fileInput = document.getElementById('picture2');
    if(fileInput.files[0]){
        file = fileInput.files[0].name;
    }
    
    console.log(file);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    // Convert FormData to a plain object


    // Add Base64 string to the form data object
    formDataObject.picture2 = file;

    fetch('/update', {
        method: 'POST',
        body: JSON.stringify(formDataObject),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        .then(data => {
            console.log('Server response:', data); // Log server response
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// document.getElementById('update').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent the form from submitting the traditional way

//     var formData = new FormData(this);
//     formData.forEach((value, key) => {
//         console.log(key + ': ' + value);
//     });

// You can also convert FormData to an object if you prefer
// const formObject = Object.fromEntries(formData.entries());});
document.getElementById('updateForm').addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    //     const form = document.getElementById('updateForm');
    //     const formData = new FormData(form);

    //     formData.forEach((value, key) => {
    //         console.log(key + ': ' + value);
    //     });
    //     const formDataObject = {};
    //  formData.forEach((value, key) => {
    //     formDataObject[key] = value;
    // });
    //     console.log(formDataObject)
    const form = document.getElementById('updateForm');
    const formData = new FormData(form);

    const fileInput = document.getElementById('picture2');
    let file;
    if (fileInput.files[0]) {
        file = fileInput.files[0].name;
    }
    console.log(file);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    // Convert FormData to a plain object


    // Add Base64 string to the form data object
    formDataObject.picture2 = file;

    fetch('/update', {
        method: 'POST',
        body: JSON.stringify(formDataObject),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        .then(data => {
            console.log('Server response:', data); // Log server response
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function closePopup3() {
    document.getElementById("popupContainer3").style.display = "none";
}



// for send to in radiologist page
// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("send-to-btn").addEventListener("click", openPopup4);
//     function openPopup4() {
//         document.getElementById("popupContainer4").style.display = "block";
//         document.getElementById("popupContainer4").classList.add("active");
//         document.body.classList.add("blur-background");
//     }
// });

// function closePopup4() {
//     document.getElementById("popupContainer4").style.display = "none";
//     document.getElementById("popupContainer4").classList.remove("active");
//     document.body.classList.remove("blur-background");
// }

// document.addEventListener("DOMContentLoaded", function () {
//     // Attach event listener to all send buttons
//     const sendButtons = document.querySelectorAll(".send-to-btn");

//     sendButtons.forEach(button => {
//         button.addEventListener("click", function () {
//             const index = this.id.split('-')[3];
//             openPopup4(index);
//         });
//     });

//     // Open popup function
//     function openPopup4(index) {
//         const popup = document.getElementById(`popupContainer4-${index}`);
//         if (popup) {
//             popup.style.display = "block";
//             popup.classList.add("active");
//             document.body.classList.add("blur-background");
//         } else {
//             console.error(`Popup with ID popupContainer4-${index} not found`);
//         }
//     }

//     // Close popup function exposed to global scope
//     window.closePopup4 = function (index) {
//         const popup = document.getElementById(`popupContainer4-${index}`);
//         if (popup) {
//             popup.style.display = "none";
//             popup.classList.remove("active");
//             document.body.classList.remove("blur-background");
//         } else {
//             console.error(`Popup with ID popupContainer4-${index} not found`);
//         }
//     }
// });

function openPopup4() {
    // Show the popup container
    document.getElementById("popupContainer4").style.display = "block";
    // Apply the blur effect to the background
    document.body.classList.add("blur-background");
}

function closePopup4() {
    // Hide the popup container
    document.getElementById("popupContainer4").style.display = "none";
    // Remove the blur effect from the background
    document.body.classList.remove("blur-background");
}


