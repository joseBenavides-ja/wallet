/**
 * LOGIN.JS - Sistema de autenticación
 * Maneja el inicio de sesión y validación de credenciales
 */

var EMAIL_OK = "billetera@virtual.cl";
var PASS_OK = "1234";

// Si ya está logueado, redirige al menú principal (JS)
if (localStorage.getItem("logged") === "true") {
    window.location.href = "menu.html";
}

// Espera a que el documento esté listo (jQuery)
$(document).ready(function() {
    var $form = $("#loginForm");
    var $msg = $("#msg");

    // Maneja el envío del formulario de login (jQuery)
    $form.on("submit", function (e) {
        e.preventDefault();

        // Obtener valores del formulario (jQuery)
        var email = $("#email").val().trim();
        var pass = $("#password").val().trim();

        // Validar que no estén vacíos (JS)
        if (email === "" || pass === "") {
            $msg.html('<div class="alert alert-danger">Completa Email y Contraseña</div>');
            return;
        }

        // Verificar credenciales de demo (JS)
        if (email === EMAIL_OK && pass === PASS_OK) {
            localStorage.setItem("logged", "true");
            localStorage.setItem("currentUser", EMAIL_OK);
            $msg.html('<div class="alert alert-success">Login correcto ✅ Redirigiendo...</div>');

            // Redirigir al menú después de 1 segundo (JS)
            setTimeout(function () {
                window.location.href = "menu.html";
            }, 1000);
            return;
        }

        // Verificar usuarios registrados (JS)
        var users = JSON.parse(localStorage.getItem("users") || "[]");
        var usuarioEncontrado = null;

        // Buscar usuario por email o RUT (JS)
        for (var i = 0; i < users.length; i++) {
            if ((users[i].email === email || users[i].rut === email) && users[i].password === pass) {
                usuarioEncontrado = users[i];
                break;
            }
        }

        if (usuarioEncontrado) {
            // Login exitoso de usuario registrado (JS)
            localStorage.setItem("logged", "true");
            localStorage.setItem("currentUser", usuarioEncontrado.email);
            localStorage.setItem("userInfo", JSON.stringify(usuarioEncontrado));
            
            $msg.html('<div class="alert alert-success">¡Bienvenido ' + usuarioEncontrado.nombre + '! ✅ Redirigiendo...</div>');

            // Redirigir al menú después de 1 segundo (JS)
            setTimeout(function () {
                window.location.href = "menu.html";
            }, 1000);
        } else {
            $msg.html('<div class="alert alert-danger">Credenciales incorrectas ❌</div>');
        }
    });
});
