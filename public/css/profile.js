
document.getElementById("edit-btn").addEventListener("click", function() {
    // Open a new window with specified URL, width, height, and other options
    var popupWindow = window.open("/edit", "Pop-up Window", "width=640,height=600");
});

function showSection(sectionId, link) {
    // Hide all sections
    var sections = document.getElementsByClassName("section");
    for (var i = 0; i < sections.length; i++) {
      sections[i].classList.remove("active");
    }
    
    // Show the selected section
    var selectedSection = document.getElementById(sectionId);
    selectedSection.classList.add("active");
  
    // Update the active link in the navbar
    var links = document.querySelectorAll('.navbar a');
    links.forEach(function(item) {
      item.classList.remove('active');
    });
    link.classList.add("active");
  }
