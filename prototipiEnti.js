const prototipiEnti = {
    tasto: {
        morsetti: {},
        disegna: (ctx, x, y, parametri, idEnte) => {
            const posizione = statoSimulazioneEnti[idEnte] == undefined || statoSimulazioneEnti[idEnte].posizione == undefined ? "N" : statoSimulazioneEnti[idEnte].posizione;
            ctx.beginPath();
            ctx.arc(x, y, 0.35, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 0.15, 0, 2 * Math.PI);
            ctx.stroke();
            if (posizione == "P") {
                ctx.fill();
            } else if (posizione == "E") {
                ctx.beginPath();
                ctx.arc(x, y, 0.35, 0, 2 * Math.PI);
                ctx.arc(x, y, 0.15, 0, 2 * Math.PI, true);
                ctx.fill();
            }
        }
    },
    maniglia: {
        morsetti: {},
        disegna: (ctx, x, y, parametri, idEnte) => {
            const posizione = statoSimulazioneEnti[idEnte] == undefined || statoSimulazioneEnti[idEnte].posizione == undefined ? "N" : statoSimulazioneEnti[idEnte].posizione;
            ctx.beginPath();
            ctx.arc(x, y, 0.1, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x, y);
            switch (posizione) {
                case "N":
                    ctx.lineTo(x, y - 0.5);
                    break;
                case "S":
                    ctx.lineTo(x - 0.5, y);
                    break;
                case "D":
                    ctx.lineTo(x + 0.5, y);
                    break;
            }
            ctx.stroke();
        }
    },
    relaisCombinatore: {
        morsetti: {
            unifilareNormale: { x: -1, y: 0 },
            unifilareRovescio: { x: 1, y: 0 }
        },
        disegna: (ctx, x, y, parametri, idEnte) => {
            ctx.beginPath();
            ctx.moveTo(x - 0.05, y);
            ctx.arc(x - 0.525, y, 0.45, 0, 2 * Math.PI);
            ctx.moveTo(x + 0.05, y);
            ctx.arc(x + 0.525, y, 0.45, Math.PI, 3 * Math.PI);
            ctx.moveTo(x - 0.1817, y - 0.3182);
            ctx.lineTo(x + 0.1817, y + 0.3182);
            ctx.moveTo(x + 0.1817, y - 0.3182);
            ctx.lineTo(x - 0.1817, y + 0.3182);
            ctx.stroke();
        }
    },
    relaisNeutro: {
        morsetti: {
            unifilare: { x: 0, y: -0.5 }
        },
        disegna: (ctx, x, y, parametri, idEnte) => {
            try {
                if (statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.unifilare) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            ctx.beginPath();
            ctx.moveTo(x - 0.5, y - 0.5);
            ctx.lineTo(x + 0.5, y - 0.5);
            ctx.moveTo(x - 0.5, y + 0.5);
            ctx.lineTo(x + 0.5, y + 0.5);
            ctx.moveTo(x + 0.5, y);
            ctx.arc(x, y, 0.5, 0, 2 * Math.PI);
            ctx.stroke();
            try {
                if (statoSimulazioneEnti[idEnte].ancora > 0.5) {
                    ctx.fillStyle = stili[stileSelezionato].tensione; // Colore testo
                } else {
                    ctx.fillStyle = stili[stileSelezionato].linee;
                    ctx.strokeStyle = stili[stileSelezionato].linee;
                }
            } catch (e) { }
        }
    },
    relaisStabilizzato: {
        morsetti: {
            unifilareEccita: { x: -0.5, y: 0 },
            unifilareDiseccita: { x: 0.5, y: 0 }
        },
        disegna: (ctx, x, y, parametri, idEnte) => {
            ctx.beginPath();
            ctx.moveTo(x - 0.5, y - 0.5);
            ctx.lineTo(x + 0.5, y - 0.5);
            ctx.moveTo(x - 0.5, y + 0.5);
            ctx.lineTo(x + 0.5, y + 0.5);
            ctx.moveTo(x + 0.5, y);
            ctx.arc(x, y, 0.5, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y - 0.5);
            ctx.arc(x, y, 0.5, -0.5 * Math.PI, 0.5 * Math.PI);
            ctx.fill();
        }
    },
    relaisPolarizzato: {
        morsetti: {
            unifilare: { x: 0, y: -0.5 }
        },
        disegna: (ctx, x, y, parametri, idEnte) => {
            try {
                if (Math.sign(statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti["unifilare"]) == (schema.enti[idEnte].parametri.polaritaInvertita ? -1 : 1)) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                    ctx.fillStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            const senso = parametri.polaritaInvertita == undefined ? 1 : -1;
            ctx.beginPath();
            ctx.moveTo(x - 0.5, y - 0.5);
            ctx.lineTo(x + 0.5, y - 0.5);
            ctx.moveTo(x - 0.5, y + 0.5);
            ctx.lineTo(x + 0.5, y + 0.5);
            ctx.moveTo(x + 0.5, y);
            ctx.arc(x, y, 0.5, 0, 2 * Math.PI);
            ctx.moveTo(x + 0.2 * senso, y - 0.2);
            ctx.lineTo(x + 0.2 * senso, y + 0.2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x - 0.2 * senso, y - 0.2);
            ctx.lineTo(x - 0.2 * senso, y + 0.2);
            ctx.lineTo(x + 0.2 * senso, y);
            ctx.fill();
            try {
                if (statoSimulazioneEnti[idEnte].ancora > 0.5) {
                    ctx.fillStyle = stili[stileSelezionato].tensione; // Colore testo
                } else {
                    ctx.fillStyle = stili[stileSelezionato].linee;
                    ctx.strokeStyle = stili[stileSelezionato].linee;
                }
            } catch (e) { }
        }
    },
    relaisCronometrico: {
        morsetti: {
            unifilare: { x: 0, y: -0.5 }
        },
        disegna: (ctx, x, y, parametri, idEnte) => {
            try {
                if (statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.unifilare) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            ctx.beginPath();
            ctx.moveTo(x - 0.5, y - 0.5);
            ctx.lineTo(x + 0.5, y - 0.5);
            ctx.moveTo(x - 0.5, y + 0.5);
            ctx.lineTo(x + 0.5, y + 0.5);
            ctx.moveTo(x - 0.353, y - 0.353);
            ctx.arc(x - 0.6765, y, 0.5, -0.25 * Math.PI, 0.25 * Math.PI);
            ctx.moveTo(x + 0.353, y + 0.353);
            ctx.arc(x + 0.6765, y, 0.5, 0.75 * Math.PI, 1.25 * Math.PI);
            ctx.stroke();

            ctx.strokeStyle = stili[stileSelezionato].linee;
            ctx.beginPath();
            ctx.arc(x, y, 0.5, 0, 2 * Math.PI);
            ctx.stroke();
            try {
                const angolo = statoSimulazioneEnti[idEnte].cronometro / tempoCronometrico * 2 * Math.PI;
                ctx.strokeStyle = stili[stileSelezionato].tensione;
                ctx.beginPath();
                ctx.arc(x, y, 0.5, -Math.PI / 2, angolo - Math.PI / 2);
                ctx.stroke();
            } catch (e) { }
            try {
                if (statoSimulazioneEnti[idEnte].ancora > 0.5) {
                    ctx.fillStyle = stili[stileSelezionato].tensione; // Colore testo
                } else {
                    ctx.fillStyle = stili[stileSelezionato].linee;
                    ctx.strokeStyle = stili[stileSelezionato].linee;
                }
            } catch (e) { }
        }
    },
    relaisLampeggiatore: {
        morsetti: {
            unifilare: { x: 0, y: -0.5 }
        },
        disegna: (ctx, x, y, parametri, idEnte) => {
            try {
                if (statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.unifilare) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            ctx.beginPath();
            ctx.moveTo(x - 0.5, y - 0.5);
            ctx.lineTo(x + 0.5, y - 0.5);
            ctx.moveTo(x - 0.5, y + 0.5);
            ctx.lineTo(x + 0.5, y + 0.5);
            ctx.moveTo(x + 0.5, y);
            ctx.arc(x, y, 0.5, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 0.353, y + 0.353);
            ctx.lineTo(x - 0.353, y - 0.353);
            ctx.arc(x, y, 0.5, 1.25 * Math.PI, 1.75 * Math.PI);
            ctx.lineTo(x + 0.353, y - 0.353);
            ctx.lineTo(x - 0.353, y + 0.353);
            ctx.arc(x, y, 0.5, 0.25 * Math.PI, 0.75 * Math.PI);
            ctx.fill();
            try {
                if (statoSimulazioneEnti[idEnte].ancora > 0.5) {
                    ctx.fillStyle = stili[stileSelezionato].tensione; // Colore testo
                } else {
                    ctx.fillStyle = stili[stileSelezionato].linee;
                    ctx.strokeStyle = stili[stileSelezionato].linee;
                }
            } catch (e) { }
        }
    },
    relaisBattitoreDiCodice: {
        morsetti: {
            unifilare: { x: 0, y: -0.5 }
        },
        disegna: (ctx, x, y, parametri, idEnte) => {
            try {
                if (statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.unifilare) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            ctx.beginPath();
            ctx.moveTo(x - 0.5, y - 0.5);
            ctx.lineTo(x + 0.5, y - 0.5);
            ctx.moveTo(x - 0.5, y + 0.5);
            ctx.lineTo(x + 0.5, y + 0.5);
            ctx.moveTo(x + 0.5, y);
            ctx.arc(x, y, 0.5, 0, 2 * Math.PI);
            ctx.moveTo(x - 0.1, y - 0.15);
            ctx.lineTo(x, y - 0.25);
            ctx.lineTo(x + 0.1, y - 0.15);
            ctx.moveTo(x - 0.1, y + 0.15);
            ctx.lineTo(x, y + 0.25);
            ctx.lineTo(x + 0.1, y + 0.15);
            ctx.moveTo(x, y - 0.25);
            ctx.lineTo(x, y + 0.25);
            ctx.stroke();
            try {
                if (statoSimulazioneEnti[idEnte].ancora > 0.5) {
                    ctx.fillStyle = stili[stileSelezionato].tensione; // Colore testo
                } else {
                    ctx.fillStyle = stili[stileSelezionato].linee;
                    ctx.strokeStyle = stili[stileSelezionato].linee;
                }
            } catch (e) { }
        }
    },
    alimentazione: {
        morsetti: {
            unifilare: { x: 0, y: 0.5 }
        },
        disegna: (ctx, x, y, parametri, idEnte) => {
            ctx.strokeStyle = stili[stileSelezionato].tensione;
            ctx.fillStyle = stili[stileSelezionato].tensione; // Colore testo
            ctx.beginPath();
            ctx.moveTo(x - 0.15, y - 0.5);
            ctx.lineTo(x + 0.15, y - 0.5);
            ctx.lineTo(x, y + 0.1);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x, y - 0.4);
            ctx.lineTo(x, y + 0.5);
            ctx.stroke();
        }
    },
    contattoSemplice: {
        morsetti: {
            a: { x: 0, y: -0.5 },
            b: { x: 0, y: 0.5 }
        },
        disegna: (ctx, x, y, parametri, idEnte) => {
            try {
                if (statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.a) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            ctx.beginPath();
            ctx.moveTo(x, y - 0.5);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.strokeStyle = stili[stileSelezionato].linee;

            try {
                if (statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.b) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            ctx.beginPath();
            ctx.moveTo(x, y + 0.5);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.strokeStyle = stili[stileSelezionato].linee;

            try {
                if (statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.a && statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.b) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            let ancoraDisegnata = 0;
            if (statoSimulazioneEnti[idEnte] != undefined) {
                ancoraDisegnata = 1 - statoSimulazioneEnti[idEnte].contatto;
            } else if (idEnte == undefined) { // SOLO per quando si sta posando un nuovo contatto di relais!
                if (parametri.contatti == "alti") {
                    ancoraDisegnata = 1 - ancoraDisegnata;
                }
            }
            ctx.beginPath();
            ctx.moveTo(x - 0.4, y);
            ctx.lineTo(x + Math.max(0, -0.4 + 0.8 * ancoraDisegnata), y);
            ctx.stroke();
            ctx.strokeStyle = stili[stileSelezionato].linee;

            try {
                if (statoSimulazioneEnti[idEnteDaSuoNome(schema.enti[idEnte].nome)].ancora > 0.5) {
                    ctx.fillStyle = stili[stileSelezionato].tensione; // Colore testo
                }
            } catch (e) { }
        }
    },
    contattoDeviatore: {
        morsetti: {
            a: { x: 0, y: -0.5 },
            b: { x: 0, y: 0.5 },
            b: { x: 0.5, y: 0 }
        },
        disegna: (ctx, x, y, parametri, idEnte) => {
            //                                                                                                      TODO disegna
            try {
                if (statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.a) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            ctx.beginPath();
            ctx.moveTo(x, y - 0.5);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.strokeStyle = stili[stileSelezionato].linee;

            try {
                if (statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.b) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            ctx.beginPath();
            ctx.moveTo(x, y + 0.5);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.strokeStyle = stili[stileSelezionato].linee;

            try {
                if (statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.a && statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.b) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            let ancoraDisegnata = 0;
            if (statoSimulazioneEnti[idEnte] != undefined) {
                ancoraDisegnata = 1 - statoSimulazioneEnti[idEnte].contatto;
            } else if (idEnte == undefined) { // SOLO per quando si sta posando un nuovo contatto di relais!
                if (parametri.contatti == "alti") {
                    ancoraDisegnata = 1 - ancoraDisegnata;
                }
            }
            ctx.beginPath();
            ctx.moveTo(x - 0.4, y);
            ctx.lineTo(x + Math.max(0, -0.4 + 0.8 * ancoraDisegnata), y);
            ctx.stroke();
            ctx.strokeStyle = stili[stileSelezionato].linee;

            try {
                if (statoSimulazioneEnti[idEnteDaSuoNome(schema.enti[idEnte].nome)].ancora > 0.5) {
                    ctx.fillStyle = stili[stileSelezionato].tensione; // Colore testo
                }
            } catch (e) { }
        }
    },
    inversione: {
        morsetti: {
            a: { x: 0, y: -0.5 },
            b: { x: 0, y: 0.5 }
        },
        disegna: (ctx, x, y, parametri, idEnte) => {
            try {
                if (statoSimulazioneTensioni.enti[idEnte].tensioneMorsetti.a) {
                    ctx.strokeStyle = stili[stileSelezionato].tensione;
                }
            } catch (e) { }
            ctx.beginPath();
            ctx.moveTo(x, y - 0.5);
            ctx.lineTo(x, y - 0.25);
            ctx.lineTo(x + 0.5, y + 0.25);
            ctx.moveTo(x, y + 0.5);
            ctx.lineTo(x, y + 0.25);
            ctx.lineTo(x + 0.5, y - 0.25);
            ctx.stroke();
            ctx.strokeStyle = stili[stileSelezionato].linee;
        }
    }
}