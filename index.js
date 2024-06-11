import { Lexer } from "./afd.js";


document.getElementById('file-input').addEventListener('change', cargarContenido);

function cargarContenido(event) {
    const archivo = event.target.files[0];
    if (!archivo) {
        return;
    }
    const lector = new FileReader();
    lector.onload = function(e) {
        const contenido = e.target.result;
        document.getElementById('contenido').value = contenido; 
    };
    lector.readAsText(archivo);
}

document.getElementById('iniciar').addEventListener('click', tokenizarArchivo);

function tokenizarArchivo() {
    const contenido = document.getElementById('contenido').value;
    const lexer = new Lexer(contenido);
    const tokenOutput = lexer.start();
    document.getElementById('resultado').value = tokenOutput; 
}

