const FPSSimulazione = 20;

const parametriRelais = {
    margineContatti: 0.3
};

var statoSimulazioneTensioni = {
    enti: {},
    cavi: {}
};
var statoSimulazioneEnti = {};

var stileSelezionato = 0;

var visuale = {
    x: 800,
    y: 300,
    scala: 40
}



const tempoCommutazione = 0.5;
const tempoCronometrico = 10.0;



var comando = "TESTOINIZIALE";
var idEnteSelezionato = null;
var idCavoSelezionato = null;
var nomeInScrittura = "";
var parametriInScrittura = {};
var filoInScrittura = [];

var ultimoMouseNoto = {
    x: 0,
    y: 0
}


function avvio() {
    const cnv = document.getElementById("cnv");
    cnv.style.margin = 0;
    cnv.style.padding = 0;
    cnv.style.position = "absolute";
    cnv.style.top = 0;
    cnv.style.left = 0;
    ridimensiona();
    window.requestAnimationFrame(disegna);
}

function ridimensiona() {
    const cnv = document.getElementById("cnv");
    const w = window.innerWidth;
    const h = window.innerHeight;
    cnv.width = w;
    cnv.height = h;
    cnv.style.width = w + "px";
    cnv.style.height = h + "px";
    const ctx = cnv.getContext("2d");
    ctx.width = w;
    ctx.height = h;
}

function disegna() {
    const lampeggio = new Date().getMilliseconds() % 250 >= 125;

    const cnv = document.getElementById("cnv");
    const ctx = cnv.getContext("2d");
    const stile = stili[stileSelezionato];
    ctx.lineWidth = stile.spessoreLinee;
    const w = ctx.width;
    const h = ctx.height;

    ctx.fillStyle = stile.sfondo;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = stile.linee;
    ctx.strokeStyle = stile.linee;

    ctx.setTransform(visuale.scala, 0, 0, visuale.scala, visuale.x, visuale.y);

    ctx.font = stile.dimensioneTesto + "px monospace";

    for (let idEnte in schema.enti) {
        if (idEnte == idEnteSelezionato && !lampeggio) {
            continue;
        }
        const ente = schema.enti[idEnte];
        prototipiEnti[ente.tipo].disegna(ctx, ente.x, ente.y, ente.parametri, idEnte);
        const nomeDaScrivere = ente.nome.includes(".") ? ente.nome.split(".")[1] : ente.nome;
        disegnaNomeEnte(ctx, ente.x, ente.y, nomeDaScrivere, ente.tipo);
        ctx.strokeStyle = stili[stileSelezionato].linee;
        ctx.fillStyle = stili[stileSelezionato].linee;
    }
    for (let j in schema.cavi) {
        if (j == idCavoSelezionato && !lampeggio) {
            continue;
        }
        disegnaCavo(ctx, schema.cavi[j], { tensione: statoSimulazioneTensioni.cavi[j] != undefined ? statoSimulazioneTensioni.cavi[j].tensione : 0 });
    }

    const comandoArray = comando.split("/");
    const xMouseRound = Math.round(convertiMouseX(ultimoMouseNoto.x));
    const yMouseRound = Math.round(convertiMouseY(ultimoMouseNoto.y));
    switch (comandoArray[0]) {
        case "nuovo":
            prototipiEnti[comandoArray[1]].disegna(ctx, xMouseRound, yMouseRound, parametriInScrittura, null);
            disegnaNomeEnte(ctx, xMouseRound, yMouseRound, nomeInScrittura, comandoArray[1]);
            break;
        case "filoUnifilare":
            disegnaCavo(ctx, filoInScrittura, { lampeggio: lampeggio, puntoInCostruzione: { x: xMouseRound, y: yMouseRound } });
            break;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    aggiornaRigoComando(lampeggio);

    window.requestAnimationFrame(disegna);
}

function disegnaNomeEnte(ctx, x, y, nome, tipo) {
    ctx.textAlign = "center";
    ctx.textBaseline = "hanging";
    const metaLarghezzaTesto = stili[stileSelezionato].dimensioneTesto * (nome.length - 1) * 0.28;
    let ySottolineatura = stili[stileSelezionato].dimensioneTesto * 0.9;
    let xInizioSottolineatura = -metaLarghezzaTesto;
    let xFineSottolineatura = metaLarghezzaTesto;
    if (tipo.includes("relais")) {
        x += 0;
        y += 0.6;
    } else if (tipo == "maniglia") {
        y += 0.3;
    } else if (tipo == "tasto") {
        y += 0.6;
    } else if (tipo == "alimentazione") {
        y -= 1.2;
    } else if (tipo == "contattoSemplice") {
        x += 0.6;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ySottolineatura = stili[stileSelezionato].dimensioneTesto * 0.35;
        xInizioSottolineatura = 0;
        xFineSottolineatura = 2 * metaLarghezzaTesto;
    } else if (1) {
        // todo posizione testo
    }
    if (nome[nome.length - 1] === "_") {
        nome = nome.slice(0, -1);
        ctx.beginPath();
        ctx.moveTo(x + xInizioSottolineatura, y + ySottolineatura);
        ctx.lineTo(x + xFineSottolineatura, y + ySottolineatura);
        ctx.stroke();
    }
    ctx.fillText(nome, x, y);
}

function disegnaCavo(ctx, arrayCoordinate, parametri = {}) {
    const lampeggio = parametri.lampeggio === undefined ? true : parametri.lampeggio;
    const puntoInCostruzione = parametri.puntoInCostruzione === undefined ? null : parametri.puntoInCostruzione;
    const tensione = parametri.tensione === undefined ? 0 : parametri.tensione;

    if (tensione) {
        ctx.strokeStyle = stili[stileSelezionato].tensione;
    }

    let xyPrincipali = [];
    for (let j in arrayCoordinate) {
        const coord = arrayCoordinate[j];
        xyPrincipali.push(trovaCoordinatePuntoFilo(coord));
    }
    if (lampeggio && puntoInCostruzione !== null) {
        xyPrincipali.push(puntoInCostruzione);
    }
    let xy = [];
    for (let j = 0; j < xyPrincipali.length; j++) {
        if (xyPrincipali.length < 2) {
            return;
        }
        if (j && (xyPrincipali.length - j - 1) && (xyPrincipali[j - 1].x != xyPrincipali[j + 1].x) && (xyPrincipali[j - 1].y != xyPrincipali[j + 1].y)) {
            xy.push({
                x: xyPrincipali[j].x + 0.2 * Math.sign(xyPrincipali[j - 1].x - xyPrincipali[j].x),
                y: xyPrincipali[j].y + 0.2 * Math.sign(xyPrincipali[j - 1].y - xyPrincipali[j].y)
            });
            xy.push({
                x: xyPrincipali[j].x + 0.2 * Math.sign(xyPrincipali[j + 1].x - xyPrincipali[j].x),
                y: xyPrincipali[j].y + 0.2 * Math.sign(xyPrincipali[j + 1].y - xyPrincipali[j].y)
            });
        } else {
            xy.push({
                x: xyPrincipali[j].x,
                y: xyPrincipali[j].y
            });
        }
    }
    if (xy.length < 2) {
        return;
    }
    ctx.beginPath();
    ctx.moveTo(xy[0].x, xy[0].y);
    for (let punto of xy) {
        ctx.lineTo(punto.x, punto.y);
    }
    ctx.stroke();

    ctx.strokeStyle = stili[stileSelezionato].linee;
}


function mouseMove(e) {
    if (e.buttons === 1) {
        visuale.x += e.movementX;
        visuale.y += e.movementY;
    }
    ultimoMouseNoto.x = e.clientX;
    ultimoMouseNoto.y = e.clientY;
}

function mouseWheel(e) {
    const cnv = document.getElementById("cnv");
    const scalaPrecedente = visuale.scala;
    //visuale.scala *= Math.pow(1.1, -e.deltaY / 50);
    visuale.scala *= 1 + e.deltaY * (-0.001);
    //const deltaScala = scalaPrecedente - visuale.scala;
    //visuale.x += (e.clientX - (cnv.getBoundingClientRect().left + cnv.getBoundingClientRect().width / 2)) * deltaScala / visuale.scala;
    //visuale.y += (e.clientY - (cnv.getBoundingClientRect().top + cnv.getBoundingClientRect().height / 2)) * deltaScala / visuale.scala;
    visuale.x += (e.x - (cnv.getBoundingClientRect().left + cnv.getBoundingClientRect().width / 2)) * e.deltaY * -0.001 / visuale.scala;
    visuale.y += (e.y - (cnv.getBoundingClientRect().top + cnv.getBoundingClientRect().height / 2)) * e.deltaY * -0.001 / visuale.scala;
    visuale.scala = Math.min(Math.max(1, visuale.scala), 1000);
}

function tastiera(e) {
    const comandoArray = comando.split("/");
    switch (comandoArray[0]) {
        case "nuovo":
            switch (e.key) {
                case "Escape":
                    if (nomeInScrittura.length) {
                        nomeInScrittura = "";
                        parametriInScrittura = {};
                    } else {
                        comando = "";
                    }
                    idEnteSelezionato = null;
                    idCavoSelezionato = null;
                    break;
                case "Backspace":
                    nomeInScrittura = nomeInScrittura.slice(0, -1);
                    break;
                case "PageUp":
                    switch (comandoArray[1]) {
                        case "contattoSemplice":
                        case "contattoDeviatore":
                            if (parametriInScrittura.contatti != "alti") {
                                parametriInScrittura.contatti = "alti";
                            } else {
                                parametriInScrittura.contatti = "bassi";
                            }
                            break;
                        case "relaisPolarizzato":
                            if (parametriInScrittura.polaritaInvertita == undefined) {
                                parametriInScrittura.polaritaInvertita = true;
                            } else {
                                delete parametriInScrittura.polaritaInvertita;
                            }
                            break;
                    }
                    break;
                case "PageDown":
                    switch (comandoArray[1]) {
                        case "contattoSemplice":
                        case "contattoDeviatore":
                            if (parametriInScrittura.contatti != "bassi") {
                                parametriInScrittura.contatti = "bassi";
                            } else {
                                parametriInScrittura.contatti = "alti";
                            }
                            break;
                        case "relaisPolarizzato":
                            if (parametriInScrittura.polaritaInvertita == undefined) {
                                parametriInScrittura.polaritaInvertita = true;
                            } else {
                                delete parametriInScrittura.polaritaInvertita;
                            }
                            break;
                    }
                    break;
                default:
                    if (e.key.length != 1) {
                        break;
                    }
                    nomeInScrittura = nomeInScrittura + e.key;
                    break;
            }
            break;
        default:
            nomeInScrittura = "";
            parametriInScrittura = {};
            switch (e.code) {
                case "Escape":
                    comando = "";
                    idEnteSelezionato = null;
                    idCavoSelezionato = null;
                    filoInScrittura = [];
                    break;
                case "Delete":
                    if (idEnteSelezionato !== null) {
                        cancellaEnte(idEnteSelezionato);
                    } else if (idCavoSelezionato !== null) {
                        cancellaCavo(idCavoSelezionato);
                    }
                    break;
                case "KeyN":
                    comando = "nuovo/relaisNeutro";
                    break;
                case "KeyM":
                    comando = "nuovo/relaisCombinatore";
                    break;
                case "KeyB":
                    comando = "nuovo/relaisStabilizzato";
                    break;
                case "KeyV":
                    comando = "nuovo/relaisPolarizzato";
                    break;
                case "KeyC":
                    comando = "nuovo/relaisCronometrico";
                    break;
                case "KeyX":
                    comando = "nuovo/relaisLampeggiatore";
                    break;
                case "KeyZ":
                    comando = "nuovo/relaisBattitoreDiCodice";
                    break;
                case "KeyT":
                    comando = "nuovo/tasto";
                    break;
                case "KeyY":
                    comando = "nuovo/maniglia"; // TODO
                    break;
                case "KeyA":
                    comando = "nuovo/alimentazione";
                    break;
                case "KeyS":
                    comando = "nuovo/contattoSemplice";
                    break;
                case "KeyD":
                    comando = "nuovo/contattoDeviatore";
                    break;
                case "KeyF":
                    comando = "filoUnifilare";
                    coordinateFiloInScrittura = [];
                    break;
                case "KeyJ":
                    comando = "nuovo/inversione";
                    coordinateFiloInScrittura = [];
                    break;
                case "Home":
                    if (comando == "" || comando == "TESTOINIZIALE") {
                        stileSelezionato--;
                        if (stileSelezionato < 0) {
                            stileSelezionato = stili.length - 1;
                        }
                    }
                    break;
                case "End":
                    if (comando == "" || comando == "TESTOINIZIALE") {
                        stileSelezionato++;
                        if (stileSelezionato >= stili.length) {
                            stileSelezionato = 0;
                        }
                    }
                    break;
            }
            if (e.key == "?") {
                comando = "AIUTO";
            }
            break;
    }

    if (comando.includes("nuovo/")) {
        coordinateFiloInScrittura = [];
    }
}

function cancellaEnte(id) {
    for (let jdCavo in schema.cavi) {
        for (let jj in schema.cavi[jdCavo]) {
            if (schema.cavi[jdCavo][jj].tipo == "morsetto") {
                if (schema.cavi[jdCavo][jj].ente == id) {
                    delete schema.cavi[jdCavo]; // todo quando si produrrà un json, occorrerà fare un "newArray = originalArray.filter(x => x !== null)"
                    break;
                }
            }
        }
    }
    for (let jd in statoSimulazioneTensioni.cavi) {
        delete statoSimulazioneTensioni.cavi[jd];
    }
    delete statoSimulazioneEnti[id];
    delete schema.enti[id];
}

function cancellaCavo(id) {
    delete schema.cavi[id];
}

function aggiornaRigoComando(lampeggio = true) {
    const scritturaInCorso = lampeggio ? "_" : "";
    var rigoComando = "";
    const comandoArray = comando.split("/");
    switch (comandoArray[0]) {
        case "TESTOINIZIALE":
            rigoComando = "JSCHEMI - SIMULAZIONE SCHEMI I.S. - 2024 AGNELLO - PREMERE [?] PER AIUTO";
            break;
        case "AIUTO":
            rigoComando = "\
            POSA NUOVO:<br>\
            [T] - TASTO<br>\
            [Y] - MANIGLIA<br>\
            [A] - ALIMENTAZIONE<br>\
            [S] - CONTATTO SEMPLICE<br>\
            [D] - CONTATTO A DEVIATORE<br>\
            [F] - FILO (UNIFILARE)<br>\
            [J] - INVERSIONE POLARITÀ<br>\
            ......RELAIS:<br>\
            [Z] - BATTITORE DI CODICE<br>\
            [X] - LAMPEGGIATORE<br>\
            [C] - CRONOMETRICO<br>\
            [V] - POLARIZZATO<br>\
            [B] - STABILIZZATO<br>\
            [N] - NEUTRO<br>\
            [M] - COMBINATORE<br>\
            <br>\
            [ESC] - ANNULLA<br>\
            [CANC] - CANCELLA SELEZIONATO<br>\
            ";
            break;
        case "nuovo":
            rigoComando = "NUOVO";
            switch (comandoArray[1]) {
                case "relaisNeutro":
                    rigoComando += " - RELAIS NEUTRO";
                    break;
                case "relaisCombinatore":
                    rigoComando += " - RELAIS COMBINATORE";
                    break;
                case "relaisStabilizzato":
                    rigoComando += " - RELAIS STABILIZZATO";
                    break;
                case "relaisPolarizzato":
                    rigoComando += " - RELAIS POLARIZZATO";
                    break;
                case "relaisCronometrico":
                    rigoComando += " - RELAIS CRONOMETRICO";
                    break;
                case "relaisLampeggiatore":
                    rigoComando += " - RELAIS LAMPEGGIATORE";
                    break;
                case "relaisBattitoreDiCodice":
                    rigoComando += " - RELAIS BATTITORE DI CODICE";
                    break;
                case "tasto":
                    rigoComando += " - TASTO";
                    break;
                case "maniglia":
                    rigoComando += " - MANIGLIA";
                    break;
                case "alimentazione":
                    rigoComando += " - ALIMENTAZIONE";
                    break;
                case "contattoSemplice":
                    rigoComando += " - CONTATTO SEMPLICE";
                    break;
                case "contattoDeviatore":
                    rigoComando += " - CONTATTO DEVIATORE";
                    break;
                case "inversione":
                    rigoComando += " - INVERSIONE POLARITÀ";
                    break;
            }
            rigoComando += " - NOME: " + nomeInScrittura + scritturaInCorso;
            break;
        case "filoUnifilare":
            rigoComando = "FILO CONDUTTORE";
            break;
    }
    document.getElementById("pComando").innerHTML = rigoComando;
}

function mouseDown(e) {
    e.preventDefault();
    const ultimoIdEnteSelezionato = idEnteSelezionato;
    const x = Math.round(convertiMouseX(ultimoMouseNoto.x));
    const y = Math.round(convertiMouseY(ultimoMouseNoto.y));
    const xFloat = convertiMouseX(ultimoMouseNoto.x);
    const yFloat = convertiMouseY(ultimoMouseNoto.y);
    const dx = xFloat - x;
    const dy = yFloat - y;

    const comandoArray = comando.split("/");
    switch (comandoArray[0]) {
        case "nuovo":
            schema.enti.push({
                tipo: comandoArray[1],
                x: x,
                y: y,
                nome: (comandoArray[1] == "tasto" || comandoArray[1] == "maniglia" ? "t." : "") + nomeInScrittura,
                parametri: copiaOggetto(parametriInScrittura)
            });
            break;
        case "":
            idEnteSelezionato = null;
            idCavoSelezionato = null;
            for (let idEnte in schema.enti) {
                const ente = schema.enti[idEnte];
                if (ente.x == x && ente.y == y) {
                    idEnteSelezionato = idEnte;
                    if (e.buttons == 4) {
                        if (schema.enti[idEnteSelezionato].tipo == "tasto") {
                            if (e.shiftKey || e.ctrlKey || e.altKey) {
                                statoSimulazioneEnti[idEnteSelezionato].posizione = "E";
                            } else if (e.buttons == 4) {
                                statoSimulazioneEnti[idEnteSelezionato].posizione = "P";
                            }
                        } else if (schema.enti[idEnteSelezionato].tipo == "maniglia") {
                            if (statoSimulazioneEnti[idEnteSelezionato].posizione != "N") {
                                statoSimulazioneEnti[idEnteSelezionato].posizione = "N";
                            } else {
                                if (dx < 0) {
                                    statoSimulazioneEnti[idEnteSelezionato].posizione = "S";
                                } else {
                                    statoSimulazioneEnti[idEnteSelezionato].posizione = "D";
                                }
                            }
                        }
                        idEnteSelezionato = null;
                    }
                    console.log(e);
                    break;
                }
            }
            if (idEnteSelezionato === null) {
                for (let jdCavo in schema.cavi) {
                    const cavo = schema.cavi[jdCavo];
                    const massimaDistanzaDaCavoPerSelezione = 0.3;
                    for (let j = 1; j < Object.keys(cavo).length; j++) {
                        if (massimaDistanzaDaCavoPerSelezione >= calcolaDistanzaPuntoSegmento({ x: xFloat, y: yFloat }, trovaCoordinatePuntoFilo(cavo[j - 1]), trovaCoordinatePuntoFilo(cavo[j]))) {
                            idCavoSelezionato = jdCavo;
                        }
                    }
                }
            }
            break;
        case "filoUnifilare":
            idEnteSelezionato = null;
            idCavoSelezionato = null;
            for (let idEnte in schema.enti) {
                const ente = schema.enti[idEnte];
                if (ente.x == x && ente.y == y) {
                    idEnteSelezionato = idEnte;
                    break;
                }
            }
            var nuovoPunto;
            if (idEnteSelezionato === null) {
                nuovoPunto = {
                    tipo: "xy",
                    x: x,
                    y: y
                };
            } else {
                let idMorsetto = Object.keys(prototipiEnti[schema.enti[idEnteSelezionato].tipo].morsetti)[0];
                if (idMorsetto == undefined) {
                    break;
                }
                switch (schema.enti[idEnteSelezionato].tipo) {
                    case "relaisCombinatore":
                        if (dx > 0) {
                            idMorsetto = "unifilareRovescio";
                        } else {
                            idMorsetto = "unifilareNormale";
                        }
                        break;
                    case "relaisStabilizzato":
                        if (dx > 0) {
                            idMorsetto = "unifilareDiseccita";
                        } else {
                            idMorsetto = "unifilareEccita";
                        }
                        break;
                    case "contattoSemplice":
                    case "inversione":
                        if (dy > 0) {
                            idMorsetto = "b";
                        } else {
                            idMorsetto = "a";
                        }
                        break;
                }
                nuovoPunto = {
                    tipo: "morsetto",
                    ente: idEnteSelezionato,
                    morsetto: idMorsetto
                };
            }
            if (filoInScrittura.length >= 2) {
                const ultimoPuntoInScrittura = filoInScrittura[filoInScrittura.length - 1];
                if (oggettiSonoUguali(ultimoPuntoInScrittura, nuovoPunto)) {
                    schema.cavi.push(copiaOggetto(filoInScrittura));
                    filoInScrittura = [];
                } else {
                    filoInScrittura.push(nuovoPunto);
                }
            } else {
                filoInScrittura.push(nuovoPunto);
            }
            idEnteSelezionato = null;
            break;
        case "TESTOINIZIALE":
            idEnteSelezionato = null;
            idCavoSelezionato = null;
            comando = "";
            break;
    }
    if (!comando.includes("nuovo") && idEnteSelezionato == ultimoIdEnteSelezionato && idEnteSelezionato != null) {
        const ente = schema.enti[idEnteSelezionato];
        comando = "nuovo/" + ente.tipo;
        nomeInScrittura = ente.nome;
        parametriInScrittura = ente.parametri;
        cancellaEnte(idEnteSelezionato);
        idEnteSelezionato = null;
    }
}

function mouseUp(e) {
    riportaTuttiTastiNormali();
}

function mouseOut(e) {
    riportaTuttiTastiNormali();
}

function riportaTuttiTastiNormali() {
    for (let id in statoSimulazioneEnti) {
        if (schema.enti[id].tipo == "tasto") {
            statoSimulazioneEnti[id].posizione = "N";
        }
    }
}


document.addEventListener("DOMContentLoaded", avvio);
window.addEventListener("resize", ridimensiona);
window.addEventListener("mousemove", mouseMove);
window.addEventListener("wheel", mouseWheel);
window.addEventListener("keydown", tastiera);
window.addEventListener("mousedown", mouseDown);
window.addEventListener("mouseup", mouseUp);
window.addEventListener("mouseout", mouseOut)
window.setInterval(simula, 1000 / FPSSimulazione);