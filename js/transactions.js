/**
 * TRANSACTIONS.JS - Historial de movimientos (con jQuery)
 * - Lee transacciones desde LocalStorage (txs)
 * - Filtra por tipo
 */

if (localStorage.getItem("logged") !== "true") {
  window.location.href = "login.html";
}

function money(n) {
  return "$" + Number(n).toLocaleString("es-CL");
}

// Devuelve un tipo "legible" (sirve si algun dia guardas codigos en vez de texto)
function getTipoTransaccion(tipo) {
  var map = {
    deposit: "Depósito",
    withdraw: "Retiro",
    send: "Transferencia enviada",
    purchase: "Compra"
  };
  return map[tipo] || tipo;
}

function getIconoTransaccion(tipo) {
  var t = getTipoTransaccion(tipo);
  if (t === "Depósito") return '<i class="fas fa-arrow-down text-success me-2"></i>';
  if (t === "Retiro") return '<i class="fas fa-arrow-up text-warning me-2"></i>';
  if (t === "Transferencia enviada") return '<i class="fas fa-paper-plane text-primary me-2"></i>';
  if (t === "Transferencia recibida") return '<i class="fas fa-download text-success me-2"></i>';
  if (t === "Compra") return '<i class="fas fa-shopping-cart text-info me-2"></i>';
  return '<i class="fas fa-exchange-alt me-2"></i>';
}

function mostrarUltimosMovimientos(filtro) {
  var $list = $("#txList");
  var $noMsg = $("#noTxMsg");

  var txs = JSON.parse(localStorage.getItem("txs") || "[]");

  $list.empty();
  $noMsg.empty();

  var txsFiltradas = txs;
  if (filtro && filtro !== "") {
    txsFiltradas = txs.filter(function (tx) {
      return getTipoTransaccion(tx.type) === filtro;
    });
  }

  if (txsFiltradas.length === 0) {
    $noMsg.html('<i class="fas fa-inbox me-1"></i>No hay movimientos para mostrar');
    return;
  }

  for (var i = 0; i < Math.min(15, txsFiltradas.length); i++) {
    var tx = txsFiltradas[i];
    var tipo = getTipoTransaccion(tx.type);

    var $li = $('<li class="list-group-item"></li>');
    $li.html(
      getIconoTransaccion(tx.type) +
      '<b>' + tipo + '</b> - ' + money(tx.amount) + '<br>' +
      '<span class="text-white-50" style="font-size: 0.9rem;">' +
        tx.detail + '<br>' +
        "<i class='fas fa-clock me-1'></i>" + tx.date +
      '</span>'
    );

    $list.append($li);
  }
}

$(document).ready(function () {
  // Animacion simple
  $(".card-custom").hide().fadeIn(450);

  mostrarUltimosMovimientos("");

  $("#filterType").on("change", function () {
    mostrarUltimosMovimientos($(this).val());
  });
});
