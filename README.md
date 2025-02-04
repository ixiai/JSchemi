# JSchemi
*Simulazione (semplificata) di circuiti logici a relais*

[ *** ! WiP ! *** ]

### Scopo
Al momento vengono simulati circuiti elettrici con notazione unifilare; sono presenti tasti, maniglie e vari tipi di relais.

### Uso
Tasto sinistro del mouse: selezione, navigazione<br>
Rotella del mouse: ingrandimento<br>
Tasto centrale del mouse: interazione con tasti e maniglie (<kbd>Ctrl</kbd>/<kbd>Alt</kbd>/<kbd>Shift</kbd> per estrarre i pulsanti)<br>

<kbd>?</kbd> - Aiuto<br>
<kbd>Esc</kbd> - Annulla<br>
<kbd>Del</kbd> - Cancella selezionato<br>
<kbd>Home</kbd>/<kbd>End</kbd> - Cambio stile grafico<br>

Posa nuovo:<br>
<kbd>T</kbd> - TASTO<br>
<kbd>Y</kbd> - MANIGLIA<br>
<kbd>A</kbd> - ALIMENTAZIONE<br>
<kbd>S</kbd> - CONTATTO SEMPLICE (<kbd>PageUp</kbd>/<kbd>PageDown</kbd> per cambiarne lo stato normale)<br>
<kbd>D</kbd> - CONTATTO A DEVIATORE (<kbd>PageUp</kbd>/<kbd>PageDown</kbd> per cambiarne lo stato normale)<br>
<kbd>F</kbd> - FILO (UNIFILARE)<br>
<kbd>J</kbd> - INVERSIONE POLARITÀ<br>
......RELAIS:<br>
<kbd>Z</kbd> - BATTITORE DI CODICE<br>
<kbd>X</kbd> - LAMPEGGIATORE<br>
<kbd>C</kbd> - CRONOMETRICO<br>
<kbd>V</kbd> - POLARIZZATO (<kbd>PageUp</kbd>/<kbd>PageDown</kbd> per cambiare polarità)<br>
<kbd>B</kbd> - STABILIZZATO<br>
<kbd>N</kbd> - NEUTRO<br>
<kbd>M</kbd> - COMBINATORE<br>

Per posare un filo, fare clic su ogni punto (o su ogni ente interessato); per terminare un filo in costruzione, fare nuovamente clic sul suo ultimo punto.

Per battezzare un ente con nome rovescio, usare ```_``` come ultimo carattere.

Per richiamare un tasto o maniglia in un contatto, scrivere come nome ```t.nomeTasto.nomiPosizioni```; le posizioni sono ```s```, ```n```, ```d``` per le maniglie (sinistra - normale - destra), ```p```, ```n```, ```e``` per i tasti (premuto - normale - estratto).<br>
Ad esempio, perché un contatto sia chiuso con un tasto premuto o normale, il nome del contatto è: ```t.nomeTasto.pn```

Per determinare la velocità dei relais battitori di codice, battezzarli _"CT75"_, _"CT120"_, _"CT180"_, _"CT270"_.
