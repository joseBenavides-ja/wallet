/**
 * RECEIVE.JS - Simular recepcion de fondos
 * Selecciona un contacto (remitente), ingresa un monto y suma al saldo.
 */

if (localStorage.getItem("logged") !== "true") {
  window.location.href = "login.html";
}

function money(n) {
  return "$" + Number(n).toLocaleString("es-CL");
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

function getContacts() {
  var contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
  if (contacts.length === 0) {
    contacts = [{
      name: "Marco Silva",
      cbu: "1234567890123456789012",
      alias: "MARCO.SILVA",
      bank: "Banco Demo"
    }];
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }
  return contacts;
}

function renderBalance() {
  var balance = Number(localStorage.getItem("balance") || "0");
  $("#balanceNow").text(money(balance));
}

function renderContacts(filterText) {
  var contacts = getContacts();
  var $list = $("#contactsList");
  var $noMsg = $("#noContactsMsg");
  $list.empty();
  $noMsg.empty();

  var filtered = contacts;
  if (filterText && filterText.trim() !== "") {
    var q = filterText.toLowerCase();
    filtered = contacts.filter(function (c) {
      return (
        c.name.toLowerCase().includes(q) ||
        c.alias.toLowerCase().includes(q) ||
        c.bank.toLowerCase().includes(q) ||
        String(c.cbu).toLowerCase().includes(q)
      );
    });
  }

  if (filtered.length === 0) {
    $noMsg.html('<i class="fas fa-search me-1"></i>No hay contactos que coincidan con la busqueda');
    return;
  }

  for (var i = 0; i < filtered.length; i++) {
    var c = filtered[i];
    var indexOriginal = contacts.findIndex(function (cc) {
      return cc.cbu === c.cbu && cc.alias === c.alias;
    });

    var $li = $('<li class="list-group-item"></li>');
    $li.html(
      '<div class="form-check">' +
        '<input class="form-check-input" type="radio" name="contactRadio" id="c' + indexOriginal + '" value="' + indexOriginal + '">' +
        '<label class="form-check-label" for="c' + indexOriginal + '">' +
          '<i class="fas fa-user-circle me-2"></i><b>' + c.name + '</b><br>' +
          '<span class="text-white-50" style="font-size: 0.9rem;">' +
            '<i class="fas fa-id-card me-1"></i>RUT: ' + c.rut + ' | <i class="fas fa-building-columns me-1"></i>Banco: ' + c.bank + '<br>' +
            '<i class="fas fa-envelope me-1"></i>Email: ' + c.email + '<br>' +
            '<i class="fas fa-credit-card me-1"></i>Tipo: ' + c.accountType + ' | <i class="fas fa-hashtag me-1"></i>Nº Cuenta: ' + c.accountNumber +
          '</span>' +
        '</label>' +
      '</div>'
    );
    $list.append($li);
  }
}

function renderSuggestions(text) {
  var $sug = $("#suggestions");
  $sug.empty();

  if (!text || text.trim().length < 1) {
    $sug.hide();
    return;
  }

  var q = text.toLowerCase();
  var contacts = getContacts();
  var matches = contacts.filter(function (c) {
    return c.name.toLowerCase().includes(q) || c.alias.toLowerCase().includes(q);
  }).slice(0, 5);

  if (matches.length === 0) {
    $sug.hide();
    return;
  }

  matches.forEach(function (c) {
    var $item = $('<button type="button" class="list-group-item list-group-item-action"></button>');
    $item.html('<b>' + c.name + '</b> <span class="text-white-50" style="font-size:0.85rem;">(' + c.alias + ')</span>');
    $item.on("click", function () {
      $("#searchContact").val(c.name);
      renderContacts(c.name);
      $sug.hide();
    });
    $sug.append($item);
  });

  $sug.show();
}

$(document).ready(function () {
  renderBalance();
  renderContacts("");

  // Modal (Bootstrap)
  var $modal = $("#contactModal");
  var modal = new bootstrap.Modal($modal[0]);

  $("#openModalBtn").on("click", function () {
    $("#modalAlert").empty();
    modal.show();
  });

  // Buscador + autocompletar simple
  $("#searchContact").on("keyup", function () {
    var q = $(this).val();
    renderContacts(q);
    renderSuggestions(q);
  });

  // Mostrar boton solo si hay contacto seleccionado
  $(document).on("change", 'input[name="contactRadio"]', function () {
    $("#btnReceive").removeClass("d-none");
  });

  // Guardar contacto
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    var name = $("#cName").val().trim();
    var cbu = $("#cCbu").val().trim();
    var alias = $("#cAlias").val().trim();
    var bank = $("#cBank").val().trim();

    var $modalAlert = $("#modalAlert");
    $modalAlert.empty();

    if (!name || !cbu || !alias || !bank) {
      $modalAlert.html('<div class="alert alert-danger">Completa todos los campos.</div>');
      return;
    }

    if (!/^\d{22}$/.test(cbu)) {
      $modalAlert.html('<div class="alert alert-danger">El CBU debe tener 22 digitos numericos.</div>');
      return;
    }

    var contacts = getContacts();

    var yaExiste = contacts.some(function (c) {
      return c.cbu === cbu || c.alias.toLowerCase() === alias.toLowerCase();
    });

    if (yaExiste) {
      $modalAlert.html('<div class="alert alert-danger">Ese CBU o Alias ya existe.</div>');
      return;
    }

    contacts.push({ name: name, cbu: cbu, alias: alias, bank: bank });
    localStorage.setItem("contacts", JSON.stringify(contacts));

    $("#cName").val("");
    $("#cCbu").val("");
    $("#cAlias").val("");
    $("#cBank").val("");

    $modalAlert.html('<div class="alert alert-success">Contacto guardado ✅</div>');

    setTimeout(function () {
      modal.hide();
      renderContacts($("#searchContact").val());
      renderSuggestions($("#searchContact").val());
    }, 600);
  });

  // Confirmar recepcion
  $("#receiveForm").on("submit", function (e) {
    e.preventDefault();

    var amount = Number($("#receiveAmount").val());
    var $msg = $("#msg");
    $msg.empty();

    if (!amount || amount <= 0) {
      $msg.html('<div class="alert alert-danger"><i class="fas fa-exclamation-circle me-2"></i>Ingresa un monto valido</div>');
      return;
    }

    var $selected = $('input[name="contactRadio"]:checked');
    if ($selected.length === 0) {
      $msg.html('<div class="alert alert-danger"><i class="fas fa-exclamation-circle me-2"></i>Selecciona un contacto</div>');
      return;
    }

    var contacts = getContacts();
    var contact = contacts[Number($selected.val())];

    var prevBalance = Number(localStorage.getItem("balance") || "0");
    var newBalance = prevBalance + amount;
    localStorage.setItem("balance", String(newBalance));

    addTx("Transferencia recibida", amount, "Recibido de " + contact.name + " (" + contact.alias + ")");

    $msg.html(
      '<div class="alert alert-success">' +
        '<h5><i class="fas fa-check-circle me-2"></i>Recepcion confirmada</h5>' +
        '<p class="mb-2"><strong>Remitente:</strong> ' + contact.name + '</p>' +
        '<p class="mb-2"><strong>Monto recibido:</strong> ' + money(amount) + '</p>' +
        '<p class="mb-0"><strong>Nuevo saldo:</strong> ' + money(newBalance) + '</p>' +
      '</div>' +
      '<div class="alert alert-info mt-3"><i class="fas fa-info-circle me-2"></i>Volviendo al menu en 2 segundos...</div>'
    );

    renderBalance();

    setTimeout(function () {
      window.location.href = "menu.html";
    }, 2000);
  });
});
