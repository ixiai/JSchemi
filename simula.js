function simula() {
    statoSimulazioneTensioni = {
        enti: {},
        cavi: {}
    };


    for (let jd in schema.enti) {
        if (statoSimulazioneEnti[jd] == undefined) {

        }
        statoSimulazioneTensioni.enti[jd] = {
            tensioneMorsetti: {}
        }
        for (let jj in prototipiEnti[schema.enti[jd].tipo].morsetti) {
            statoSimulazioneTensioni.enti[jd].tensioneMorsetti[jj] = 0;
        }
        switch (schema.enti[jd].tipo) {
            case "relaisNeutro":
                break;
            case "alimentazione":
                for (let jj in prototipiEnti[schema.enti[jd].tipo].morsetti) {
                    statoSimulazioneTensioni.enti[jd].tensioneMorsetti[jj] = 1;
                }
                break;
        }
        if (statoSimulazioneEnti[jd] == undefined) {
            statoSimulazioneEnti[jd] = {};
            switch (schema.enti[jd].tipo) {
                case "relaisLampeggiatore":
                case "relaisBattitoreDiCodice":
                    statoSimulazioneEnti[jd].verso = 1;
                case "relaisCombinatore":
                case "relaisNeutro":
                case "relaisStabilizzato":
                case "relaisPolarizzato":
                    statoSimulazioneEnti[jd].ancora = 0;
                    break;
                case "relaisCronometrico":
                    statoSimulazioneEnti[jd].cronometro = 0.0;
                    statoSimulazioneEnti[jd].ancora = 0;
                    break;
                case "tasto":
                case "maniglia":
                    statoSimulazioneEnti[jd].posizione = "N";
                    break;
                case "alimentazione":
                    break;
            }
        }
    }

    for (let jd in statoSimulazioneTensioni.enti) {
        switch (schema.enti[jd].tipo) {
            case "relaisNeutro":
                break;
            case "alimentazione":
                for (let jj in prototipiEnti[schema.enti[jd].tipo].morsetti) {
                    statoSimulazioneTensioni.enti[jd].tensioneMorsetti[jj] = 1;
                }
                break;
        }
    }

    for (let jd in schema.cavi) {
        //if (statoSimulazione.cavi[jd] == undefined) {
        statoSimulazioneTensioni.cavi[jd] = {
            tensione: 0
        }
        //}
    }
    for (let jd in statoSimulazioneTensioni.cavi) {
        statoSimulazioneTensioni.cavi[jd].tensione = 0;
    }

    var cambiamentiInQuestoFotogramma = 0;
    var iterazioniTrascorse = 0;
    const maxIterazioni = 200;
    while ((cambiamentiInQuestoFotogramma || !iterazioniTrascorse) && (iterazioniTrascorse <= maxIterazioni)) {
        for (let jd in schema.cavi) {
            for (let jdPunto in schema.cavi[jd]) {
                const punto = schema.cavi[jd][jdPunto];
                if (punto.tipo == "morsetto") {
                    if (statoSimulazioneTensioni.cavi[jd].tensione && !statoSimulazioneTensioni.enti[punto.ente].tensioneMorsetti[punto.morsetto]) {
                        statoSimulazioneTensioni.enti[punto.ente].tensioneMorsetti[punto.morsetto] = statoSimulazioneTensioni.cavi[jd].tensione;
                        cambiamentiInQuestoFotogramma++;
                    } else if (!statoSimulazioneTensioni.cavi[jd].tensione && statoSimulazioneTensioni.enti[punto.ente].tensioneMorsetti[punto.morsetto]) {
                        statoSimulazioneTensioni.cavi[jd].tensione = statoSimulazioneTensioni.enti[punto.ente].tensioneMorsetti[punto.morsetto];
                        cambiamentiInQuestoFotogramma++;
                    }
                }
            }
        }
        for (let jd in schema.enti) {
            switch (schema.enti[jd].tipo) {
                case "contattoSemplice":
                    const nomeSplit = schema.enti[jd].nome.split(".");
                    switch (nomeSplit[0]) {
                        case "t":
                            statoSimulazioneEnti[jd].contatto = 1 * (statoSimulazioneEnti[idEnteDaSuoNome(nomeSplit[0] + "." + nomeSplit[1])] != undefined && nomeSplit[2].toUpperCase().includes(statoSimulazioneEnti[idEnteDaSuoNome(nomeSplit[0] + "." + nomeSplit[1])].posizione));
                            break;
                        default:
                            statoSimulazioneEnti[jd].contatto = statoSimulazioneEnti[idEnteDaSuoNome(schema.enti[jd].nome)].ancora;
                            if (schema.enti[jd].parametri.contatti != "alti") {
                                statoSimulazioneEnti[jd].contatto = 1 - statoSimulazioneEnti[jd].contatto;
                            }
                            break;
                    }
                    if (statoSimulazioneEnti[jd].contatto > 1 - parametriRelais.margineContatti) {
                        //console.log(contatto, parametriRelais.margineContatti, statoSimulazioneTensioni.enti[jd].tensioneMorsetti.a, statoSimulazioneTensioni.enti[jd].tensioneMorsetti.b);
                        if (statoSimulazioneTensioni.enti[jd].tensioneMorsetti.a && !statoSimulazioneTensioni.enti[jd].tensioneMorsetti.b) {
                            statoSimulazioneTensioni.enti[jd].tensioneMorsetti.b = statoSimulazioneTensioni.enti[jd].tensioneMorsetti.a;
                        } else if (statoSimulazioneTensioni.enti[jd].tensioneMorsetti.b && !statoSimulazioneTensioni.enti[jd].tensioneMorsetti.a) {
                            statoSimulazioneTensioni.enti[jd].tensioneMorsetti.b = statoSimulazioneTensioni.enti[jd].tensioneMorsetti.b;
                        }
                    }
                    break;
                case "inversione":
                    if (statoSimulazioneTensioni.enti[jd].tensioneMorsetti.a * statoSimulazioneTensioni.enti[jd].tensioneMorsetti.b > 0) {
                        // Corto
                        statoSimulazioneTensioni.enti[jd].tensioneMorsetti.a = 0;
                        statoSimulazioneTensioni.enti[jd].tensioneMorsetti.b = 0;
                    } else if (!statoSimulazioneTensioni.enti[jd].tensioneMorsetti.a) {
                        statoSimulazioneTensioni.enti[jd].tensioneMorsetti.a = -statoSimulazioneTensioni.enti[jd].tensioneMorsetti.b;
                    } else if (!statoSimulazioneTensioni.enti[jd].tensioneMorsetti.b) {
                        statoSimulazioneTensioni.enti[jd].tensioneMorsetti.b = -statoSimulazioneTensioni.enti[jd].tensioneMorsetti.a;
                    }
                    break;
            }
        }
        iterazioniTrascorse++;
    }


    for (let jd in statoSimulazioneEnti) {
        switch (schema.enti[jd].tipo) {
            case "relaisNeutro":
                statoSimulazioneEnti[jd].ancora += 1 / (statoSimulazioneTensioni.enti[jd].tensioneMorsetti["unifilare"] ? tempoCommutazione : -tempoCommutazione) / FPSSimulazione;
                statoSimulazioneEnti[jd].ancora = Math.max(0, Math.min(1, statoSimulazioneEnti[jd].ancora));
                break;
            case "relaisPolarizzato":
                statoSimulazioneEnti[jd].ancora += 1 / (Math.sign(statoSimulazioneTensioni.enti[jd].tensioneMorsetti["unifilare"]) == (schema.enti[jd].parametri.polaritaInvertita ? -1 : 1) ? tempoCommutazione : -tempoCommutazione) / FPSSimulazione;
                statoSimulazioneEnti[jd].ancora = Math.max(0, Math.min(1, statoSimulazioneEnti[jd].ancora));
                break;
            case "relaisCronometrico":
                if (statoSimulazioneTensioni.enti[jd].tensioneMorsetti["unifilare"]) {
                    if (statoSimulazioneEnti[jd].cronometro < tempoCronometrico) {
                        statoSimulazioneEnti[jd].cronometro += 1 / FPSSimulazione;
                    } else {
                        statoSimulazioneEnti[jd].ancora += 1 / tempoCommutazione / FPSSimulazione;
                    }
                } else {
                    statoSimulazioneEnti[jd].cronometro = 0.0;
                    statoSimulazioneEnti[jd].ancora -= 1 / tempoCommutazione / FPSSimulazione;
                }
                statoSimulazioneEnti[jd].ancora = Math.max(0, Math.min(1, statoSimulazioneEnti[jd].ancora));
                break;
            case "relaisLampeggiatore":
                statoSimulazioneEnti[jd].ancora += 1 / (statoSimulazioneTensioni.enti[jd].tensioneMorsetti["unifilare"] ? tempoCommutazione * statoSimulazioneEnti[jd].verso : -tempoCommutazione) / FPSSimulazione;
                if (statoSimulazioneEnti[jd].ancora > 1 || statoSimulazioneEnti[jd].ancora < 0) {
                    statoSimulazioneEnti[jd].verso *= -1;
                }
                statoSimulazioneEnti[jd].ancora = Math.max(0, Math.min(1, statoSimulazioneEnti[jd].ancora));
                break;
            case "relaisBattitoreDiCodice":
                let tempoCommutazioneCodice = tempoCommutazione;
                if (schema.enti[jd].nome == "CT75") {
                    tempoCommutazioneCodice = 0.4;
                } else if (schema.enti[jd].nome == "CT120") {
                    tempoCommutazioneCodice = 0.25;
                } else if (schema.enti[jd].nome == "CT180") {
                    tempoCommutazioneCodice = 0.1667;
                } else if (schema.enti[jd].nome == "CT270") {
                    tempoCommutazioneCodice = 0.1111;
                }
                statoSimulazioneEnti[jd].ancora += 1 / (statoSimulazioneTensioni.enti[jd].tensioneMorsetti["unifilare"] ? tempoCommutazioneCodice * statoSimulazioneEnti[jd].verso : -tempoCommutazioneCodice) / FPSSimulazione;
                if (statoSimulazioneEnti[jd].ancora > 1 || statoSimulazioneEnti[jd].ancora < 0) {
                    statoSimulazioneEnti[jd].verso *= -1;
                }
                statoSimulazioneEnti[jd].ancora = Math.max(0, Math.min(1, statoSimulazioneEnti[jd].ancora));
                break;
        }
    }
}