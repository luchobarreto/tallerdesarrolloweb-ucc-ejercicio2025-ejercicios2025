const div = document.getElementById("div");

const MOSTAR_VALUE = "val_mostrar";

const mostrarOcultarDiv = (val) => {
    if(val === MOSTAR_VALUE) {
        div.style.display = "block";
    } else {
        div.style.display = "none";
    }
}