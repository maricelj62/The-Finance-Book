/* Constructor para los datos ingresados en la sección "Registro de Movimientos" */
class Movement {
    constructor(description, value, type) {
        this.description = description;
        this.value = value;
        this.type = type;
    }
}

/* Llamado a funciones para los botones de las secciones movimientos, endeudamiento y tasas */
$(document).ready( function() {
    $("#movementsForm").submit(sendMovData);
    $("#resetMovBtn").click(clearMovements);
    $("#showMovBtn").click(showMovements);
    $("#debtBtn").click(debtCalculate);
    $("#rateBtn").click(rateData);
})