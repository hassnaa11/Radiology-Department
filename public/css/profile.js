
<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function() {
    try {
        const radiologistsData = document.getElementById('radiologistsData').value;
        console.log("Raw JSON data:", radiologistsData); // Log the raw JSON data
        const radiologists = JSON.parse(radiologistsData);
        console.log("Parsed doctors data:", radiologists); // Log the parsed doctors data
    } catch (error) {
        console.error("Error parsing JSON data:", error);
    }

    window.openPopup = function(id) {
        console.log("openPopup called with id:", id); // Log when function is called
        const radiologists= JSON.parse(document.getElementById('radiologistsData').value);
        console.log("Parsed doctors data:", radiologists); // Log parsed doctors data
        
        console.log("Looking for doctor with id:", id); // Log the id being looked for
        console.log("Found doctor:", radiologists); // Log found doctor
        for (let x = 0; x < radiologists.length; x++) {
        if (id == radiologists[x].radiologist_id) {
        
    
            document.getElementById('fullname').value  = radiologists[x].fname + ' ' +radiologists[x].lname;
            document.getElementById('email').value  = radiologists[x].email;
            document.getElementById('address').value  = radiologists[x].address;
            document.getElementById('age').value  = radiologists[x].age;
            document.getElementById('sex').value  = radiologists[x].sex;
            document.getElementById('address').value  = radiologists[x].address;
            document.getElementById('salary').value  = radiologists[x].salary;
            document.getElementById('phone_no').value  = radiologists[x].phone_no;
            document.getElementById('start_shift').value  =radiologists[x].start_shift;
            document.getElementById('end_shift').value  = radiologists[x].end_shift;
            document.getElementById('radiologist_id').value  = id;

            if (event.target.tagName === 'BUTTON') return;
            document.getElementById('popupContainer').style.display = 'block';

            console.log("Popup displayed"); // Log popup display
        
            console.log("Doctor not found with id:", id); // Log if doctor not found
        }
    }}
});

=======
function openPopup() {
    // Show the popup container
    document.getElementById("popupContainer").style.display = "block";
    // Apply the blur effect to the background
    document.body.classList.add("blur-background");
}
>>>>>>> 592a56954b4c5e91d49425f5386dc90596e725bc

function closePopup() {
    // Hide the popup container
    document.getElementById("popupContainer").style.display = "none";
    // Remove the blur effect from the background
    document.body.classList.remove("blur-background");
}


<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function() {
    // Open a new window with specified URL, width, height, and other options for the first button
    document.getElementById("ADD").addEventListener("click", function() {
        console.log("ADD clicked");
        var width = 500;
        var height = 670;
        var left = (screen.width - width) / 2;
        var top = (screen.height - height) / 2;
        window.open("add_radiologist", "Pop-up Window", `width=${width},height=${height},top=${top},left=${left}`);
    });

    // Open the scans popup for all buttons with class scans-btn
    document.querySelectorAll(".scans-btn").forEach(function(button) {
        button.addEventListener("click", function() {
            document.getElementById("scanspopup").style.display = "block";
            // Apply the blur effect to the background
            document.body.classList.add("blur-background");
        });
    });

    // Close the scans popup
    document.getElementById("close-scans").addEventListener("click", function() {
        document.getElementById("scanspopup").style.display = "none";
        // Remove the blur effect from the background
        document.body.classList.remove("blur-background");
=======
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
>>>>>>> 592a56954b4c5e91d49425f5386dc90596e725bc
    });
});



<<<<<<< HEAD

document.getElementById('radiologistForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this);

    fetch('/update', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok');
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
/**function fetchScans(radiologistId) {
    fetch(`/scans/${radiologistId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch scans');
            }
            return response.json();
        })
        .then(scans => {
            console.log("Scans for radiologist:", scans);

            // Clear previous scan blocks
            const scansContainer = document.querySelector('.scans-section-scrollbar');
            scansContainer.innerHTML = '';

            // Create new scan blocks for each scan
            scans.forEach(scan => {
                const scanBlock = document.createElement('div');
                scanBlock.classList.add('scan-block');
                scanBlock.innerHTML = `
                    <div>
                        <h3 class="scan-code">Scan #${scan.scan_id}</h3>
                        <p>Patient ID: ${scan.patient_id}</p>
                        <p>Scan Folder: ${scan.scan_folder}</p>
                        <p>Scan Pics: ${scan.scan_pics.join(', ')}</p>
                        <p>Doctor ID: ${scan.dr_id}</p>
                    </div>
                `;
                scansContainer.appendChild(scanBlock);
            });

            // Display the scans popup
            document.getElementById('scanspopup').style.display = 'block';
            console.log("Scans popup displayed for radiologist id:", radiologistId);
        })
        .catch(error => {
            console.error("Error fetching scans:", error);
        });
}**/
=======
>>>>>>> 592a56954b4c5e91d49425f5386dc90596e725bc
