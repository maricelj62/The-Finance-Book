/* Función para resetar formulario */
const rstForm = (form) => {
    for (elements of  form) {
        elements.reset();
    }
}


/*--------------------------------
# Sección registro de movimientos
---------------------------------*/

/* Cuando se presiona el botón "Enviar" se activa esta función, la cual  
crea el objeto "item" a partir de los datos del movimiento ingresado
por el usuario. Luego, el objeto "item" se envía a la función "saveData". */
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

/* Esta función recibe el objeto "item" y crea el array "movements", en 
el cual se adiciona el objeto con los datos del movimiento. 
Finalmente, el array es enviado a local storage.
 */
const saveData = (item) => {
    let movements = JSON.parse(localStorage.getItem("Movements"));

    if (!movements) {
        movements = [];
    }
    movements.push(item);
    localStorage.setItem("Movements", JSON.stringify(movements));
}

/* Esta función se activa cuando se presiona el botón "Resetar". 
Primero limpia los campos del formulario, luego borra el local
storage y por último esconde la sección donde se muestran
los resultados de los movimientos. */
const clearMovements = () => {
    rstForm($("#movementsForm"));
    localStorage.clear();
    $("#resultsDivision").hide();
}

/* Esta función se activa con el botón "Mostrar", y lo que hace
es mostrar una sección donde el usuario puede ver el detalle de los
movimientos registrados. */
const showMovements = () => {
    let movements = JSON.parse(localStorage.getItem("Movements"));

    // Muestra la sección de resultados y dirige el scroll hacia ella.
    let resultsSection = $("#resultsDivision");
    resultsSection.text("");
    resultsSection.show();
    $("html, body").animate ({
        scrollTop: $("#resultsDivision").offset().top
    }, 100);

    // Agrega estilos y tílulo a la sección de resultados
    resultsSection.addClass("resultsContainer");

    if (!movements) {
        resultsSection.append("<h2>No hay movimientos para mostrar</h2>");
    } else {
        resultsSection.append("<h2>Movimientos realizados</h2>");
        let totalIncome = 0;
        let totalExpense = 0;
        
        /* Para cada elemento del array donde se almacenan los movimientos,
        crea un card con la descripción y el valor del movimiento. Luego,
        agrega estilos al card dependiendo de su posición. Si el movimiento 
        corresponde a un gasto, agrega también un estilo particular. */
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
       
        //Se crea un card para mostrar los resultados de saldo total
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

/* Esta función calcula la capacidad de endeudamiento y se activa con el botón "Calcular". */
const debtCalculate = (e) => {
    e.preventDefault();

    $("#resultsDebtContainer").text("");
    
    /* Si los campos del formulario son diligenciados, se calcula la capacidad de endeudamiento.
    Este valor se mostrará en un párrafo que se crea inicialmente con la propiedad "display: none", 
    y que luego se muestra por medio de una animación que se aplica también a la imagen. */
    if ($("#entryIncome").val() && $("#entryExpense").val()) {
        let result = (parseFloat($("#entryIncome").val()) - parseFloat($("#entryExpense").val()))*0.40;
        $("#resultsDebtContainer").append(`<p class = 'insideDivision__parr' >Su capacidad de endeudamiento es $ ${result}</p>`);

        $("#debtImage").fadeOut( function () {
            $(".insideDivision__parr").fadeIn(2000);
            $("#debtImage").fadeIn(2000);
        }) 
    } 
    /* Si los dos campos del formulario no son diligenciados, se muestra solo el párrafo, solicitando 
    ingresar los datos. */
    else {
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

/* Esta función realiza una llamada AJAX para consultar datos de tasas de referencia. */
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