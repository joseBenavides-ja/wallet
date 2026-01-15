/**
 * TRANSACTIONS.JS - Historial de movimientos
 * Muestra el listado de todas las transacciones realizadas
 */

// Si no está logueado, redirige al login (JS)
if (localStorage.getItem("logged") !== "true") {
    window.location.href = "login.html";
}

// Convierte números a formato de moneda (ej: $1.000) (JS)
function money(n) {
    return "$" + Number(n).toLocaleString("es-CL");
}

// Obtiene el ícono según el tipo de transacción (JS)
function getIconoTransaccion(tipo) {
    if (tipo === "Depósito") {
        return '<i class="fas fa-arrow-down text-success me-2"></i>';
    } else if (tipo === "Envío") {
        return '<i class="fas fa-arrow-right text-warning me-2"></i>';
    }
    return '<i class="fas fa-exchange-alt me-2"></i>';
}

// Muestra los últimos movimientos según el filtro (jQuery)
function mostrarUltimosMovimientos(filtro) {
    var $list = $("#txList");
    var $noMsg = $("#noTxMsg");
    var txs = JSON.parse(localStorage.getItem("txs") || "[]");

    $list.empty();
    $noMsg.empty();

    // Filtrar transacciones según el tipo seleccionado (JS)
    var txsFiltradas = txs;
    if (filtro !== "") {
        txsFiltradas = txs.filter(function(tx) {
            return tx.type === filtro;
        });
    }

    if (txsFiltradas.length === 0) {
        // Si no hay transacciones, mostrar mensaje (jQuery)
        $noMsg.html('<i class="fas fa-inbox me-1"></i>No hay movimientos de este tipo');
    } else {
        // Mostrar las últimas 15 transacciones (jQuery)
        for (var i = 0; i < Math.min(15, txsFiltradas.length); i++) {
            var t = txsFiltradas[i];
            var $li = $('<li class="list-group-item"></li>');
            $li.html(
                getIconoTransaccion(t.type) +
                "<b>" + t.type + "</b> - " + money(t.amount) + "<br>" +
                '<span class="text-muted" style="font-size: 0.9rem;">' + t.detail + "<br>" +
                "<i class='fas fa-clock me-1'></i>" + t.date + '</span>'
            );
            $list.append($li);
        }
    }
}

// Espera a que el documento esté listo (jQuery)
$(document).ready(function() {
    // Mostrar todas las transacciones al cargar (jQuery)
    mostrarUltimosMovimientos("");

    // Cambiar filtro cuando se selecciona un tipo (jQuery)
    $("#filterType").on("change", function () {
        var filtro = $(this).val();
        mostrarUltimosMovimientos(filtro);
    });
});
