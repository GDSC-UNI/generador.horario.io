const filter = (ciclo) => {
    fetch("../JSON/horarios.json")
    .then(response => response.json())
    .then(data => {
        
        const courseCiclo = Object.values(data)[0].filter((course) => course.includes(ciclo));
        const inputCode = document.querySelector("#datalistOptionsCode");

        let codeCourse = [];

        courseCiclo.forEach((item) => {

            if (!codeCourse.includes(item[0])) {
                codeCourse.push(item[0]);
            }
        });

        inputCode.innerHTML = "";
        
        codeCourse.forEach((code) => {
            inputCode.innerHTML = inputCode.innerHTML + `<option value="${code}">`;
        });
    });
}


const button = document.querySelector("#addCourse");
const dataListCycle = document.querySelector("#dataListCycle");
const course = document.querySelector("#course");

const selectCourse = (e) => {
    e.preventDefault();
    course.textContent = dataListCycle.value;
    
    filter(dataListCycle.value);
}

button.addEventListener("click", selectCourse);