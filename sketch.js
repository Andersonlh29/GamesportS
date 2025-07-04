let pelota;
let raquetaJugador;
let raquetaComputadora;
let marcoSuperior;
let marcoInferior;
let puntajeJugador = 0;
let puntajeComputadora = 0;
let tiempoInicio;
let mostrarPunto = false;
let tiempoPunto = 0;
let animacionPuntoJugador = false;
let animacionPuntoComputadora = false;
let tiempoAnimacionJugador = 0;
let tiempoAnimacionComputadora = 0;
let juegoTerminado = false;
let mensajeGanador = "";
let fuenteLED;
let velocidadComputadora = 3;
let seleccionNivel = true;

let botonFacil, botonMedio, botonDificil, botonReiniciar, botonPausa;

let sonidoGolpe;
let sonidoPublico;
let sonidoFinal;

let juegoPausado = false;

// Sprites opcionales
let spritePelota, spriteRaqueta;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 490;

let canvas;

function preload() {
  sonidoGolpe = loadSound('tennis-ball-hit-151257.mp3');
  sonidoPublico = loadSound('crowd-clapping-and-cheering-effect-272056.mp3');
  sonidoFinal = loadSound('fanfare-1-276819.mp3');
  fuenteLED = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');

  // OPCIONALES: Descomentar si tienes imágenes
  // spritePelota = loadImage('pelota.png');
  // spriteRaqueta = loadImage('raqueta.png');
}

function setup() {
  canvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
  centrarCanvas();
  textFont(fuenteLED);
  crearBotonesNivel();
  inicializarElementos();
  crearBotonesJuego();
  posicionarBotonesJuego();
}

function centrarCanvas() {
  canvas.position(windowWidth / 2 - GAME_WIDTH / 2, windowHeight / 2 - GAME_HEIGHT / 2);
}

function inicializarElementos() {
  pelota = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    diametro: 20,
    velocidadX: 5,
    velocidadY: 3
  };
  raquetaJugador = { x: 5, y: GAME_HEIGHT / 2 - 40, ancho: 10, alto: 80 };
  raquetaComputadora = { x: GAME_WIDTH - 15, y: GAME_HEIGHT / 2 - 40, ancho: 10, alto: 80 };
  marcoSuperior = { alto: 60 };
  marcoInferior = { alto: 10 };
  tiempoInicio = millis();
}

function crearBotonesNivel() {
  let centroX = windowWidth / 2 - 40;
  let centroY = windowHeight / 2 - 70;

  botonFacil = createButton("Fácil");
  botonFacil.position(centroX, centroY);
  botonFacil.size(80, 40);
  botonFacil.style('background-color', '#44e141');
  botonFacil.style('color', 'white');
  botonFacil.style('border', '2px solid white');
  botonFacil.mousePressed(() => seleccionarNivel(1));

  botonMedio = createButton("Medio");
  botonMedio.position(centroX, centroY + 100);
  botonMedio.size(80, 40);
  botonMedio.style('background-color', '#44e141');
  botonMedio.style('color', 'white');
  botonMedio.style('border', '2px solid white');
  botonMedio.mousePressed(() => seleccionarNivel(3));

  botonDificil = createButton("Difícil");
  botonDificil.position(centroX, centroY + 200);
  botonDificil.size(80, 40);
  botonDificil.style('background-color', '#44e141');
  botonDificil.style('color', 'white');
  botonDificil.style('border', '2px solid white');
  botonDificil.mousePressed(() => seleccionarNivel(4));
}

function crearBotonesJuego() {
  botonPausa = createButton("Pausar");
  botonPausa.size(80, 30);
  botonPausa.style('background-color', '#44e141');
  botonPausa.style('color', 'white');
  botonPausa.style('border', '2px solid white');
  botonPausa.mousePressed(togglePausa);
  botonPausa.hide();

  botonReiniciar = createButton("Reiniciar");
  botonReiniciar.size(80, 30);
  botonReiniciar.style('background-color', '#44e141');
  botonReiniciar.style('color', 'white');
  botonReiniciar.style('border', '2px solid white');
  botonReiniciar.mousePressed(reiniciarJuego);
  botonReiniciar.hide();
}

function posicionarBotonesJuego() {
  let cx = windowWidth / 2 - GAME_WIDTH / 2 + GAME_WIDTH - 200; 
  let cy = windowHeight / 2 - GAME_HEIGHT / 2 + 15;
  botonPausa.position(cx, cy);
  botonReiniciar.position(cx + 90, cy);
}

function windowResized() {
  centrarCanvas();
  posicionarBotonesJuego();

  if (seleccionNivel) {
    let centroX = windowWidth / 2 - 40;
    let centroY = windowHeight / 2 - 70;
    botonFacil.position(centroX, centroY);
    botonMedio.position(centroX, centroY + 100);
    botonDificil.position(centroX, centroY + 200);
  }
}

function seleccionarNivel(nivel) {
  velocidadComputadora = nivel === 1 ? 2 : nivel === 3 ? 3 : 4;
  seleccionNivel = false;
  botonFacil.hide();
  botonMedio.hide();
  botonDificil.hide();
  botonPausa.show();
  botonReiniciar.show();
  tiempoInicio = millis();
}

function reiniciarJuego() {
  puntajeJugador = 0;
  puntajeComputadora = 0;
  juegoTerminado = false;
  mensajeGanador = "";
  inicializarElementos();
  juegoPausado = false;
  botonPausa.html("Pausar");
  seleccionNivel = true;
  crearBotonesNivel();
  botonPausa.hide();
  botonReiniciar.hide();
  loop();
}

function togglePausa() {
  if (!juegoPausado) {
    noLoop();
    juegoPausado = true;
    botonPausa.html("Reanudar");
  } else {
    loop();
    juegoPausado = false;
    botonPausa.html("Pausar");
  }
}

function draw() {
  background(0); // Área exterior oscura

  fill(34, 139, 34); // Cancha verde
  rect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  stroke(255);
  strokeWeight(4);
  line(GAME_WIDTH / 2, marcoSuperior.alto, GAME_WIDTH / 2, GAME_HEIGHT - marcoInferior.alto);
  line(0, marcoSuperior.alto, GAME_WIDTH, marcoSuperior.alto);
  line(0, GAME_HEIGHT - marcoInferior.alto, GAME_WIDTH, GAME_HEIGHT - marcoInferior.alto);

  noStroke();
  fill(0);
  rect(0, 0, GAME_WIDTH, marcoSuperior.alto);

  fill(0, 255, 0);
  textSize(18);
  textAlign(LEFT, CENTER);

  let tiempoTranscurrido = int((millis() - tiempoInicio) / 1000);
  let minutos = nf(int(tiempoTranscurrido / 60), 2);
  let segundos = nf(tiempoTranscurrido % 60, 2);

  text("TIEMPO", 100, 15);
  text(`${minutos}:${segundos}`, 100, 35);
  text(`Jugador: ${puntajeJugador}`, 200, 15);
  text(`Computadora: ${puntajeComputadora}`, 200, 35);

  if (animacionPuntoJugador && millis() - tiempoAnimacionJugador < 1000) {
    text("+1", 400, 15);
  }
  if (animacionPuntoComputadora && millis() - tiempoAnimacionComputadora < 1000) {
    text("+1", 400, 35);
  }

  if (mostrarPunto && millis() - tiempoPunto < 1000) {
    textSize(48);
    textAlign(CENTER, CENTER);
    text("PUNTO!", GAME_WIDTH / 2, GAME_HEIGHT / 2);
  }

  if (juegoTerminado) {
    textSize(36);
    fill(255);
    textAlign(CENTER, CENTER);
    text(mensajeGanador, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
    text("Final del partido", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
    noLoop();
    return;
  }

  if (seleccionNivel) return;

  if (puntajeJugador >= 5 && !juegoTerminado) {
    juegoTerminado = true;
    mensajeGanador = "Ganó Jugador";
    sonidoFinal.play();
  } else if (puntajeComputadora >= 5 && !juegoTerminado) {
    juegoTerminado = true;
    mensajeGanador = "Ganó Computadora";
    sonidoFinal.play();
  }

  dibujarPelota();

  pelota.x += pelota.velocidadX;
  pelota.y += pelota.velocidadY;

  if (pelota.y - pelota.diametro / 2 < marcoSuperior.alto) pelota.velocidadY *= -1;
  if (pelota.y + pelota.diametro / 2 > GAME_HEIGHT - marcoInferior.alto) pelota.velocidadY *= -1;

  dibujarRaqueta(raquetaJugador);
  dibujarRaqueta(raquetaComputadora);

  if (keyIsDown(UP_ARROW)) raquetaJugador.y -= 5;
  if (keyIsDown(DOWN_ARROW)) raquetaJugador.y += 5;
  raquetaJugador.y = constrain(raquetaJugador.y, marcoSuperior.alto, GAME_HEIGHT - marcoInferior.alto - raquetaJugador.alto);

  // IA mejorada
  let centroPelota = pelota.y;
  let centroRaqueta = raquetaComputadora.y + raquetaComputadora.alto / 2;
  if (centroPelota < centroRaqueta - 10) {
    raquetaComputadora.y -= velocidadComputadora;
  } else if (centroPelota > centroRaqueta + 10) {
    raquetaComputadora.y += velocidadComputadora;
  }
  raquetaComputadora.y = constrain(raquetaComputadora.y, marcoSuperior.alto, GAME_HEIGHT - marcoInferior.alto - raquetaComputadora.alto);

  // Rebotes realistas
  if (pelota.x - pelota.diametro / 2 < raquetaJugador.x + raquetaJugador.ancho && pelota.y > raquetaJugador.y && pelota.y < raquetaJugador.y + raquetaJugador.alto) {
    pelota.velocidadX *= -1;
    let impacto = (pelota.y - (raquetaJugador.y + raquetaJugador.alto / 2)) / (raquetaJugador.alto / 2);
    pelota.velocidadY = 5 * impacto;
    sonidoGolpe.play();
  }

  if (pelota.x + pelota.diametro / 2 > raquetaComputadora.x && pelota.y > raquetaComputadora.y && pelota.y < raquetaComputadora.y + raquetaComputadora.alto) {
    pelota.velocidadX *= -1;
    let impacto = (pelota.y - (raquetaComputadora.y + raquetaComputadora.alto / 2)) / (raquetaComputadora.alto / 2);
    pelota.velocidadY = 5 * impacto;
    sonidoGolpe.play();
  }

  if (pelota.x < 0) {
    puntajeComputadora++;
    pelota.velocidadX *= -1;
    mostrarPunto = true;
    tiempoPunto = millis();
    animacionPuntoComputadora = true;
    tiempoAnimacionComputadora = millis();
    if (puntajeComputadora < 5) sonidoPublico.play();
  }
  if (pelota.x > GAME_WIDTH) {
    puntajeJugador++;
    pelota.velocidadX *= -1;
    mostrarPunto = true;
    tiempoPunto = millis();
    animacionPuntoJugador = true;
    tiempoAnimacionJugador = millis();
    if (puntajeJugador < 5) sonidoPublico.play();
  }
}

function dibujarRaqueta(raqueta) {
  if (spriteRaqueta) {
    image(spriteRaqueta, raqueta.x, raqueta.y, raqueta.ancho * 4, raqueta.alto);
  } else {
    fill(255);
    ellipse(raqueta.x + raqueta.ancho / 2, raqueta.y + raqueta.alto / 3, raqueta.ancho * 4, raqueta.alto / 1.5);
    rect(raqueta.x + raqueta.ancho / 2 - 2, raqueta.y + raqueta.alto / 3, 4, raqueta.alto / 1.8);
  }
}

function dibujarPelota() {
  if (spritePelota) {
    image(spritePelota, pelota.x - 10, pelota.y - 10, 20, 20);
  } else {
    fill(173, 255, 85);
    ellipse(pelota.x, pelota.y, pelota.diametro);
    stroke(255);
    strokeWeight(2);
    noFill();
    arc(pelota.x, pelota.y, pelota.diametro, pelota.diametro, PI / 4, PI + PI / 4);
    arc(pelota.x, pelota.y, pelota.diametro, pelota.diametro, -PI / 4, PI - PI / 4);
    noStroke();
  }
}


