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
    const form = document.getElementById('updateFormDoctor');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        closePopup7();
    });
});


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contact-button9").addEventListener("click", openPopup9);
    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener("click", closePopup9);
    const contactForm = document.getElementById("contactForm");
    contactForm.addEventListener("submit", function (event) {
        closePopup9();
        setTimeout(function () {
            window.location.reload();
        }, 100); 
    });

});

function openPopup9() {
    document.getElementById("popupContainer9").style.display = "block";
    document.getElementById("popupContainer9").classList.add("active");
    document.body.classList.add("blur-background");
}


function closePopup9() {
    document.getElementById("popupContainer9").style.display = "none";
    document.getElementById("popupContainer9").classList.remove("active");
    document.body.classList.remove("blur-background");
}

function openPopup7() {
    document.getElementById("popupContainer7").style.display = "block";
    document.body.classList.add("blur-background");
}

function closePopup7() {
    document.getElementById("popupContainer7").style.display = "none";
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
    const showLoginLinks = document.querySelectorAll(".write-report");
    const closeBtn = document.querySelector(".close-btn8");
    showLoginLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault(); 
            const scanId = parseInt(this.getAttribute('data-scan-id'));
            const drId = parseInt(this.getAttribute('data-dr-id'));
            const picIndex = parseInt(this.getAttribute('data-pic-index'));
            console.log(scanId)
            console.log(drId)
            console.log(picIndex)
            openPopup8(scanId, drId, picIndex);
        });
    });
    closeBtn.addEventListener("click", closePopup8);

    function openPopup8(scanId, drId, picIndex) {
        document.getElementById("popupContainer8").style.display = "block";
        document.getElementById("popupContainer8").classList.add("active");
        document.getElementById('scanId').value = scanId;
        document.getElementById('drId').value = drId;
        document.getElementById('picIndex').value = picIndex;
        document.body.classList.add("blur-background");
    }

    function closePopup8() {
        document.getElementById("popupContainer8").style.display = "none";
        document.getElementById("popupContainer8").classList.remove("active");
        document.body.classList.remove("blur-background");
    }
});

document.getElementById('updateFormDoctor').addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = document.getElementById('updateFormDoctor');
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

    fetch('/updateFormDoctor', {
        method: 'POST',
        body: JSON.stringify(formDataObject),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        .then(data => {
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function closePopup7() {
    document.getElementById("popupContainer7").style.display = "none";
}

