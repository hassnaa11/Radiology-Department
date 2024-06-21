var productnameinput = document.getElementById('engname')
var productcategryinput = document.getElementById('phoneno')
var productpriceinput = document.getElementById('adress')
var productdescinput = document.getElementById('email')
var hoursinput = document.getElementById('hours')

var proudectList = []
if (localStorage.getItem('proudects') != null) {
    proudectList = JSON.parse(localStorage.getItem('proudects'))
    desplay()
}
function main() {
    getinputsData()
    desplay()
    clear()

}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("addBtnn").addEventListener("click", openPopup);
    document.querySelector(".close-btn").addEventListener("click", closePopup);

    function openPopup() {
        document.getElementById("container2").style.display = "block";
        document.getElementById("container2").classList.add("active");
        document.body.classList.add("blur-background");
    }

    function closePopup() {
        document.getElementById("container2").style.display = "none";
        document.getElementById("container2").classList.remove("active");
        document.body.classList.remove("blur-background");

    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("mdaddBtnn").addEventListener("click", openPopup);
    document.querySelector(".mdclose-btn").addEventListener("click", closePopup);

    function openPopup() {
        document.getElementById("mdcontainer2").style.display = "block";
        document.getElementById("mdcontainer2").classList.add("active");
        document.body.classList.add("blur-background");
    }

    function closePopup() {
        document.getElementById("mdcontainer2").style.display = "none";
        document.getElementById("mdcontainer2").classList.remove("active");
        document.body.classList.remove("blur-background");

    }
});


function getinputsData() {
    var product = {
        Name: productnameinput.value,
        Phone: productcategryinput.value,
        Adress: productpriceinput.value,
        Email: productdescinput.value,
        hours: hoursinput.value
    }
    proudectList.push(product)
    localStorage.setItem('proudects', JSON.stringify(proudectList))


}



function desplay() {
    var cartona = ''
    for (var i = 0; i < proudectList.length; i++) {
        cartona += `
        <tr>
        <td>${i}</td>
        <td>${proudectList[i].Name}</td>
        <td>${proudectList[i].Phone}</td>
        <td>${proudectList[i].Adress}</td>
        <td>${proudectList[i].Email}</td>
        <td>${proudectList[i].hours}</td>
        <td><button onclick="Deleteproudet(${i})" class="btn btn-danger">Delete</button></td>
        <td><button onclick="updateProduct(${i})" class="btn btn-warning">Update</button></td>
        </tr> 
        `

    }
    document.getElementById('tbody').innerHTML = cartona

}



function clear() {
    productnameinput.value = ""
    productcategryinput.value = ""
    productpriceinput.value = ""
    productdescinput.value = ""
    hoursinput.value = ""

}

function Deleteproudet(index) {
    proudectList.splice(index, 1)
    localStorage.setItem('proudects', JSON.stringify(proudectList))
    desplay()

}


function search(value) {
    var cartonaa2 = ''
    for (var i = 0; i < proudectList.length; i++) {
        if (proudectList[i].name.toLowerCase().includes(value.toLowerCase())) {
            cartonaa2 += `
            <tr>
            <td>${i}</td>
            <td>${proudectList[i].Name.replaceAll(value, `<span>${value}</span>`)}</td>
            <td>${proudectList[i].Phone}</td>
            <td>${proudectList[i].Adress}</td>
            <td>${proudectList[i].Email}</td>
            <td>${proudectList[i].hours}</td>
            <td><button onclick="Deleteproudet(${i})" class="btn btn-danger">Delete</button></td>
            <td><button onclick="updateProduct(${i})" class="btn btn-warning">Update</button></td>
            </tr> `
            document.getElementById('tbody').innerHTML = cartonaa2

        }

    }


}

var productIndex = 0
function updateProduct(index) {
    productIndex = index
    productnameinput.value = proudectList[index].name
    productcategryinput.value = proudectList[index].categry
    productpriceinput.value = proudectList[index].price
    productdescinput.value = proudectList[index].desc
    window.scrollTo(0, 0)
    document.getElementById('updateBtn').style.display = "block"
    document.getElementById('addBtn').style.display = "none"

}

function update() {
    document.getElementById('updateBtn').style.display = "none"
    document.getElementById('addBtn').style.display = "block"
    proudectList[productIndex].Name = productnameinput.value
    proudectList[productIndex].Phone = productcategryinput.value
    proudectList[productIndex].Adress = productpriceinput.value
    proudectList[productIndex].Email = productdescinput.value
    proudectList[productIndex].hours = hoursinput.value
    localStorage.setItem('proudects', JSON.stringify(proudectList))
    desplay()

}


//<div class = "panel">
//<img class="engp2" name = "eng" id = "eng" src = "engp2.png" width="400" height="200">
//<img class="engp1" name = "word" id = "word" src = "engp1.png" width="300" height="400">
//</div>
