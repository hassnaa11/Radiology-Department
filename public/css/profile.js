
function openPopup() {
    // Show the popup container
    document.getElementById("popupContainer").style.display = "block";
    // Apply the blur effect to the background
    document.body.classList.add("blur-background");
}

function closePopup() {
    // Hide the popup container
    document.getElementById("popupContainer").style.display = "none";
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

/**document.getElementById("ADD_btn").addEventListener("click", function() {
    // Open a new window with specified URL, width, height, and other options
    var popupWindow = window.open("edit.html", "Pop-up Window", "width=530,height=800",'CenteredWindow');
});**/
document.addEventListener("DOMContentLoaded", function () {
    // Event listener for the first button
    document.getElementById("ADD_btn").addEventListener("click", function () {
        console.log("ADD_btn clicked");
        var width = 530;
        var height = 800;
        var left = (screen.width - width) / 2;
        var top = (screen.height - height) / 2;
        window.open("/add_doctor", "Pop-up Window", `width=${width},height=${height},top=${top},left=${left}`);
    });

    // Event listener for the second button
});
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ADD").addEventListener("click", function () {
        console.log("ADD clicked");
        var width = 500;
        var height = 650;
        var left = (screen.width - width) / 2;
        var top = (screen.height - height) / 2;
        window.open("/add_radiologist", "Pop-up Window", `width=${width},height=${height},top=${top},left=${left}`);
    });
});



