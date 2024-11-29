// Guardar la imagen en localStorage
function saveImg() {
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader(); // Crea un objeto FileReader(), el cual se encarga de leer el archivo

        reader.onloadend = () => {
            let base64String = reader.result; // El contenido del archivo se convierte en una cadena de texto en formato Base64
            console.log(base64String);
            document.getElementById('previewImg').setAttribute("src", base64String);
            form.addEventListener("submit", () => {
                localStorage.setItem('profilePic_' + emailField.value, base64String); // Guarda en localStorage la cadena Base64
            })
        };

        reader.onerror = (error) => {
            console.error('Error de FileReader:', error);
        };

        reader.readAsDataURL(file);
    } else {
        console.error('No se ha seleccionado ningún archivo');
    }
}

// Mostrar la imagen de perfil
function showImg() {
    const userEmail = localStorage.getItem("email");
    let savedImg = localStorage.getItem("profilePic_" + userEmail);
    if (savedImg) {
        document.getElementById('previewImg').setAttribute("src", savedImg);
    }
}

const fileInput = document.getElementById('fileInput');
const form = document.querySelector("form");
const emailField = document.getElementById("email");
const firstNameField = document.getElementById("firstName");
const secondNameField = document.getElementById("secondName");
const lastNameField = document.getElementById("lastName");
const secondLastNameField = document.getElementById("secondLastName");
const phoneField = document.getElementById("phone");

// Muestra los datos desde el localStorage
function showStoredDATA() {
    const userEmail = localStorage.getItem("email");
    let email = localStorage.getItem('email');
    let userData = JSON.parse(localStorage.getItem("userProfile_" + userEmail));
    if (userData) {
        emailField.value = userData.email;
        firstNameField.value = userData.firstName;
        secondNameField.value = userData.secondName;
        lastNameField.value = userData.lastName;
        secondLastNameField.value = userData.secondLastName;
        phoneField.value = userData.phone;
    } else {
        emailField.value = email;
    }
}

document.addEventListener("DOMContentLoaded", function () {

    // Validación de los campos obligatorios
    function validateForm() {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = emailField.value.trim();

        if (firstName === "" || lastName === "" || email === "") {
            alert("Por favor, completa todos los campos obligatorios: Nombre, Apellido y E-mail.");
            return false; // No permite el guardado si hay campos obligatorios vacíos
        }
        return true;
    }

    // Manejar el envío del formulario y guardar datos en localStorage
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateForm()) {
            return; // Detener la ejecución si los campos obligatorios no están completos
        }

        const userEmail = emailField.value;
        localStorage.setItem("email", userEmail);

        const userProfile = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            secondName: document.getElementById("secondName").value,
            secondLastName: document.getElementById("secondLastName").value,
            phone: document.getElementById("phone").value,
            email: emailField.value,
        };

        // Guardar el objeto completo del perfil en localStorage
        localStorage.setItem("userProfile_" + userEmail, JSON.stringify(userProfile));
        localStorage.setItem('email', emailField.value)
        login_check();
        Swal.fire({
            text: 'Datos guardados correctamente!',
            icon: 'success',
            confirmButtonText: 'Continuar',
        })
    });

    // Cargar imagen y datos desde localStorage
    showImg();
    showStoredDATA();

    // Manejar el cambio de imagen
    fileInput.addEventListener("change", () => {
        saveImg();
    })
});
