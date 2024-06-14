
// Get the modal
var modal = document.getElementById("create-new-modal");

// Get the button that opens the modal
var btn = document.getElementById("create-new-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-btn")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



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


