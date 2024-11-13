function convertiMouseX(x) {
    return (x - visuale.x) / visuale.scala;
}
function convertiMouseY(y) {
    return (y - visuale.y) / visuale.scala;
}

function trovaCoordinatePuntoFilo(coord) {
    function trovaCoordinateMorsetto(ente, morsetto) {
        return {
            x: ente.x + prototipiEnti[ente.tipo].morsetti[morsetto].x,
            y: ente.y + prototipiEnti[ente.tipo].morsetti[morsetto].y
        };
    }

    if (coord.tipo == "xy") {
        return {
            x: coord.x,
            y: coord.y
        };
    } else if (coord.tipo == "morsetto") {
        return trovaCoordinateMorsetto(schema.enti[coord.ente], coord.morsetto);
    }
}

function calcolaDistanzaPuntoSegmento(p, a, b) {
    // https://stackoverflow.com/questions/6865832/detecting-if-a-point-is-of-a-line-segment
    function calcolaDistanzaAlQuadratoTraDuePunti(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    const ap2 = calcolaDistanzaAlQuadratoTraDuePunti(a, p);
    const bp2 = calcolaDistanzaAlQuadratoTraDuePunti(b, p);
    const ab2 = calcolaDistanzaAlQuadratoTraDuePunti(a, b);

    if (bp2 > ap2 + ab2) {
        return Math.sqrt(ap2);
    } else if (ap2 > bp2 + ab2) {
        return Math.sqrt(bp2);
    } else {
        const ap = Math.sqrt(ap2);
        const bp = Math.sqrt(bp2);
        const ab = Math.sqrt(ab2);
        const s = (ap + bp + ab) / 2;
        return 2 / ab * Math.sqrt(s * (s - ap) * (s - bp) * (s - ab));
    }
}

function copiaOggetto(oggetto) {
    const prodotto = {};
    for (let jd in oggetto) {
        const elemento = oggetto[jd];
        if (typeof elemento === 'object' && !Array.isArray(elemento) && elemento !== null) {
            prodotto[jd] = copiaOggetto(elemento);
        } else if (Array.isArray(elemento) && elemento !== null) {
            prodotto[jd] = [];
            for (let jj in elemento) {
                prodotto[jd].push(copiaOggetto(elemento[jj]));
            }
        } else {
            prodotto[jd] = elemento;
        }
    }
    return prodotto;
}

function oggettiSonoUguali(a, b) {
    if (Object.keys(a).length != Object.keys(b).length) {
        return false;
    }
    for (let jd in a) {
        const elementoA = a[jd];
        const elementoB = b[jd];
        if (typeof elemento === 'object' && !Array.isArray(elemento) && elemento !== null) {
            if (!oggettiSonoUguali(elementoA, elementoB)) {
                return false;
            }
        } else if (elementoA !== elementoB) {
            return false;
        }
    }
    return true;
}

function idEnteDaSuoNome(nome) {
    for (let jd in schema.enti) {
        if (schema.enti[jd] == null) {
            continue;
        }
        if (schema.enti[jd].nome == nome) {
            return jd;
        }
    }
    return null;
}