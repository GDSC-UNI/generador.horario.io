const generateButtom = document.querySelector("#generate");

generateButtom.addEventListener("click", event => {

    let arraySelect = [];

    let selected = document.querySelectorAll(".selected");

    selected.forEach(item => {
        arraySelect.push(
            item.childNodes[0].textContent + item.childNodes[2].textContent
        );
    });

    generateSchedule(arraySelect);
});

// Crear la tabla representando un horario en blanco, en donde colocaremos los cursos
function horarioBlanco(){
    let tabla = [];
    let tablaLinea = [];
    for(let i = 0; i < 14; i++){
        for( let j = 0; j < 6; j++){
            tablaLinea.push("");
        }
        tabla.push(tablaLinea);
        tablaLinea = [];
    }
    return tabla;
}

// -------------- Preparar la data -------------- //
// Se crean "coordenadas" para cada horario de cada sección de cada curso,
// las cuales van a representar un lugar en la tabla del horario,
// con un x representando a la hora que corresponden y un y representando el día
function crearCoordenadas(dataTable){
    for(const curso in dataTable){
        for(const sec in dataTable[curso].Secciones){
            for(let i = 0; i < dataTable[curso].Secciones[sec].length; i++){
                let diaEnNumero = cursoDia(dataTable[curso].Secciones[sec][i].Dia)
                let horasEnNumero = cursoHoras(dataTable[curso].Secciones[sec][i].Hora)
                if(dataTable[curso].Secciones[sec][i].Tipo == "P/L") dataTable[curso].Secciones[sec][i].Tipo = "P";
                dataTable[curso].Secciones[sec][i].Coordenadas = [horasEnNumero, diaEnNumero]
            }
        }
    }
}

// Convertir un día a un número del 0 al 5. Ejem: Martes -> 1
function cursoDia(dia){
    switch(dia){
        case "LU":
            return 0;
        case "MA":
            return 1;
        case "MI":
            return 2;
        case "JU":
            return 3;
        case "VI":
            return 4;
        case "SA":
            return 5;
    }
}
// Convertir una hora a un número del 0 al 13. Ejem: 10:00-11:00 -> 2
function cursoHoras(horas){
    let limInf = parseInt(horas.split("-")[0].split(":")[0]);
    let limSup = parseInt(horas.split("-")[1].split(":")[0]);
    let horasNumero = [];
    for(let i = limInf; i < limSup; i++){
        horasNumero.push(i-8);
    }
    return horasNumero
}

// -------------- Crear un horario -------------- //
// Usando un conjunto de tablas de horarios para cada curso y sección la cual se ha 
// seleccionado se crea un horario compartido en la cual se podrá observar cuando
// los cursos tienen cruce y como luciría el horario final
function horarioCompartido(conjunHorarios, arregloCursos, datatable){
    let tablita = conjunHorarios[0];
    for(let i = 0; i < tablita.length; i++){
        for(let j = 0; j < tablita[0].length; j++){
            if(tablita[i][j] != ""){
                tablita[i][j] = "1"+ tablita[i][j];
            }
        }
    }
    for(let conjun = 1; conjun < conjunHorarios.length; conjun++){
        for(let i = 0; i < tablita.length; i++){
            for(let j = 0; j < tablita[0].length; j++){
                if(tablita[i][j] != "" || conjunHorarios[conjun][i][j] != ""){
                    if(tablita[i][j] != "" && conjunHorarios[conjun][i][j] != ""){
                        tablita[i][j] = tablita[i][j]+"-"+(conjun+1)+conjunHorarios[conjun][i][j];
                    }else{
                        if(tablita[i][j] != "") tablita[i][j] = tablita[i][j]
                        else tablita[i][j] = (conjun+1)+conjunHorarios[conjun][i][j]
                    }
                }
            }
        }
    }
    let noHayCruce = existeCruces(tablita, arregloCursos, datatable);
    let cumpleCiclos = CiclosConsecutivos(datatable, arregloCursos);
    if(noHayCruce && cumpleCiclos){
        var posibilidadHorario = true;
    }
    else{
        var posibilidadHorario = false;
    }
    return [posibilidadHorario, tablita]
}

// En esta función se realizará una tabla de horario para el curso seleccionado
function pintarHorarioSeccion(seccion){
    let tablita = horarioBlanco();
    for(let i = 0; i < seccion.length; i++){
        let tipo = seccion[i].Tipo;
        for(let j = 0; j < seccion[i].Coordenadas[0].length; j++){
            let x = seccion[i].Coordenadas[0][j];
            let y = seccion[i].Coordenadas[1];
            tablita[x][y] = tipo;
        }
    }
    return tablita;
}
// Se crea el conjunto de tablas de horarios que usa horarioCompartido, en la cual
// se introducira un arreglo en donde se indiquen {indiceCurso, seccionCurso}
function crearConjuntoCursos(arregloCursos, datatable){
    let cursosConvertido = [];
    for(let i = 0; i < arregloCursos.length; i++){
        cursosConvertido.push(pintarHorarioSeccion(datatable[arregloCursos[i].split("/")[0]].Secciones[arregloCursos[i].split("/")[1]]));
    }
    return cursosConvertido
}

// -------------- Depuración de horario -------------- //
// Existen los siguientes problemas al realizar el horario:
// 1. Los cursos desaprobados no se encuentran (Dependerá del usuario)
// 2. Regla de 3 ciclos consecutivos
// 3. Cruces:
// 3.1. Existen más de 2 cruces T-T
// 3.2. Existe 1 o más curces P-L, P-P, L-L

// Detecta si todos los cursos seleccionados pertenecen a 3 ciclos consecutivos
// (false = no cumple el requisito, true = cumple el requisito)
function CiclosConsecutivos(dataTable, arregloCursos){
    let ciclos = []
    for(let curso in arregloCursos){
        ciclos.push(dataTable[parseInt(arregloCursos[curso].split("/")[0])].Ciclo)
    }
    const distinct = (value, index, self) => {
        return self.indexOf(value) === index;
    }
    var ciclosDistintos = ciclos.filter(distinct)
    if(ciclosDistintos.length <= 3){
        return true
    }
    return false
}

// Detecta si hay cruces o no: (true = no hay cruce o hay cruces permitidos, false = cruces no permitidos)
function existeCruces(horarioCompleto, arregloCursos, datatable){
    let errores = [];
    let TipErrores = [0, 0];
    for(let i = 0; i < horarioCompleto.length; i++){
        for(let j = 0; j < horarioCompleto[0].length; j++){
            if(horarioCompleto[i][j] != ""){
                if(horarioCompleto[i][j].includes("-")){
                    curso1indice = parseInt(horarioCompleto[i][j].split("-")[0][0]);
                    curso2indice = parseInt(horarioCompleto[i][j].split("-")[1][0]);
                    curso1completo = encontrarCursoXIndice(arregloCursos[curso1indice-1].split("/")[0], arregloCursos[curso1indice-1].split("/")[1], datatable)
                    curso2completo = encontrarCursoXIndice(arregloCursos[curso2indice-1].split("/")[0], arregloCursos[curso2indice-1].split("/")[1], datatable)
                    // errores.push("Hay cruce entre el curso " + curso1completo.split("/")[0] + " sección " + curso1completo.split("/")[1] + " y el curso "+ curso2completo.split("/")[0] + " sección " + curso2completo.split("/")[1])
                    errores.push(horarioCompleto[i][j].split("-")[0][1]+"/"+horarioCompleto[i][j].split("-")[1][1]);
                }
            }
        }
    }
    for(let j = 0; j < errores.length; j++){
        if(errores[j] == "P/T" || errores[j] == "T/P" || errores[j] == "L/T" || errores[j] == "T/L" || errores[j] == "T/T"){
            TipErrores[0] += 1;
        }
        else if(errores[j] == "P/P" || errores[j] == "P/L" || errores[j] == "L/P" || errores[j] == "L/L"){
            TipErrores[1] += 1;
        }
    }
    if(TipErrores[1] > 0){
        return false
    }
    if(TipErrores[0] > 2){
        return false
    }
    return true
}

// -------------- Herramientas de Búsqueda -------------- //
// Se encuentra el índice en la tabla de data del
// curso al cual le corresponde el codigo y sección introducido
// Además indica si existe el curso o sección, devolviendo NA si no existen
function encontrarCursoXCodigo(codigo, seccion, dataTable){
    let codigoCursoEncontrado = "";
    let seccionCursoEncontrado = "";
    let respuesta = "";
    for(const curso in dataTable){
        if(dataTable[curso].Codigo == codigo){
            codigoCursoEncontrado = curso;
            for(const sec in dataTable[curso].Secciones){
                if(sec == seccion){
                    seccionCursoEncontrado = sec;
                }
            }
        }
    }
    if(codigoCursoEncontrado == "") respuesta = "NA";
    else respuesta = codigoCursoEncontrado;
    if(seccionCursoEncontrado == "") respuesta = respuesta + "/" + "NA";
    else respuesta = respuesta + "/" +seccionCursoEncontrado;
    return respuesta;
}

// Se encuentra el código en la tabla de data del
// curso al cual le corresponde el índice y sección introducido
// Además indica si existe el curso o sección, devolviendo NA si no existen
function encontrarCursoXIndice(codigo, seccion, dataTable){
    let codigoCursoEncontrado = "";
    let seccionCursoEncontrado = "";
    let respuesta = "";
    if(codigo < dataTable.length){
        codigoCursoEncontrado =dataTable[codigo].Codigo;
        for(const sec in dataTable[codigo].Secciones){
            if(sec == seccion){
                seccionCursoEncontrado = sec;
            }
        }
    }
    if(codigoCursoEncontrado == "") respuesta = "NA";
    else respuesta = codigoCursoEncontrado;
    if(seccionCursoEncontrado == "") respuesta = respuesta + "/" + "NA";
    else respuesta = respuesta + "/" +seccionCursoEncontrado;
    return respuesta;
}

// Crear la linea de cursos
function crearLineaCursos(arrCursos, dataTable){
    let lineaCurso = [];
    for(let i = 0; i < arrCursos.length; i++){
        lineaCurso.push(encontrarCursoXCodigo(arrCursos[i].substring(0,5),arrCursos[i].substring(5,6),dataTable));
    }
    return lineaCurso;
}

function generateSchedule(lineaDeEntrada) {
    fetch("../JSON/horarioUltimo.json")
    .then(response => response.json())
    .then(data => {
        let dataHorario = data;
        let linea1 = crearLineaCursos(lineaDeEntrada,dataHorario);
        crearCoordenadas(dataHorario);
        const conjunCursos = crearConjuntoCursos(linea1, dataHorario);
        let horarioCreado = horarioCompartido(conjunCursos, linea1, dataHorario);
        generateScheduleTable(lineaDeEntrada, horarioCreado);
    })
}


function generateScheduleTable(lineaDeEntrada, horarioCreado) {

    let arraySelect = [];

    
    for (let i = 0; i < horarioCreado[1].length; i++) {
        for (let j = 0; j < horarioCreado[1][i].length; j++ ) {
            if(horarioCreado[1][i][j] !== '') {
                let days = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];
                let hours = ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

                let infoCourse = ''

                for (let k = 0; k < horarioCreado[1][i][j].split("-").length; k++) {
                    codeCourse = lineaDeEntrada[horarioCreado[1][i][j].split("-")[k].split("")[0] - 1];
                    type = horarioCreado[1][i][j].split("-")[k].split("")[1];

                    infoCourse += `${codeCourse}-${type}/`;
                }

                arraySelect.push([hours[i], days[j], infoCourse.substring(0, infoCourse.length - 1)]);

            }
        }
    }

    try {

        arraySelect.forEach(course => {

            console.log(course);
            codeCourse = course[2];

            dayId = course[1];
            hourCourse = course[0];

            hourInit = Number.parseInt(hourCourse, 10);
            hourEnd = Number.parseInt(hourCourse, 10) + 1;

            const idf = document.querySelector(`#${dayId}`);

            idf.insertAdjacentHTML('beforeend', `<div class="calendar_event" style="position: absolute; left: 0%; top: ${2*30*(hourInit-7)+1}px; width: 100%; height: ${2*30*(hourEnd - hourInit)+1}px; overflow: hidden; cursor: n-resize;">
                    <div unselectable="on" style="font-size: 10px; text-align: center;" class="calendar_event_inner">${codeCourse} <br> ${hourCourse} <br> ${dayId} <br> </div>
                    <div unselectable="on" class="calendar_event_bar" style="position: absolute; background-color: transparent;">
                        <div unselectable="on" class="calendar_default_event_bar_inner" style="top: 0%; height: 100%; background-color: #${Math.floor(Math.random()*16777215).toString(16)};"></div>
                    </div>
                </div>`
            );
        });

        const btnclose = document.querySelectorAll(".btnclose");

        const alldays = document.querySelectorAll(".alldays");

        const selected = document.querySelectorAll(".selected");

        btnclose.forEach(item => {
            item.addEventListener('click', event => {
                alldays.forEach(day => {
                    day.innerHTML = '';
                });
                selected.forEach(select => {
                    select.classList.replace('selected', 'not_selected');
                });
            })
        });

    } catch (e) {
        console.error();
    }
}

function generateCell() {
    const hours = document.querySelector("#hours");
    const paintcell = document.querySelector(".paint_cell.paint_first");
    const bodycell = document.querySelector("#body_cell");

    for (let i = 7; i < 24; i ++) {
        hours.insertAdjacentHTML("beforeend", `<tr style="height: 60px;">
        <td style="cursor: default; padding: 0px; border: 0px none;">
            <div class="calendar_rowheader" style="position: relative; width: 60px; height: 60px; overflow: hidden;">
                <div class="calendar_rowheader_inner">
                    <div>${i}<span class="calendar_rowheader_minutes">⏲</span>
                    </div>
                </div>
            </div>
        </td>
    </tr>`);
    }

    const days = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];
    for (let i = 0; i < 8; i ++) {
        paintcell.insertAdjacentHTML("beforeend", `<td style="padding: 0px; border: 0px none; height: 0px; overflow: visible; text-align: left;">
            <div class="alldays" id="${days[i]}" style="margin-right: 5px; position: relative; height: 1px; margin-top: -1px;"></div>
            <div style="position: relative;"></div>
        </td>`);
    }

    let count;

    for (let i = 7; i < 41; i ++) {
        count = 7.0 + .5*(i-7);
        stringCount = count.toString().replace('.5', '_30');
        let tr = `<tr class="cell_hour hour_${stringCount}"></tr>`;
        bodycell.insertAdjacentHTML('beforeend', tr);
    }

    const trcell = document.querySelectorAll(".cell_hour");
    
    for (let i = 0; i < trcell.length; i++) {
        const days = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];
    
        let cellhourcourse = '';
    
        days.forEach(day => {
            cellhourcourse = cellhourcourse + `<td id="${day}_${trcell[i].getAttribute('class').replace('cell_hour hour_', '')}" style="padding: 0px; border: 0px none; vertical-align: top; height: 30px; overflow: hidden;">
            <div class="calendar_cell" style="height: 30px; position: relative;">
                <div unselectable="on" class="calendar_cell_inner"></div>
            </div>
        </td>`
        });

        trcell[i].insertAdjacentHTML('beforeend', cellhourcourse);
    }
}

generateCell();
