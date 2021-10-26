class Movement {
    constructor(description, value, type) {
        this.description = description;
        this.value = value;
        this.type = type;
    }
}

$(document).ready( function() {
    $("#movementsForm").submit(sendMovData);
    $("#resetMovBtn").click(clearMovements);
    $("#showMovBtn").click(showMovements);
    $("#debtBtn").click(debtCalculate);
    $("#rateBtn").click(rateData);
})