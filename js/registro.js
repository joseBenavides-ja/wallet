/**
 * REGISTRO.JS - Sistema de registro de cuentas
 * Permite a nuevos usuarios crear una cuenta en la billetera virtual
 */

// Si ya está logueado, redirige al menú principal (JS)
if (localStorage.getItem("logged") === "true") {
    window.location.href = "menu.html";
}

// Espera a que el documento esté listo (jQuery)
$(document).ready(function() {
    var $form = $("#registerForm");
    var $msg = $("#msg");

    // Maneja el envío del formulario de registro (jQuery)
    $form.on("submit", function (e) {
        e.preventDefault();

        // Obtener valores del formulario (jQuery)
        var nombre = $("#nombre").val().trim();
        var apellido = $("#apellido").val().trim();
        var rut = $("#rut").val().trim();
        var email = $("#email").val().trim();
        var banco = $("#banco").val().trim();
        var tipoCuenta = $("#tipoCuenta").val().trim();
        var numeroCuenta = $("#numeroCuenta").val().trim();
        var telefono = $("#telefono").val().trim();
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();

        // Validar que no estén vacíos (JS)
        if (nombre === "" || apellido === "" || rut === "" || email === "" || banco === "" || tipoCuenta === "" || numeroCuenta === "" || telefono === "" || password === "" || confirmPassword === "") {
            $msg.html('<div class="alert alert-danger">Completa todos los campos</div>');
            return;
        }

        // Validar que las contraseñas coincidan (JS)
        if (password !== confirmPassword) {
            $msg.html('<div class="alert alert-danger">Las contraseñas no coinciden</div>');
            return;
        }

        // Validar que la contraseña tenga mínimo 4 caracteres (JS)
        if (password.length < 4) {
            $msg.html('<div class="alert alert-danger">La contraseña debe tener al menos 4 caracteres</div>');
            return;
        }

        // Crear objeto de usuario (JS)
        var user = {
            nombre: nombre,
            apellido: apellido,
            rut: rut,
            email: email,
            banco: banco,
            tipoCuenta: tipoCuenta,
            numeroCuenta: numeroCuenta,
            telefono: telefono,
            password: password
        };

        // Obtener usuarios existentes (JS)
        var users = JSON.parse(localStorage.getItem("users") || "[]");

        // Validar que el RUT no esté registrado (JS)
        var rutExiste = users.some(function(u) {
            return u.rut === rut;
        });

        if (rutExiste) {
            $msg.html('<div class="alert alert-danger">Este RUT ya está registrado</div>');
            return;
        }

        // Validar que el email no esté registrado (JS)
        var emailExiste = users.some(function(u) {
            return u.email === email;
        });

        if (emailExiste) {
            $msg.html('<div class="alert alert-danger">Este correo ya está registrado</div>');
            return;
        }

        // Guardar nuevo usuario (JS)
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));

        // Inicializar balance y transacciones para el nuevo usuario si es necesario (JS)
        localStorage.setItem("balance", "0");
        localStorage.setItem("txs", "[]");
        localStorage.setItem("contacts", "[]");

        // Mostrar mensaje de éxito (jQuery)
        $msg.html('<div class="alert alert-success">¡Cuenta creada exitosamente! ✅ Redirigiendo a login...</div>');

        // Redirigir al login después de 1500ms (JS)
        setTimeout(function () {
            window.location.href = "login.html";
        }, 1500);
    });
});
