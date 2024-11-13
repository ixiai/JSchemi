var schema = {
    "enti": [
        null,
        null,
        {
            "tipo": "relaisPolarizzato",
            "x": -6,
            "y": 0,
            "nome": "Acc",
            "parametri": {}
        },
        {
            "tipo": "relaisPolarizzato",
            "x": -5,
            "y": 0,
            "nome": "Sp",
            "parametri": {
                "polaritaInvertita": true
            }
        },
        null,
        null,
        {
            "tipo": "tasto",
            "x": -2,
            "y": 3,
            "nome": "t.Acc",
            "parametri": {}
        },
        {
            "tipo": "tasto",
            "x": -1,
            "y": 3,
            "nome": "t.Sp",
            "parametri": {}
        },
        {
            "tipo": "relaisNeutro",
            "x": 3,
            "y": 0,
            "nome": "Relais",
            "parametri": {}
        },
        null,
        {
            "tipo": "contattoSemplice",
            "x": -6,
            "y": -5,
            "nome": "t.Acc.p",
            "parametri": {}
        },
        {
            "tipo": "contattoSemplice",
            "x": -4,
            "y": -5,
            "nome": "t.Sp.p",
            "parametri": {}
        },
        {
            "tipo": "inversione",
            "x": -4,
            "y": -4,
            "nome": "",
            "parametri": {}
        },
        {
            "tipo": "alimentazione",
            "x": -6,
            "y": -8,
            "nome": "",
            "parametri": {}
        },
        {
            "tipo": "contattoSemplice",
            "x": 3,
            "y": -4,
            "nome": "Acc",
            "parametri": {
                "contatti": "alti"
            }
        },
        {
            "tipo": "contattoSemplice",
            "x": 3,
            "y": -2,
            "nome": "Sp",
            "parametri": {
                "contatti": "bassi"
            }
        },
        {
            "tipo": "contattoSemplice",
            "x": 5,
            "y": -4,
            "nome": "Relais",
            "parametri": {
                "contatti": "alti"
            }
        },
        {
            "tipo": "alimentazione",
            "x": 3,
            "y": -8,
            "nome": "",
            "parametri": {}
        },
        {
            "tipo": "relaisCronometrico",
            "x": 6,
            "y": 2,
            "nome": "RTem",
            "parametri": {}
        },
        {
            "tipo": "relaisBattitoreDiCodice",
            "x": 9,
            "y": 2,
            "nome": "CT120",
            "parametri": {}
        },
        null,
        {
            "tipo": "contattoSemplice",
            "x": 9,
            "y": 0,
            "nome": "RTem",
            "parametri": {
                "contatti": "alti"
            }
        },
        {
            "tipo": "contattoSemplice",
            "x": 6,
            "y": 0,
            "nome": "Relais",
            "parametri": {
                "contatti": "alti"
            }
        }
    ],
    "cavi": [
        {
            "0": {
                "tipo": "morsetto",
                "ente": "12",
                "morsetto": "a"
            },
            "1": {
                "tipo": "morsetto",
                "ente": "11",
                "morsetto": "b"
            }
        },
        null,
        {
            "0": {
                "tipo": "morsetto",
                "ente": "13",
                "morsetto": "unifilare"
            },
            "1": {
                "tipo": "morsetto",
                "ente": "10",
                "morsetto": "a"
            },
            "2": {
                "tipo": "xy",
                "x": -6,
                "y": -6
            },
            "3": {
                "tipo": "xy",
                "x": -4,
                "y": -6
            },
            "4": {
                "tipo": "morsetto",
                "ente": "11",
                "morsetto": "a"
            }
        },
        {
            "0": {
                "tipo": "morsetto",
                "ente": "3",
                "morsetto": "unifilare"
            },
            "1": {
                "tipo": "xy",
                "x": -5,
                "y": -1
            },
            "2": {
                "tipo": "xy",
                "x": -6,
                "y": -1
            },
            "3": {
                "tipo": "morsetto",
                "ente": "2",
                "morsetto": "unifilare"
            },
            "4": {
                "tipo": "morsetto",
                "ente": "10",
                "morsetto": "b"
            },
            "5": {
                "tipo": "xy",
                "x": -6,
                "y": -3
            },
            "6": {
                "tipo": "xy",
                "x": -4,
                "y": -3
            },
            "7": {
                "tipo": "morsetto",
                "ente": "12",
                "morsetto": "b"
            }
        },
        {
            "0": {
                "tipo": "morsetto",
                "ente": "8",
                "morsetto": "unifilare"
            },
            "1": {
                "tipo": "morsetto",
                "ente": "15",
                "morsetto": "b"
            }
        },
        {
            "0": {
                "tipo": "morsetto",
                "ente": "15",
                "morsetto": "a"
            },
            "1": {
                "tipo": "morsetto",
                "ente": "14",
                "morsetto": "b"
            },
            "2": {
                "tipo": "xy",
                "x": 3,
                "y": -3
            },
            "3": {
                "tipo": "xy",
                "x": 5,
                "y": -3
            },
            "4": {
                "tipo": "morsetto",
                "ente": "16",
                "morsetto": "b"
            }
        },
        {
            "0": {
                "tipo": "morsetto",
                "ente": "16",
                "morsetto": "a"
            },
            "1": {
                "tipo": "xy",
                "x": 5,
                "y": -5
            },
            "2": {
                "tipo": "xy",
                "x": 3,
                "y": -5
            },
            "3": {
                "tipo": "morsetto",
                "ente": "14",
                "morsetto": "a"
            },
            "4": {
                "tipo": "morsetto",
                "ente": "17",
                "morsetto": "unifilare"
            }
        },
        {
            "0": {
                "tipo": "morsetto",
                "ente": "18",
                "morsetto": "unifilare"
            },
            "1": {
                "tipo": "morsetto",
                "ente": "22",
                "morsetto": "b"
            }
        },
        {
            "0": {
                "tipo": "morsetto",
                "ente": "19",
                "morsetto": "unifilare"
            },
            "1": {
                "tipo": "morsetto",
                "ente": "21",
                "morsetto": "b"
            }
        },
        {
            "0": {
                "tipo": "morsetto",
                "ente": "8",
                "morsetto": "unifilare"
            },
            "1": {
                "tipo": "xy",
                "x": 3,
                "y": -1
            },
            "2": {
                "tipo": "xy",
                "x": 6,
                "y": -1
            },
            "3": {
                "tipo": "morsetto",
                "ente": "22",
                "morsetto": "a"
            },
            "4": {
                "tipo": "xy",
                "x": 6,
                "y": -1
            },
            "5": {
                "tipo": "xy",
                "x": 9,
                "y": -1
            },
            "6": {
                "tipo": "morsetto",
                "ente": "21",
                "morsetto": "a"
            }
        }
    ]
}