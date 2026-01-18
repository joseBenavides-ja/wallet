/**
 * MENU.JS - Menu principal
 * - Muestra saldo y ultimo movimiento
 * - Botones con leyenda "Redirigiendo..." + redireccion
 * - Efectos simples con jQuery (fade/slide)
 */

if (localStorage.getItem("logged") !== "true") {
  window.location.href = "login.html";
}

function money(n) {
  return "$" + Number(n).toLocaleString("es-CL");
}

function ensureInitialData() {
  if (localStorage.getItem("balance") === null) {
    localStorage.setItem("balance", "10000");
  }
  if (localStorage.getItem("txs") === null) {
    localStorage.setItem("txs", "[]");
  }
}

$(document).ready(function () {
  ensureInitialData();

  // Efecto de entrada
  $(".card-custom").hide().fadeIn(450);

  // Saldo
  var balance = Number(localStorage.getItem("balance") || "0");
  $("#balance").text(money(balance));

  // Ultimo movimiento
  var txs = JSON.parse(localStorage.getItem("txs") || "[]");
  if (txs.length > 0) {
    var t = txs[0];
    $("#lastTx").text("Ultimo: " + t.type + " - " + money(t.amount) + " - " + t.detail + " - " + t.date);
  }

  var $redirectMsg = $("#redirectMsg");

  function goTo(file, texto) {
    $redirectMsg.stop(true, true)
      .hide()
      .text("Redirigiendo a " + texto + "...")
      .slideDown(220);

    setTimeout(function () {
      window.location.href = file;
    }, 700);
  }

  // Botones
  $("#btnDeposit").on("click", function () { goTo("deposit.html", "depositar"); });
  $("#btnWithdraw").on("click", function () { goTo("withdraw.html", "retirar"); });
  $("#btnSend").on("click", function () { goTo("sendmoney.html", "enviar dinero"); });
  $("#btnTx").on("click", function () { goTo("transactions.html", "ultimos movimientos"); });

  // Pequeño efecto al pasar el mouse por los botones
  $(".btn").on("mouseenter", function () {
    $(this).stop(true, true).animate({ opacity: 0.92 }, 120);
  }).on("mouseleave", function () {
    $(this).stop(true, true).animate({ opacity: 1 }, 120);
  });

  // Logout
  $("#logoutBtn").on("click", function () {
    localStorage.removeItem("logged");
    window.location.href = "login.html";
  });
});
