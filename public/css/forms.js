document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("form2").addEventListener("click", openPopup);
    document.querySelector(".rclose-btn").addEventListener("click", closePopup);

    function openPopup() {
        document.getElementById("replypopup").style.display = "block";
        document.getElementById("replypopup").classList.add("active");
        document.body.classList.add("blur-background");
    }

    function closePopup() {
        document.getElementById("replypopup").style.display = "none";
        document.getElementById("replypopup").classList.remove("active");
        document.body.classList.remove("blur-background");

    }
});
