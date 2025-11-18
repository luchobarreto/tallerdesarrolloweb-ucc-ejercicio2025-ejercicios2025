const inputMetro = document.getElementById("metro");
const inputPulgada = document.getElementById("pulgada");
const inputPie = document.getElementById("pie");
const inputYarda = document.getElementById("yarda");

const ratioMetroPulgada = 39.3701;
const ratioMetroPie = 3.28084;
const ratioMetroYarda = 1.09361;

function limpiarTodos() {
    inputMetro.value = "";
    inputPulgada.value = "";
    inputPie.value = "";
    inputYarda.value = "";
}

function cambiarUnidades(valor, nombre) {
    const valorFloat = parseFloat(valor);
    if (!Number.isFinite(valorFloat)) { limpiarTodos(); return; }

    let metros;
    switch (nombre) {
        case "unid_metro":
            metros = valorFloat;
            break;
        case "unid_pulgada":
            metros = valorFloat / ratioMetroPulgada;
            break;
        case "unid_pie":
            metros = valorFloat / ratioMetroPie;
            break;
        case "unid_yarda":
            metros = valorFloat / ratioMetroYarda;
            break;
        default:
            return;
    }

    inputMetro.value = Number(metros.toFixed(6));
    inputPulgada.value = Number((metros * ratioMetroPulgada).toFixed(6));
    inputPie.value = Number((metros * ratioMetroPie).toFixed(6));
    inputYarda.value = Number((metros * ratioMetroYarda).toFixed(6));
}
