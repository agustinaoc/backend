const CATEGORIES_URL = "http://localhost:3000/API/cats/cat.json";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/API/sell/publish.json";
const PRODUCTS_URL = "http://localhost:3000/API/cats_products/";
const PRODUCT_INFO_URL = "http://localhost:3000/API/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/API/products_comments/";
const CART_INFO_URL = "http://localhost:3000/API/user_cart/";
const CART_BUY_URL = "http://localhost:3000/API/cart/buy.json";
const EXT_TYPE = ".json";
const token = localStorage.getItem("token");

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": token, // Incluye el token en los headers
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

function login_check() {

  let email = localStorage.getItem("email")

  if (localStorage.getItem("email") == null ){
  window.location.href = "login.html";
   } else {
    document.getElementById("emailButton").innerHTML = email
   }
   document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("email");
    window.location.href = "login.html"; 
});
}

login_check();

 // Lógica de modo oscuro
 const btnSwitch = document.querySelector('#switch');

 // Cargar preferencia de modo oscuro desde localStorage
 if (localStorage.getItem('dark-mode') === 'true') {
     document.body.classList.add('dark');
     btnSwitch.classList.add('active');
 }

 btnSwitch.addEventListener('click', () => {
     document.body.classList.toggle('dark');
     btnSwitch.classList.toggle('active');

     // Guardar el estado del modo oscuro en localStorage
     if (document.body.classList.contains('dark')) {
         localStorage.setItem('dark-mode', 'true');
     } else {
         localStorage.setItem('dark-mode', 'false');
     }
 });

// Función para actualizar el badge del carrito
function actualizarBadgeCarrito() {
  const cart = JSON.parse(localStorage.getItem("carrito")) || [];
  const badge = document.getElementById("cartBadge");
  const totalProductos = cart.reduce((acc, producto) => acc + producto.cantidad, 0);
  if (badge) {
    badge.textContent = totalProductos;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarBadgeCarrito();
});