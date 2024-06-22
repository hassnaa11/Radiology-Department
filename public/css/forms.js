document.addEventListener("DOMContentLoaded", function () {
    const closeButton = document.querySelector(".rclose-btn");
    if (closeButton) {
        closeButton.addEventListener("click", closePopup);
    }

    window.openPopup = function (id, email) {
        console.log("openPopup called with id:", id); // Log when function is called
        const forms = JSON.parse(document.getElementById('formsData').value);
        console.log("Parsed forms data:", forms); // Log parsed forms data

        for (let x = 0; x < forms.length; x++) {
            if (id == forms[x].form_id) {
                document.getElementById('remail').value = forms[x].user_email;
                document.getElementById('formId').value = forms[x].form_id;
                console.log("Popup displayed"); // Log popup display

                document.getElementById("replypopup").style.display = "block";
                document.getElementById("replypopup").classList.add("active");
                document.body.classList.add("blur-background");
                return;
            }
        }
        console.log("Form not found with id:", id);
    }

    function closePopup() {
        document.getElementById("replypopup").style.display = "none";
        document.getElementById("replypopup").classList.remove("active");
        document.body.classList.remove("blur-background");
    }
});

