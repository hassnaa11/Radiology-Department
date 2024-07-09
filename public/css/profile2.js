document.addEventListener("DOMContentLoaded", function () {
    // Open a new window with specified URL, width, height, and other options for the first button
    document.getElementById("ADD_btn").addEventListener("click", function () {
        console.log("ADD clicked");
        var width = 530;
        var height = 820;
        var left = (screen.width - width) / 2;
        var top = (screen.height - height) / 2;
        window.open("add_doctor", "Pop-up Window", `width=${width},height=${height},top=${top},left=${left}`);
    });
});
document.addEventListener("DOMContentLoaded", function () {
    try {
        const doctorsData = document.getElementById('doctorsData').value;
        console.log("Raw JSON data:", doctorsData); // Log the raw JSON data
        const doctors = JSON.parse(doctorsData);
        console.log("Parsed doctors data:", doctors); // Log the parsed doctors data
    } catch (error) {
        console.error("Error parsing JSON data:", error);
    }

    window.openPopup = function (id) {
        console.log("openPopup called with id:", id); // Log when function is called
        const doctors = JSON.parse(document.getElementById('doctorsData').value);
        console.log("Parsed doctors data:", doctors); // Log parsed doctors data

        console.log("Looking for doctor with id:", id); // Log the id being looked for
        console.log("Found doctor:", doctors); // Log found doctor
        for (let x = 0; x < doctors.length; x++) {
            if (id == doctors[x].doctor_id) {


                document.getElementById('fullname').value = doctors[x].fname + ' ' + doctors[x].lname;
                document.getElementById('email').value = doctors[x].email;
                document.getElementById('address').value = doctors[x].address;
                document.getElementById('age').value = doctors[x].age;
                document.getElementById('sex').value = doctors[x].sex;
                document.getElementById('salary').value = doctors[x].salary;
                document.getElementById('phone_no').value = doctors[x].phone_no;
                document.getElementById('start_shift').value = doctors[x].start_time;
                document.getElementById('end_shift').value = doctors[x].end_time;
                document.getElementById('ass_name').value = doctors[x].ass_name;
                document.getElementById('special').value = doctors[x].special;
                document.getElementById('picture2').src = doctors[x].picture;
                document.getElementById('dr_room').value = doctors[x].dr_room;
                document.getElementById('doctor_id').value = id;

                document.getElementById('popupContainer').style.display = 'block';

                console.log("Popup displayed"); // Log popup display

                console.log("Doctor not found with id:", id); // Log if doctor not found
            }
        }
    }

});
function openScanss() {
    // Retrieve the doctor_id from the hidden input field in the form
    const doctor_id = document.getElementById('doctor_id').value.trim();

    // Retrieve doctors data from the hidden textarea
    try {
        const doctorsData = document.getElementById('doctorsData').value;
        console.log("Raw JSON data:", doctorsData); // Log the raw JSON data

        const doctors = JSON.parse(doctorsData);
        console.log("Parsed doctors data:", doctors); // Log the parsed doctors data

        // Iterate over doctors array
        for (let x = 0; x < doctors.length; x++) {
            if (doctor_id == doctors[x].doctor_id) {
                console.log("Doctor ID matched:", doctor_id);
                const scanBlockContainer = document.querySelector('.scans-section-scrollbar');
                scanBlockContainer.innerHTML = '';

                if (doctors[x].scans.length > 0) {
                    for (let z = 0; z < doctors[x].scans.length; z++) {
                        // Create a new <div> element for each scan
                        var outerDiv = document.createElement('div');
                        outerDiv.className = 'scan-block';
                        outerDiv.id = 'scan-block-' + doctors[x].scans[z].scan_id;

                        // Create the inner div
                        var innerDiv = document.createElement('div');

                        // Create the h3 element with class "scan-code" and specific text content
                        var h3Element = document.createElement('h3');
                        h3Element.className = 'scan-code';
                        const scanId = doctors[x].scans[z].scan_id;
                        h3Element.textContent = 'Scan ' + scanId;

                        // Append the h3 element to the inner div
                        innerDiv.appendChild(h3Element);

                        // Append the inner div to the outer div
                        outerDiv.appendChild(innerDiv);

                        // Append the outer div to the document body or any other existing element

                        scanBlockContainer.appendChild(outerDiv);
                        outerDiv.onclick = function () {
                            // Store the scan ID in localStorage
                            localStorage.setItem('scan_id', doctors[x].scans[z].scan_id);
                            console.log(doctors[x].scans[z].scan_id);

                            // Open the report in a new tab
                            window.open('/reports_dr_admin', "_blank");
                        };

                        // Store the scan ID in localStorage if needed
                        localStorage.setItem('scan_id', scanId);
                    }
                } else {
                    // Handle case where there are no scans for the doctor
                    var outerDiv = document.createElement('div');
                    outerDiv.className = 'scan-block';

                    // Create the inner div
                    var innerDiv = document.createElement('div');

                    // Create the h3 element with class "scan-code" and specific text content
                    var h3Element = document.createElement('h3');
                    h3Element.className = 'scan-code';


                    h3Element.textContent = 'no scans';

                    // Append the h3 element to the inner div
                    innerDiv.appendChild(h3Element);

                    // Append the inner div to the outer div
                    outerDiv.appendChild(innerDiv);

                    // Append the outer div to the document body or any other existing element

                    scanBlockContainer.appendChild(outerDiv);

                    // Store the scan ID in localStorage if needed

                }
            }
        }

        // Display the scans popup
        document.getElementById('popupContainer').style.display = 'none';
        document.getElementById('scanspopup').style.display = 'block';
        document.body.classList.add('blur-background');

    } catch (error) {
        console.error("Error parsing JSON data or handling scans:", error);
        // Handle the error, e.g., show a message or log additional details
    }
}

// Add event listener to close scans popup
document.getElementById('close-scans').addEventListener('click', function () {
    document.getElementById('scanspopup').style.display = 'none';
});


function closePopup() {
    document.getElementById('popupContainer').style.display = 'none';
}

document.getElementById('doctorForm').addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission
    const form = document.getElementById('doctorForm');
    const formData = new FormData(form);

    const fileInput = document.getElementById('picture');
    let file;
    if (fileInput.files[0]) {
        file = fileInput.files[0].name;
    }
    console.log(file);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    formDataObject.picture = file;

    fetch('/edit_doctor', {
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

// Assuming you are generating 'scan-block' elements dynamically with unique IDs like 'scan-block-1', 'scan-block-2', etc.

