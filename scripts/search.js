let fname = document.querySelector(".fname");

fname.addEventListener("keyup", () => {
    let input, filter, tbody, tr, td, found;
    
    input = document.querySelector(".fname");
    filter = input.value.toUpperCase();
    tbody = document.querySelector("#myTable tbody");
    tr = tbody.getElementsByTagName("tr");
    
    for (let i = 0; i < tr.length; i++) {

        td = tr[i].getElementsByTagName("td");

        for (let j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }

        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            tr[i].style.display = "none";
        } 
    }
});

let fName = document.querySelector(".fName");

fName.addEventListener("keyup", () => {
    let input, filter, tbody, tr, td, found;
    
    input = document.querySelector(".fName");
    filter = input.value.toUpperCase();
    tbody = document.querySelector("#myTable tbody");
    tr = tbody.getElementsByTagName("tr");
    
    for (let i = 0; i < tr.length; i++) {

        td = tr[i].getElementsByTagName("td");

        for (let j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }

        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            tr[i].style.display = "none";
        } 
    }
});