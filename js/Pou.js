
let tablero;
let anchoTablero = 360;  // Volvemos al ta
let altoTablero = 576;   // Volvemos al tamaño original que funciona
let contexto;


let anchoPou = 46;
let altoPou = 46;
let pouX = anchoTablero/2 - anchoPou/2;
let pouY = altoTablero*7/8 - altoPou;
let imagenPouDerecha;
let imagenPouIzquierda;

let pou = {
    imagen : null,
    x : pouX,
    y : pouY,
    ancho : anchoPou,
    alto : altoPou
}

let velocidadX = 0; 
let velocidadY = 0;
let velocidadInicialY = -8;
let gravedad = 0.4;


let arrayPlataformas = [];
let anchoPlataforma = 60;
let altoPlataforma = 18;
let imagenPlataforma;


let imagenFondo;

let puntuacion = 0;
let puntuacionMaxima = 0;
let juegoTerminado = false;

window.onload = function() {
    tablero = document.getElementById("board");
    tablero.height = altoTablero;
    tablero.width = anchoTablero;
    contexto = tablero.getContext("2d");

    imagenFondo = new Image();
    imagenFondo.onload = function() {
        console.log("Fondo cargado correctamente");
    }
    imagenFondo.src = "./IMGS/Fondo.png";

    imagenPouDerecha = new Image();
    imagenPouDerecha.onload = function() {
        console.log("PouNormal cargado correctamente");
    }
    imagenPouDerecha.src = "./IMGS/PouNormal.png";
    pou.imagen = imagenPouDerecha;
    
    imagenPouIzquierda = new Image();
    imagenPouIzquierda.onload = function() {
        console.log("PouFeliz cargado correctamente");
    }
    imagenPouIzquierda.src = "./IMGS/PouFeliz.png";

    imagenPlataforma = new Image();
    imagenPlataforma.onload = function() {
        console.log("Nube cargada correctamente");
    }
    imagenPlataforma.src = "./IMGS/nube.png";

    velocidadY = velocidadInicialY;
    colocarPlataformas();
    requestAnimationFrame(actualizar);
    document.addEventListener("keydown", moverPou);
    
    console.log("Juego iniciado correctamente");
}

function actualizar() {
    requestAnimationFrame(actualizar);
    if (juegoTerminado) {
        return;
    }
    contexto.clearRect(0, 0, tablero.width, tablero.height);

    // Dibujar fondo
    if (imagenFondo.complete) {
        contexto.drawImage(imagenFondo, 0, 0, tablero.width, tablero.height);
    }

    // Pou
    pou.x += velocidadX;
    if (pou.x > anchoTablero) {
        pou.x = 0;
    }
    else if (pou.x + pou.ancho < 0) {
        pou.x = anchoTablero;
    }

    velocidadY += gravedad;
    pou.y += velocidadY;
    if (pou.y > tablero.height) {
        juegoTerminado = true;
    }
    
    if (pou.imagen.complete) {
        contexto.drawImage(pou.imagen, pou.x, pou.y, pou.ancho, pou.alto);
    }

    // Plataformas (nubes)
    for (let i = 0; i < arrayPlataformas.length; i++) {
        let plataforma = arrayPlataformas[i];
        if (velocidadY < 0 && pou.y < altoTablero*3/4) {
            plataforma.y -= velocidadInicialY;
        }
        if (detectarColision(pou, plataforma) && velocidadY >= 0) {
            velocidadY = velocidadInicialY;
        }
        if (plataforma.imagen.complete) {
            contexto.drawImage(plataforma.imagen, plataforma.x, plataforma.y, plataforma.ancho, plataforma.alto);
        }
    }

    // Limpiar plataformas y agregar nuevas
    while (arrayPlataformas.length > 0 && arrayPlataformas[0].y >= altoTablero) {
        arrayPlataformas.shift();
        nuevaPlataforma();
    }

    // Puntuación
    actualizarPuntuacion();
    contexto.fillStyle = "white";
    contexto.font = "16px sans-serif";
    contexto.fillText("Puntuación: " + puntuacion, 5, 20);

    if (juegoTerminado) {
        contexto.fillStyle = "white";
        contexto.font = "16px sans-serif";
        contexto.fillText("Juego Terminado: Presiona 'Espacio' para Reiniciar", boardWidth/7, boardHeight*7/8);
    }
}

function moverPou(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        velocidadX = 4;
        pou.imagen = imagenPouDerecha;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        velocidadX = -4;
        pou.imagen = imagenPouIzquierda;
    }
    else if (e.code == "Space" && juegoTerminado) {
        reiniciarJuego();
    }
}

function reiniciarJuego() {
    pou = {
        imagen : imagenPouDerecha,
        x : pouX,
        y : pouY,
        ancho : anchoPou,
        alto : altoPou
    }

    velocidadX = 0;
    velocidadY = velocidadInicialY;
    puntuacion = 0;
    puntuacionMaxima = 0;
    juegoTerminado = false;
    colocarPlataformas();
}

function colocarPlataformas() {
    arrayPlataformas = [];

    // Plataforma inicial
    let plataforma = {
        imagen : imagenPlataforma,
        x : anchoTablero/2,
        y : altoTablero - 50,
        ancho : anchoPlataforma,
        alto : altoPlataforma
    }

    arrayPlataformas.push(plataforma);

    for (let i = 0; i < 6; i++) {
        let xAleatorio = Math.floor(Math.random() * anchoTablero*3/4);
        let plataforma = {
            imagen : imagenPlataforma,
            x : xAleatorio,
            y : altoTablero - 75*i - 150,
            ancho : anchoPlataforma,
            alto : altoPlataforma
        }
    
        arrayPlataformas.push(plataforma);
    }
}

function nuevaPlataforma() {
    let xAleatorio = Math.floor(Math.random() * anchoTablero*3/4);
    let plataforma = {
        imagen : imagenPlataforma,
        x : xAleatorio,
        y : -altoPlataforma,
        ancho : anchoPlataforma,
        alto : altoPlataforma
    }

    arrayPlataformas.push(plataforma);
}

function detectarColision(a, b) {
    return a.x < b.x + b.ancho &&
           a.x + a.ancho > b.x &&
           a.y < b.y + b.alto &&
           a.y + a.alto > b.y;
}

function actualizarPuntuacion() {
    let puntos = Math.floor(50*Math.random());
    if (velocidadY < 0) {
        puntuacionMaxima += puntos;
        if (puntuacion < puntuacionMaxima) {
            puntuacion = puntuacionMaxima;
        }
    }
    else if (velocidadY >= 0) {
        puntuacionMaxima -= puntos;
    }
}