
setTimeout(() => {
    const selectCheckbox = document.querySelectorAll(".select-checkbox.sorting_3");

    
    const tagContainer = document.querySelector('.tag-container');
    
    selectCheckbox.forEach(select => {
        
        
        if (select.getAttribute("rowspan")) {
            // console.log(select.parentNode);
            select.parentNode.addEventListener("click", event => {
                console.log(event.currentTarget.classList);

                if(event.currentTarget.classList[1] != "selected") {
                    tagContainer.childNodes[1].textContent = "Cursos Seleccionados"
                    tagContainer.insertAdjacentHTML("beforeend",
                    `<div class="content_select_course" id="${event.currentTarget.childNodes[0].textContent}_${event.currentTarget.childNodes[2].textContent}">
                        ${event.currentTarget.childNodes[0].textContent}
                        ${event.currentTarget.childNodes[2].textContent}
                        <span class="text_course">${event.currentTarget.childNodes[1].textContent}</span>
                    </div>`);
                }

                if(event.currentTarget.classList[1] == "selected") {
                    let idDelete = document.querySelector(`#${event.currentTarget.childNodes[0].textContent}_${event.currentTarget.childNodes[2].textContent}`);

                    idDelete.remove();

                    if(tagContainer.childNodes.length == 3) {
                        tagContainer.childNodes[1].textContent = "";
                    }
                }
            });
        } else {
            select.parentNode.style.setProperty("cursor", "not-allowed");
            select.parentNode.style.setProperty("pointer-events", "none");
        }
    });

}, 2500);
