document.addEventListener("DOMContentLoaded", function () {
//Campos no vacios y redireccionar a index//
    document.getElementById("redirect").addEventListener("click", async (event) => {
        event.preventDefault();

        let password = document.getElementById("password").value;
        let email = document.getElementById("email").value;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email !== "" && password !== "") {
            if (!emailPattern.test(email)) {
                Swal.fire({
                    text: 'Por favor, ingresa un email válido',
                    icon: 'error',
                    confirmButtonText: 'Volver a intentar'
                  })
                return; /*  Detiene la ejecución si el email no es válido */
            }
            try {
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: "admin", password: "admin"}),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("email", email);
                    window.location.href = "index.html";
                }
            } catch (error) {
                Swal.fire({
                    text: data.message || "Error al iniciar sesión",
                    icon: 'error',
                    confirmButtonText: "Volver a intentar",
                })
            }
        } else {
            Swal.fire({
                text: 'Por favor, completa todos los campos',
                icon: 'info',
                confirmButtonText: 'Volver a intentar',
              });
        }
    });
});
