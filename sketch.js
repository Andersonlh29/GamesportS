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

let botonFacil, botonMedio, botonDificil;

let sonidoGolpe;
let sonidoPublico;
let sonidoFinal;

function preload() {
  sonidoGolpe = loadSound('tennis-ball-hit-151257.mp3');
  sonidoPublico = loadSound('crowd-clapping-and-cheering-effect-272056.mp3');
  sonidoFinal = loadSound('fanfare-1-276819.mp3');
  fuenteLED = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(fuenteLED);
  crearBotones();
  inicializarElementos();
}

function inicializarElementos() {
  pelota = { x: width / 2, y: height / 2, diametro: 20, velocidadX: 5, velocidadY: 3 };
  raquetaJugador = { x: 5, y: height / 2 - 40, ancho: 10, alto: 80 };
  raquetaComputadora = { x: width - 15, y: height / 2 - 40, ancho: 10, alto: 80 };
  marcoSuperior = { alto: 60 };
  marcoInferior = { alto: 10 };
  tiempoInicio = millis();
}

function crearBotones() {
  let centroX = width / 2 - 40;
  let centroY = height / 2 - 70;

  botonFacil = createButton("Fácil");
  botonFacil.position(centroX, centroY);
  botonFacil.size(80, 40);
  botonFacil.style('background-color', '#228B22');
  botonFacil.style('color', 'white');
  botonFacil.style('border', '2px solid white');
  botonFacil.mousePressed(() => seleccionarNivel(1));

  botonMedio = createButton("Medio");
  botonMedio.position(centroX, centroY + 100);
  botonMedio.size(80, 40);
  botonMedio.style('background-color', '#228B22');
  botonMedio.style('color', 'white');
  botonMedio.style('border', '2px solid white');
  botonMedio.mousePressed(() => seleccionarNivel(2));

  botonDificil = createButton("Difícil");
  botonDificil.position(centroX, centroY + 200);
  botonDificil.size(80, 40);
  botonDificil.style('background-color', '#228B22');
  botonDificil.style('color', 'white');
  botonDificil.style('border', '2px solid white');
  botonDificil.mousePressed(() => seleccionarNivel(3));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (seleccionNivel) {
    let centroX = width / 2 - 40;
    let centroY = height / 2 - 70;
    botonFacil.position(centroX, centroY);
    botonMedio.position(centroX, centroY + 100);
    botonDificil.position(centroX, centroY + 200);
  }

  raquetaComputadora.x = width - 15;
  pelota.x = width / 2;
}

function seleccionarNivel(nivel) {
  velocidadComputadora = nivel === 1 ? 1.5 : nivel === 2 ? 2.5 : 3;
  seleccionNivel = false;
  botonFacil.hide();
  botonMedio.hide();
  botonDificil.hide();
  tiempoInicio = millis();
}

function draw() {
  background(34, 139, 34);
  stroke(255);
  strokeWeight(4);
  line(width / 2, marcoSuperior.alto, width / 2, height - marcoInferior.alto);
  line(0, marcoSuperior.alto, width, marcoSuperior.alto);
  line(0, height - marcoInferior.alto, width, height - marcoInferior.alto);
  noStroke();
  fill(0);
  rect(0, 0, width, marcoSuperior.alto);
  fill(0, 255, 0);
  textSize(18);
  textAlign(CENTER, CENTER);
  let tiempoTranscurrido = int((millis() - tiempoInicio) / 1000);
  let minutos = nf(int(tiempoTranscurrido / 60), 2);
  let segundos = nf(tiempoTranscurrido % 60, 2);
  text("TIEMPO", width / 2, 15);
  text(`${minutos}:${segundos}`, width / 2, 35);
  text(`Jugador: ${puntajeJugador}`, width / 4, 35);
  if (animacionPuntoJugador && millis() - tiempoAnimacionJugador < 1000) {
    text("+1", width / 4 + 70, 35);
  }
  text(`Computadora: ${puntajeComputadora}`, 3 * width / 4, 35);
  if (animacionPuntoComputadora && millis() - tiempoAnimacionComputadora < 1000) {
    text("+1", 3 * width / 4 + 90, 35);
  }
  if (mostrarPunto && millis() - tiempoPunto < 1000) {
    textSize(48);
    text("PUNTO!", width / 2, height / 2);
  }
  if (juegoTerminado) {
    textSize(36);
    fill(255);
    text(mensajeGanador, width / 2, height / 2 - 20);
    text("Final del partido", width / 2, height / 2 + 20);
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
  if (pelota.y + pelota.diametro / 2 > height - marcoInferior.alto) pelota.velocidadY *= -1;

  dibujarRaqueta(raquetaJugador);
  dibujarRaqueta(raquetaComputadora);

  if (keyIsDown(UP_ARROW)) raquetaJugador.y -= 5;
  if (keyIsDown(DOWN_ARROW)) raquetaJugador.y += 5;
  raquetaJugador.y = constrain(raquetaJugador.y, marcoSuperior.alto, height - marcoInferior.alto - raquetaJugador.alto);

  if (pelota.y < raquetaComputadora.y + raquetaComputadora.alto / 2) raquetaComputadora.y -= velocidadComputadora;
  else raquetaComputadora.y += velocidadComputadora;
  raquetaComputadora.y = constrain(raquetaComputadora.y, marcoSuperior.alto, height - marcoInferior.alto - raquetaComputadora.alto);

  if (pelota.x - pelota.diametro / 2 < raquetaJugador.x + raquetaJugador.ancho && pelota.y > raquetaJugador.y && pelota.y < raquetaJugador.y + raquetaJugador.alto) {
    pelota.velocidadX *= -1;
    sonidoGolpe.play();
  }
  if (pelota.x + pelota.diametro / 2 > raquetaComputadora.x && pelota.y > raquetaComputadora.y && pelota.y < raquetaComputadora.y + raquetaComputadora.alto) {
    pelota.velocidadX *= -1;
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
  if (pelota.x > width) {
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
  fill(255);
  ellipse(raqueta.x + raqueta.ancho / 2, raqueta.y + raqueta.alto / 3, raqueta.ancho * 4, raqueta.alto / 1.5);
  rect(raqueta.x + raqueta.ancho / 2 - 2, raqueta.y + raqueta.alto / 3, 4, raqueta.alto / 1.8);
}

function dibujarPelota() {
  fill(173, 255, 47);
  ellipse(pelota.x, pelota.y, pelota.diametro);
  stroke(255);
  strokeWeight(2);
  noFill();
  arc(pelota.x, pelota.y, pelota.diametro, pelota.diametro, PI / 4, PI + PI / 4);
  arc(pelota.x, pelota.y, pelota.diametro, pelota.diametro, -PI / 4, PI - PI / 4);
  noStroke();
}
