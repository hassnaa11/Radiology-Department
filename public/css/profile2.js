
document.addEventListener("DOMContentLoaded", function() {
    try {
        const doctorsData = document.getElementById('doctorsData').textContent;
        console.log("Raw JSON data:", doctorsData); // Log the raw JSON data
        const doctors = JSON.parse(doctorsData);
        console.log("Parsed doctors data:", doctors); // Log the parsed doctors data
    } catch (error) {
        console.error("Error parsing JSON data:", error);
    }

    window.openPopup = function(id) {
        console.log("openPopup called with id:", id); // Log when function is called
        const doctors = JSON.parse(document.getElementById('doctorsData').textContent);
        console.log("Parsed doctors data:", doctors); // Log parsed doctors data
        console.log("Looking for doctor with id:", id); // Log the id being looked for
        for (let x = 0; x < doctors.length; x++) {
            if (id == doctors[x].doctor_id) {
                document.getElementById('Name').value = `Dr. ${doctors[x].fname} ${doctors[x].lname}`;
                document.getElementById('email').value = doctors[x].email;
                document.getElementById('address').value = doctors[x].address;
                document.getElementById('salary').value = doctors[x].salary;
                document.getElementById('age').value = doctors[x].age;
                document.getElementById('sex').value = doctors[x].sex;
                document.getElementById('password').value = doctors[x].password;
                document.getElementById('phone_no').value = doctors[x].phone_no;
                document.getElementById('start_shift').value = doctors[x].start_shift;
                document.getElementById('end_shift').value = doctors[x].end_shift;
                document.getElementById('popupContainer').style.display = 'block';
                console.log("Popup displayed"); // Log popup display
            } else {
                console.log("Doctor not found with id:", id); // Log if doctor not found
            }
        }
    }});


function closePopup() {
    document.getElementById('popupContainer').style.display = 'none';
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