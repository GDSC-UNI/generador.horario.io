
setTimeout(() => {
    const selectCheckbox = document.querySelectorAll(".select-checkbox.sorting_3");

    selectCheckbox.forEach(select => {

        if (select.getAttribute("rowspan")) {
            console.log(select);
        } else {
            select.parentNode.style.setProperty("cursor", "not-allowed");
            select.parentNode.style.setProperty("pointer-events", "none");
            console.log(select.parentNode);
        }

        select.getAttribute("rowspan");
    });

}, 2500);


// const tagInput = document.querySelector("#input");

// const form = document.forms[0];
const tagContainer = document.querySelector('.tag-container');
const tags = [];

const createTag = (tagValue) => {
    const value = tagValue.trim();

    if (value === '' || tags.includes(value)) return;

    const tag = document.createElement('span');
    const tagContent = document.createTextNode(value);
    tag.setAttribute('class', 'tag');
    tag.appendChild(tagContent);

    const close = document.createElement('span');
    close.setAttribute('class', 'remove-tag');
    close.innerHTML = '&#10006';
    close.onclick = handleRemoveTag;

    tag.appendChild(close);
    tagContainer.appendChild(tag);
    tags.push(tag);

    tagInput.value = '';
    tagInput.focus();
}

