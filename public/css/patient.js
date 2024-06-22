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


//take_appointment modalllll
// Get the modal
var modal = document.getElementById("create-new-modal");

// Get the button that opens the modal
var btn = document.getElementById("create-new-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-btn")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Get the delete modal
var deleteModal = document.getElementById("delete-modal");

// Get the <span> element that closes the modal
var closeBtns = document.getElementsByClassName("close-btn");

// When the user clicks on <span> (x), close the modal
for (var i = 0; i < closeBtns.length; i++) {
    closeBtns[i].onclick = function () {
        deleteModal.style.display = "none";
    }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == deleteModal) {
        deleteModal.style.display = "none";
    }
}

// Attach click event to each reservation-div
var reservationDivs = document.getElementsByClassName("reservations-div");
for (var i = 0; i < reservationDivs.length; i++) {
    reservationDivs[i].onclick = function () {
        deleteModal.style.display = "block";
        var scanId = this.getAttribute("data-id");
        var confirmDeleteBtn = document.getElementById("confirm-delete-btn");
        confirmDeleteBtn.onclick = function () {
            // Send a request to delete the appointment
            fetch('/delete_appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ scanId: scanId })
            }).then(response => {
                if (response.ok) {
                    window.location.reload(); // Reload the page after successful deletion
                } else {
                    alert('Failed to delete the appointment');
                }
            });
        }
    }
}

// Cancel delete button
var cancelDeleteBtn = document.getElementById("cancel-delete-btn");
cancelDeleteBtn.onclick = function () {
    deleteModal.style.display = "none";
}

// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("contact-btn").addEventListener("click", openPopup2);
//     // const form = document.getElementById('updateForm');
//     // const popupContainer = document.getElementById('popupContainer3');

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('updateForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        closePopup3();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contact-btn").addEventListener("click", openPopup2);
    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener("click", closePopup2);
    const contactForm = document.getElementById("contactForm");
    contactForm.addEventListener("submit", function (event) {
        // Allow the form to be submitted normally
        closePopup2();
        setTimeout(function () {
            window.location.reload();
        }, 100); // 100ms delay
    });

});

function openPopup2() {
    document.getElementById("popupContainer2").style.display = "block";
    document.getElementById("popupContainer2").classList.add("active");
    document.body.classList.add("blur-background");
}

function closePopup2() {
    document.getElementById("popupContainer2").style.display = "none";
    document.getElementById("popupContainer2").classList.remove("active");
    document.body.classList.remove("blur-background");
    // window.location.reload();
}

function openPopup_profile() {
    document.getElementById("popupContainer3").style.display = "block";
    document.body.classList.add("blur-background");
}

function closePopup_profile() {
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

// document.getElementById('updateForm').addEventListener("submit", async (event) => {
//     event.preventDefault(); // Prevent default form submission
//     const form = document.getElementById('updateForm');
//     const formData = new FormData(form);

//     let file;
//     const fileInput = document.getElementById('picture2');
//     if (fileInput.files[0]) {
//         file = fileInput.files[0].name;
//     }

//     console.log(file);
//     const formDataObject = {};
//     formData.forEach((value, key) => {
//         formDataObject[key] = value;
//     });

//     // Convert FormData to a plain object


//     // Add Base64 string to the form data object
//     formDataObject.picture2 = file;

//     fetch('/update', {
//         method: 'POST',
//         body: JSON.stringify(formDataObject),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//         .then(response => response.text())
//         .then(data => {
//             console.log('Server response:', data); // Log server response
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// });

document.getElementById('updateForm').addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission
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

// function closePopup3() {
//     document.getElementById("popupContainer3").style.display = "none";
// }

function openPopup4() {
    document.getElementById("popupContainer4").style.display = "block";
    document.body.classList.add("blur-background");
}
function closePopup4() {
    document.getElementById("popupContainer4").style.display = "none";
    document.body.classList.remove("blur-background");
}


// for upload scans in radiologist page
function openPopup_upload_scan() {
    document.getElementById("popupContainer_upload_scan").style.display = "block";
    document.body.classList.add("blur-background");
}
function closePopup_upload_scan() {
    const input = document.getElementById('scanFolderInput');
    const errorMessage = document.getElementById('error-message');
    console.log("input: ", input);
    const files = input.files;
    let isValid = true;
    console.log("files: ", files);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
            isValid = false;
            break;
        }
    }

    if (!isValid) {
        errorMessage.textContent = 'Error: Only image files (JPEG, PNG, JPG) are allowed.';
        event.preventDefault();  // Prevent form submission
    }
    else {
        errorMessage.textContent = '';
    }

    // Hide the popup container
    document.getElementById("popupContainer_upload_scan").style.display = "none";
    // Remove the blur effect from the background
    document.body.classList.remove("blur-background");
}

//show scan in radiologist page
function openPopup_show_scan(index) {
    document.getElementById("popupContainer_show_scan_" + index).style.display = "block";
    document.body.classList.add("blur-background");
}

function closePopup_show_scan(index) {
    document.getElementById("popupContainer_show_scan_" + index).style.display = "none";
    document.body.classList.remove("blur-background");
}

function openPopup4() {
    document.getElementById("popupContainer4").style.display = "block";
    document.body.classList.add("blur-background");
}

function closePopup4() {
    document.getElementById("popupContainer4").style.display = "none";
    document.body.classList.remove("blur-background");
}


// contact form radiologist 
function openPopup_contact_form() {
    document.getElementById("popupContainer_contact_form").style.display = "block";
    document.getElementById("popupContainer_contact_form").classList.add("active");
    document.body.classList.add("blur-background");
}

function closePopup_contact_form() {
    document.getElementById("popupContainer_contact_form").style.display = "none";
    document.getElementById("popupContainer_contact_form").classList.remove("active");
    document.body.classList.remove("blur-background");
}
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevents the default form submission behavior
    const selectedReason = document.querySelector('input[name="why"]:checked').value;
    console.log('Selected reason:', selectedReason);
});