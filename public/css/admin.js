document.addEventListener("DOMContentLoaded", function() {
    try {
        const radiologistsData = document.getElementById('radiologistsData').value;
        console.log("Raw JSON data:", radiologistsData); // Log the raw JSON data
        const radiologists = JSON.parse(radiologistsData);
        console.log("Parsed radiologist data:", radiologists); // Log the parsed doctors data
    } catch (error) {
        console.error("Error parsing JSON data:", error);
    }

    window.openPopup = function(id) {
        console.log("openPopup called with id:", id); // Log when function is called
        const radiologists= JSON.parse(document.getElementById('radiologistsData').value);
        console.log("Parsed radiologists data:", radiologists); // Log parsed doctors data
        
        console.log("Looking for radiologist with id:", id); // Log the id being looked for
        console.log("Found radiologist:", radiologists); // Log found doctor
        for (let x = 0; x < radiologists.length; x++) {
        if (id == radiologists[x].radiologist_id) {
            document.getElementById('fullname').value  = `Dr. ${radiologists[x].fname} ${radiologists[x].lname}`
            document.getElementById('email').value  = radiologists[x].email;
            document.getElementById('address').value  = radiologists[x].address;
            document.getElementById('age').value  = radiologists[x].age;
            document.getElementById('sex').value  = radiologists[x].sex;
            document.getElementById('salary').value  = radiologists[x].salary;
            document.getElementById('phone_no').value  = radiologists[x].phone_no;
            document.getElementById('start_shift').value  =radiologists[x].start_shift;
            document.getElementById('end_shift').value  = radiologists[x].end_shift;
            document.getElementById('password').value  = radiologists[x].end_shift;
            document.getElementById('picture2').src = radiologists[x].picture;
            document.getElementById('radiologist_id').value  = id;
            if (event.target.tagName === 'BUTTON') return;
            document.getElementById('popupContainer').style.display = 'block';
            console.log("Popup displayed"); // Log popup display
        
            console.log("Radiologist not found with id:", id); // Log if doctor not found
        }
    }}
    window.openScansPopup = function(radiologistId) {
        window.open(`/scans.html?radiologist_id=${radiologistId}`, '_blank');
    }
});


function closePopup() {
    // Hide the popup container
    document.getElementById("popupContainer").style.display = "none";
    // Remove the blur effect from the background
    document.body.classList.remove("blur-background");
}


document.addEventListener("DOMContentLoaded", function() {
    // Open a new window with specified URL, width, height, and other options for the first button
    document.getElementById("ADD").addEventListener("click", function() {
        console.log("ADD clicked");
        var width = 500;
        var height = 670;
        var left = (screen.width - width) / 2;
        var top = (screen.height - height) / 2;
        window.open("add_radiologist", "Pop-up Window",  `width=${width},height=${height},top=${top},left=${left}`);
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
    });
});

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





function toggleScans(radiologistId) {
    const scansContainers = document.querySelectorAll('.scans-container');
    scansContainers.forEach(container => {
        if (container.id === 'scans_' + radiologistId) {
            container.style.display = container.style.display === 'block' ? 'none' : 'block';
        } else {
            container.style.display = 'none';
        }
    });
}
