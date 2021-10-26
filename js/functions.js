/*Función para resetar formulario*/
const rstForm = (form) => {
    for (elements of  form) {
        elements.reset();
    }
}


/*--------------------------------
# Sección registro de movimientos
---------------------------------*/
const sendMovData = (e) => {
    e.preventDefault();
    let description = $("#entryDescription").val();
    let value = parseFloat($("#entryValue").val());
    let type = "";

    if ($("#incomeBox").is(":checked")) {
        type = "Ingreso";
    } else {
        type = "Gasto";
    }

    let item = new Movement(description, value, type);

    rstForm($("#movementsForm"));
    saveData(item);
}

const saveData = (item) => {
    let movements = JSON.parse(localStorage.getItem("Movements"));

    if (!movements) {
        movements = [];
    }
    movements.push(item);
    localStorage.setItem("Movements", JSON.stringify(movements));
}

const clearMovements = () => {
    rstForm($("#movementsForm"));
    localStorage.clear();
    $("#resultsDivision").hide();
}

const showMovements = () => {
    let movements = JSON.parse(localStorage.getItem("Movements"));

    //Crea la sección donde se mostrarán los resultados
    let resultsSection = $("#resultsDivision");
    resultsSection.text("");
    resultsSection.show();
    $("html, body").animate ({
        scrollTop: $("#resultsDivision").offset().top
    }, 100);

    resultsSection.addClass("resultsContainer");

    if (!movements) {
        resultsSection.append("<h2>No hay movimientos para mostrar</h2>");
    } else {
        resultsSection.append("<h2>Movimientos realizados</h2>");
        let totalIncome = 0;
        let totalExpense = 0;
        
        //Para cada elemento del array, crea un card con 3 párrafos que contienen los valores
        movements.forEach( (element, i) => {
            let movementsCard = `<div class="resultsContainer__movementsCard">
                                    <p class="movementsCard__parrDescription" >${element.description}</p>
                                    <p class="movementsCard__parrValue">$ ${element.value}</p>
                                </div>`;

            resultsSection.append(movementsCard);

            if (i==0) {
                $( ".resultsContainer__movementsCard" ).addClass( "firstMovementsCard");
            } else {
                $( ".resultsContainer__movementsCard" ).addClass( "middleMovementsCard");
            }

            if (element.type == "Ingreso") {
                totalIncome += element.value;
            } else {
                totalExpense += element.value;
                $( ".resultsContainer__movementsCard" ).last().addClass( "expenseAlert");
            }

        }); 
        
        $( ".resultsContainer__movementsCard:last" ).addClass("lastMovementsCard");
       
        //Se crea card para mostrar los resultados de saldo total
        let resultsCard = `<div class="resultsContainer__resultsCard">
                                <p><b>Total ingresos:</b> $ ${totalIncome}</p>
                                <p><b>Total gastos:</b> $ ${totalExpense}</p>
                                <p><b>Saldo en la cuenta:</b> $ ${totalIncome-totalExpense}</p>
                           </div>`;

        resultsSection.append(resultsCard);
    }
    
}
/*--------------------------------
# Fin sección registro de movimientos
---------------------------------*/


/*--------------------------------
# Sección endeudamiento
---------------------------------*/
const debtCalculate = (e) => {
    e.preventDefault();

    $("#resultsDebtContainer").text("");
    
    if ($("#entryIncome").val() && $("#entryExpense").val()) {
        let result = (parseFloat($("#entryIncome").val()) - parseFloat($("#entryExpense").val()))*0.40;
        $("#resultsDebtContainer").append(`<p class = 'insideDivision__parr' >Su capacidad de endeudamiento es $ ${result}</p>`);

        $("#debtImage").fadeOut( function () {
            $(".insideDivision__parr").fadeIn(2000);
            $("#debtImage").fadeIn(2000);
        })
    
    } else {
        $("#resultsDebtContainer").append(`<p class = 'insideDivision__parr' >Por favor digilencie el formulario</p>`);
        $(".insideDivision__parr").show();
        $("#debtImage").hide();
    }

    rstForm($("#debtForm"));
    
}
/*--------------------------------
# Fin sección endeudamiento
---------------------------------*/


/*--------------------------------
# Sección tasas
---------------------------------*/
const APIURL = "https://api.vatcomply.com/rates?base=USD";

function rateData() {
    $.ajax({
        method: "GET",
        url: APIURL,
        success: function (res) {
            $("#rateDivision").append("<div class='rateContainer__rateInner' id='rateInnerDivision'></div>");
            $("#rateInnerDivision").text("");                                       
            $("#rateInnerDivision").append(`
                                    <section class="rateInner__headContainer">
                                        <h3>${res.date}</h3>
                                        <p>Base: ${res.base}</p>
                                    </section>`);

            for (i in res.rates) {
                $("#rateInnerDivision").append(`<p class="rateInner__listContainer">${i}: ${res.rates[i]}</p>`);
            }
            $(".rateInner__listContainer:last").addClass("lastParrMargin");
        },
    });
}
/*--------------------------------
# Fin sección tasas
---------------------------------*/