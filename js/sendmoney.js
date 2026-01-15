/**
 * SENDMONEY.JS - Sistema de envío de dinero
 * Permite enviar dinero a contactos guardados y gestionar contactos
 */

// Si no está logueado, redirige al login (JS)
if (localStorage.getItem("logged") !== "true") {
    window.location.href = "login.html";
}

// Convierte números a formato de moneda (ej: $1.000) (JS)
function money(n) {
    return "$" + Number(n).toLocaleString("es-CL");
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

// Obtiene el saldo del localStorage y lo muestra en el DOM (jQuery)
function renderBalance() {
    var balance = Number(localStorage.getItem("balance") || "0");
    $("#balanceNow").text(money(balance));
}

// Obtiene los contactos y los muestra como opciones de radio (jQuery)
function renderContacts(filtro) {
    var contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
    
    // Inicializar con contacto demo si no hay contactos (JS)
    if (contacts.length === 0) {
        contacts = [{
            name: "Marco Silva",
            email: "pureba@billetera.cl",
            bank: "Falabella",
            accountType: "Corriente",
            accountNumber: "11112555522"
        }];
        localStorage.setItem("contacts", JSON.stringify(contacts));
    }
    
    var $list = $("#contactsList");
    var $noMsg = $("#noContactsMsg");
    $list.empty();
    $noMsg.empty();

    // Filtrar contactos según el término de búsqueda (JS)
    var contactosFiltrados = contacts;
    if (filtro && filtro !== "") {
        contactosFiltrados = contacts.filter(function(c) {
            var busqueda = filtro.toLowerCase();
            return c.name.toLowerCase().includes(busqueda) || c.email.toLowerCase().includes(busqueda);
        });
    }

    if (contactosFiltrados.length === 0) {
        $noMsg.html('<i class="fas fa-search me-1"></i>No hay contactos que coincidan con la búsqueda');
        return;
    }

    // Itera sobre los contactos y crea elementos de radio para cada uno (jQuery)
    for (var i = 0; i < contactosFiltrados.length; i++) {
        var c = contactosFiltrados[i];
        // Encontrar el índice original del contacto (JS)
        var indexOriginal = contacts.findIndex(function(contact) {
            return contact.email === c.email;
        });
        
        var $li = $('<li class="list-group-item"></li>');
        $li.html(
            '<div class="form-check">' +
            '  <input class="form-check-input" type="radio" name="contactRadio" id="c' + indexOriginal + '" value="' + indexOriginal + '">' +
            '  <label class="form-check-label" for="c' + indexOriginal + '">' +
            '    <i class="fas fa-user-circle me-2"></i><b>' + c.name + '</b><br>' +
            '    <span class="text-muted" style="font-size: 0.9rem;"><i class="fas fa-envelope me-1"></i>Email: ' + c.email + ' | <i class="fas fa-bank me-1"></i>Banco: ' + c.bank + '<br>' +
            '    <i class="fas fa-credit-card me-1"></i>Cuenta ' + c.accountType + ': ' + c.accountNumber + '</span>' +
            '  </label>' +
            '</div>'
        );
        $list.append($li);
    }
}

// Espera a que el documento esté listo (jQuery)
$(document).ready(function() {
    renderBalance();
    renderContacts("");

    // Buscar contactos en tiempo real (jQuery)
    $("#searchContact").on("keyup", function () {
        var busqueda = $(this).val();
        renderContacts(busqueda);
    });

    // Inicializar el modal para agregar contactos (jQuery)
    var $modal = $("#contactModal");
    var modal = new bootstrap.Modal($modal[0]);

    // Abre el modal cuando se hace clic en el botón (jQuery)
    $("#openModalBtn").on("click", function () {
        modal.show();
    });

    // Maneja el envío del formulario para agregar contactos (jQuery)
    $("#contactForm").on("submit", function (e) {
        e.preventDefault();

        // Obtener valores del formulario (jQuery)
        var name = $("#cName").val().trim();
        var email = $("#cEmail").val().trim();
        var bank = $("#cBank").val().trim();
        var accountType = $("#cAccountType").val().trim();
        var accountNumber = $("#cAccountNumber").val().trim();

        // Validar que todos los campos estén completos (JS)
        if (name === "" || email === "" || bank === "" || accountType === "" || accountNumber === "") {
            alert("Completa todos los campos");
            return;
        }

        // Guardar contacto en localStorage (JS)
        var contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
        contacts.push({ name: name, email: email, bank: bank, accountType: accountType, accountNumber: accountNumber });
        localStorage.setItem("contacts", JSON.stringify(contacts));

        // Limpiar formulario (jQuery)
        $("#cName").val("");
        $("#cEmail").val("");
        $("#cBank").val("");
        $("#cAccountType").val("");
        $("#cAccountNumber").val("");

        // Cerrar modal y actualizar lista de contactos (jQuery)
        modal.hide();
        renderContacts("");
        $("#searchContact").val("");
    });

    var $msg = $("#msg");

    // Maneja el envío del formulario para enviar dinero (jQuery)
    $("#sendForm").on("submit", function (e) {
        e.preventDefault();

        // Obtener monto a enviar (jQuery)
        var amount = Number($("#sendAmount").val());
        if (!amount || amount <= 0) {
            $msg.html('<div class="alert alert-danger"><i class="fas fa-exclamation-circle me-2"></i>Ingresa un monto válido</div>');
            return;
        }

        // Validar que haya un contacto seleccionado (jQuery)
        var $selected = $('input[name="contactRadio"]:checked');
        if ($selected.length === 0) {
            $msg.html('<div class="alert alert-danger"><i class="fas fa-exclamation-circle me-2"></i>Selecciona un contacto</div>');
            return;
        }

        // Obtener el contacto seleccionado (JS)
        var contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
        var contact = contacts[Number($selected.val())];

        // Validar saldo suficiente (JS)
        var balance = Number(localStorage.getItem("balance") || "0");
        if (amount > balance) {
            $msg.html('<div class="alert alert-danger"><i class="fas fa-exclamation-circle me-2"></i>Saldo insuficiente ❌</div>');
            return;
        }

        // Realizar transacción (JS)
        var newBalance = balance - amount;
        localStorage.setItem("balance", String(newBalance));

        // Registrar transacción (JS)
        addTx("Envío", amount, "Enviado a " + contact.name);

        // Mostrar confirmación de envío (jQuery)
        var confirmationMsg = '<div class="alert alert-success">' +
            '<h5><i class="fas fa-check-circle me-2"></i>¡Envío Realizado!</h5>' +
            '<p class="mb-2"><strong>Beneficiario:</strong> ' + contact.name + '</p>' +
            '<p class="mb-2"><strong>Monto enviado:</strong> ' + money(amount) + '</p>' +
            '<p class="mb-0"><strong>Nuevo saldo:</strong> ' + money(newBalance) + '</p>' +
            '</div>';
        $msg.html(confirmationMsg);

        // Mostrar mensaje de éxito con redirección (jQuery)
        var successMsg = '<div class="alert alert-info mt-3"><i class="fas fa-info-circle me-2"></i>Volviendo al menú en 2 segundos...</div>';
        $msg.append(successMsg);

        renderBalance();

        // Redirigir al menú después de 2 segundos (JS)
        setTimeout(function () {
            window.location.href = "menu.html";
        }, 2000);
    });
});

