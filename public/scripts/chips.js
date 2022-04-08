
setTimeout(() => {
    const selectCheckbox = document.querySelectorAll(".select-checkbox.sorting_3");

    const tagContainer = document.querySelector('.tag-container');

    selectCheckbox.forEach(select => {

        if (select.getAttribute("rowspan")) {
            select.addEventListener("click", event => {

                if(event.currentTarget.parentNode.classList[1] == undefined) {

                    tagContainer.childNodes[1].textContent = "Cursos Seleccionados"

                    tagContainer.insertAdjacentHTML("beforeend",
                    `<div class="content_select_course" id="${event.currentTarget.parentNode.childNodes[0].textContent}_${event.currentTarget.parentNode.childNodes[2].textContent}">
                        ${event.currentTarget.parentNode.childNodes[0].textContent}
                        ${event.currentTarget.parentNode.childNodes[2].textContent}
                        <span class="text_course">${event.currentTarget.parentNode.childNodes[1].textContent}</span>
                    </div>`);
                }

                if(event.currentTarget.parentNode.classList[1] == "selected") {
                    let idDelete = document.querySelector(`#${event.currentTarget.parentNode.childNodes[0].textContent}_${event.currentTarget.parentNode.childNodes[2].textContent}`);

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
