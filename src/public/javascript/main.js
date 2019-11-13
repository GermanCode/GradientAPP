function readFile() { 
    if (this.files && this.files[0]) {
        var FR= new FileReader();
        FR.addEventListener("load", function(e) {
        document.getElementById("img").src       = e.target.result;
        //document.getElementById("b64").innerHTML = e.target.result;
        document.getElementById ("img_Solucion").value = e.target.result;
        }); 
        FR.readAsDataURL( this.files[0] );  
    }

};

function mostrarPanelRestricciones() {
    element = document.getElementById("content");
    check = document.getElementById("check");
    if (check.checked) {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
};

function selectSignoParaFuncion() {
    var cod = document.getElementById("signo").value;
    return cod;
};

function selectCursoRegistro() {
var cur = document.getElementById("select_Curso").value;
return cur;
};
       
function selectCursoEjercicio() {
var curejer = document.getElementById("fk_Curso").value;
return curejer;
alert(curejer);
};

function llenarHidden(){
    var izq = document.getElementById("inputLadoIzq").value;
    var der = document.getElementById("inputLadoDer").value;
    var sig = document.getElementById("signo").value;
    var equa = document.getElementById("restriccionCompleta").value += izq + sig + der + ", ";
    document.getElementById ("descripcion").value = equa;
    document.getElementById("inputLadoIzq").value="";
    document.getElementById("inputLadoDer").value="";
    signo.selectedIndex =0;
};

function eliminarRestriccion(){
    var cadena = document.getElementById("descripcion").value;
    var separador = ",";
    var result = cadena.split(separador);
    var cant = result.length;
    document.getElementById("descripcion").value="";
    for(var i = 0; i<cant; i++){
        document.getElementById("descripcion").value += cadena[i];
    }
     
    alert(cant);
    alert(document.getElementById("descripcion").value);
};

function alerta(){
    var mensaje;
    var opcion = confirm("Clicka en Aceptar o Cancelar");
    if (opcion == true) {
        mensaje = "Has clickado OK";
    } else {
        mensaje = "Has clickado Cancelar";
    }
    document.getElementById("ejemplo").innerHTML = mensaje;
};  