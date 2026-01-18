/**
 * WITHDRAW.JS - Sistema de retiros
 * Permite al usuario retirar dinero (resta saldo) y registra el movimiento
 */

if (localStorage.getItem("logged") !== "true") {
  window.location.href = "login.html";
}

function money(n) {
  return "$" + Number(n).toLocaleString("es-CL");
}

function renderBalance() {
  var balance = Number(localStorage.getItem("balance") || "0");
  $("#balanceNow").text(money(balance));
}

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

$(document).ready(function () {
  renderBalance();

  var $msg = $("#msg");

  $("#withdrawForm").on("submit", function (e) {
    e.preventDefault();

    var amount = Number($("#withdrawAmount").val());
    if (!amount || amount <= 0) {
      $msg.html('<div class="alert alert-danger"><i class="fas fa-exclamation-circle me-2"></i>Ingresa un monto valido</div>');
      return;
    }

    var prevBalance = Number(localStorage.getItem("balance") || "0");
    if (amount > prevBalance) {
      $msg.html('<div class="alert alert-danger"><i class="fas fa-exclamation-circle me-2"></i>Saldo insuficiente</div>');
      return;
    }

    var newBalance = prevBalance - amount;
    localStorage.setItem("balance", String(newBalance));

    addTx("Retiro", amount, "Retiro de fondos");

    $("#summaryAmount").text(money(amount));
    $("#summaryPrevBalance").text(money(prevBalance));
    $("#summaryNewBalance").text(money(newBalance));
    $("#withdrawSummary").show();

    $("#withdrawAmount").val("");

    $msg.html('<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>Retiro OK. Volviendo al menu en 2 segundos...</div>');

    renderBalance();

    setTimeout(function () {
      window.location.href = "menu.html";
    }, 2000);
  });
});
