/**
 * MENU.JS - Menú principal
 * Muestra el saldo, último movimiento y opciones de navegación
 */

// Si no está logueado, redirige al login (JS)
if (localStorage.getItem("logged") !== "true") {
    window.location.href = "login.html";
}

// Convierte números a formato de moneda (ej: $1.000) (JS)
function money(n) {
    return "$" + Number(n).toLocaleString("es-CL");
}

// Espera a que el documento esté listo (jQuery)
$(document).ready(function() {
    // Obtiene y muestra el saldo actual (jQuery)
    var balance = Number(localStorage.getItem("balance") || "0");
    $("#balance").text(money(balance));

    // Obtiene el último movimiento y lo muestra (jQuery)
    var txs = JSON.parse(localStorage.getItem("txs") || "[]");
    if (txs.length > 0) {
        var t = txs[0];
        $("#lastTx").text(
            "Último: " + t.type + " - " + money(t.amount) + " - " + t.detail + " - " + t.date
        );
    }

    var $redirectMsg = $("#redirectMsg");

    // Botón para redirigir a depositar (jQuery)
    $("#btnDeposit").on("click", function () {
        $redirectMsg.text("Redirigiendo a depositar...");
        setTimeout(function () { window.location.href = "deposit.html"; }, 700);
    });

    // Botón para redirigir a enviar dinero (jQuery)
    $("#btnSend").on("click", function () {
        $redirectMsg.text("Redirigiendo a enviar dinero...");
        setTimeout(function () { window.location.href = "sendmoney.html"; }, 700);
    });

    // Botón para redirigir a últimas transacciones (jQuery)
    $("#btnTx").on("click", function () {
        $redirectMsg.text("Redirigiendo a últimos movimientos...");
        setTimeout(function () { window.location.href = "transactions.html"; }, 700);
    });

    // Botón para cerrar la sesión y volver a login (jQuery)
    $("#logoutBtn").on("click", function () {
        localStorage.removeItem("logged");
        window.location.href = "login.html";
    });
});
