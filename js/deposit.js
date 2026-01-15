/**
 * DEPOSIT.JS - Sistema de depósitos
 * Permite al usuario depositar dinero en su cuenta
 */

// Si no está logueado, redirige al login (JS)
if (localStorage.getItem("logged") !== "true") {
    window.location.href = "login.html";
}

// Convierte números a formato de moneda (ej: $1.000) (JS)
function money(n) {
    return "$" + Number(n).toLocaleString("es-CL");
}

// Obtiene el saldo del localStorage y lo muestra en el DOM (jQuery)
function renderBalance() {
    var balance = Number(localStorage.getItem("balance") || "0");
    $("#balanceNow").text(money(balance));
}

// Registra una nueva transacción en el historial (JS)
function addTx(type, amount, detail) {
    var txs = JSON.parse(localStorage.getItem("txs") || "[]");
    txs.unshift({
        type: type,
        amount: Number(amount),
        detail: detail,
        date: new Date().toLocaleString("es-CL")
    });
    localStorage.setItem("txs", JSON.stringify(txs));
}

// Espera a que el documento esté listo (jQuery)
$(document).ready(function() {
    renderBalance();

    var $form = $("#depositForm");
    var $msg = $("#msg");

    // Maneja el envío del formulario de depósito (jQuery)
    $form.on("submit", function (e) {
        e.preventDefault();

        // Obtener monto ingresado (jQuery)
        var amount = Number($("#amount").val());

        // Validar que sea un monto válido (JS)
        if (!amount || amount <= 0) {
            $msg.html('<div class="alert alert-danger"><i class="fas fa-exclamation-circle me-2"></i>Ingresa un monto válido</div>');
            return;
        }

        // Obtener saldo actual y calcular nuevo saldo (JS)
        var prevBalance = Number(localStorage.getItem("balance") || "0");
        var newBalance = prevBalance + amount;
        localStorage.setItem("balance", String(newBalance));

        // Registrar la transacción (JS)
        addTx("Depósito", amount, "Depósito realizado");

        // Mostrar resumen del depósito (jQuery)
        var $summary = $("#depositSummary");
        $("#summaryAmount").text(money(amount));
        $("#summaryPrevBalance").text(money(prevBalance));
        $("#summaryNewBalance").text(money(newBalance));
        $summary.show();

        // Limpiar el formulario (jQuery)
        $("#amount").val("");

        // Mostrar mensaje de éxito (jQuery)
        $msg.html('<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>Depósito OK ✅ Volviendo al menú en 2 segundos...</div>');

        // Actualizar saldo mostrado (jQuery)
        renderBalance();

        // Redirigir al menú después de 2 segundos (JS)
        setTimeout(function () {
            window.location.href = "menu.html";
        }, 2000);
    });
});
