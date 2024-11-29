const id = localStorage.getItem("productID")
const PRODUCT_URL = PRODUCT_INFO_URL + id + EXT_TYPE;

function showProduct(element) {

  let categoryName = `<h1>${element.category}</h1>`
  document.getElementById("categoryName").innerHTML = categoryName;
  let imagesHtml = '';

  for (let i = 0; i < element.images.length; i++) {
    const image = element.images[i];
    imagesHtml += `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
          <img src="${image}" class="d-block w-100">
        </div>`;
  }
  document.getElementById("carousel-inner").innerHTML = imagesHtml;

  let productINFO = '';
  productINFO += `
    <div class="row">
    <h2> ${element.name} </h2>
    <p id="descripcion"> ${element.description} </p>
    <div id="precio-vendidos">
    <div class="precio">
    <p> Costo: ${element.cost} ${element.currency} </p>
    </div>
    <div class="vendidos">
    <p> Vendidos: ${element.soldCount} </p>
    </div>
    </div>
    </div>
    `
  document.getElementById("info").innerHTML = productINFO;
  showRelatedProducts(element.relatedProducts)
}

function showRelatedProducts(array) {
  let htmlContentToAppend = '';
  for (let i = 0; i < array.length; i++) {
    let product = array[i];
    htmlContentToAppend += `
      <div class="col-lg-3 col-md-4 col-6 mb-1">
          <div class="card product-item" data-product-id="${product.id}" style="cursor: pointer;">
              <img src="${product.image}" class="card-img-top" alt="${product.name}">
              <div class="card-body">
                  <h5 class="card-title">${product.name}</h5>
              </div>
          </div>
      </div>`;
  }

  document.getElementById("related-products-container").innerHTML = htmlContentToAppend;
  selectedProduct();
}

function selectedProduct() {
  let productItem = document.querySelectorAll(".product-item");
  productItem.forEach(function (product) {
    product.addEventListener("click", function () {
      let idProduct = product.getAttribute("data-product-id");
      console.log("Selected product ID:", idProduct);
      localStorage.setItem("productID", idProduct);
      window.location.href = "product-info.html";
    });
  });
}

// Para cargar comentarios de los productos
const commentsURL = PRODUCT_INFO_COMMENTS_URL + id + EXT_TYPE; // Creo URL de comentarios

let existingComments = JSON.parse(localStorage.getItem("comments")) ?? []; // Si JSON.parse devuelve null o undefined, existingComments será un array vacío

function showComments(commentsArray) {
  let htmlContentToAppend = "";

  for (let i = 0; i < commentsArray.length; i++) {
    let comment = commentsArray[i];
    let stars = "";
    let vote = comment.score;

    for (let s = 0; s < 5; s++) { // Pinta las estrellas en base al voto
      if (s < vote) {
        stars += `<i class="fa fa-star checked" aria-hidden="true"></i>`;
      } else {
        stars += `<i class="fa fa-star-o unchecked" aria-hidden="true"></i>`;
      }
    }
    let commentDate = new Date(comment.dateTime);
    let date = commentDate.getDate() + "/" + (commentDate.getMonth() + 1).toString().padStart(2, '0') + "/" + commentDate.getFullYear() + " "
      + commentDate.getHours().toString().padStart(2, '0') + ":" + commentDate.getMinutes().toString().padStart(2, '0') + ":" + commentDate.getSeconds().toString().padStart(2, '0');
    //padStart rellena el string con 0 al principio si es necesario, para que el string tenga una longitud de dos caracteres
    htmlContentToAppend += `
        <div class="comment">
            <strong>${comment.user}</strong> - ${date}
            <div>${stars}</div>
            <p>${comment.description}</p>
        </div>
        `;
  }

  document.getElementById("comments-section").innerHTML += htmlContentToAppend;
}

// Función para cargar la calificación y comentario nuevo
const btnSubmit = document.getElementById("submitRating");

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();

  let commentText = document.getElementById("userComment").value;
  let commentValue = document.getElementById("userRating").value;
  const localUser = localStorage.getItem("email");

  if (commentText && commentValue) {
    const newComment = {
      user: localUser,
      description: commentText,
      score: commentValue,
      dateTime: new Date().toISOString(),
      product: id // Para asociar el comentario con el producto correcto
    };

    // Guardar el comentario en localStorage
    saveCommentToLocalStorage(newComment);

    // Limpiar los campos del formulario
    document.getElementById("userComment").value = '';
    document.getElementById("userRating").value = '';

    // Mostrar solo el nuevo comentario
    showComments([newComment]);
  } else {
    Swal.fire({
      text: 'El comentario no puede estar vacío',
      icon: 'warning',
      confirmButtonText: 'Volver a intentar'
    })
  }
});

// Función para cargar comentarios desde localStorage
function loadCommentsFromLocalStorage() {
  try {
    console.log("Comentarios cargados desde localStorage:", existingComments);
    const filteredComments = existingComments.filter(comment => comment.product === id);
    return filteredComments; // Devolvemos los comentarios filtrados
  } catch (error) {
    console.error("Error al cargar los comentarios desde localStorage:", error);
    return [];
  }
}

// Función para guardar comentarios en localStorage
function saveCommentToLocalStorage(comment) {
  existingComments.push(comment); // Agregar el nuevo comentario
  localStorage.setItem("comments", JSON.stringify(existingComments)); // Guardar en localStorage
}

// Al cargar la página, mostrar los comentarios
document.addEventListener("DOMContentLoaded", () => {
  getJSONData(PRODUCT_URL)
    .then(result => {
      if (result.status === 'ok') {
        productInfo = result.data;
        showProduct(productInfo);
      }
    });
  // Para que aparezcan las estrellas en función del valor calificación 
  const stars = document.querySelectorAll("#rating-stars .fa");
  const selectRating = document.getElementById("userRating");

  // Cambiar estrellas al hacer clic
  stars.forEach(star => {
    star.addEventListener("click", function () {
      const ratingValue = this.getAttribute("data-value");
      selectRating.value = ratingValue;
      updateStars(ratingValue);
    });
  });

  // Actualizar estrellas según el valor seleccionado
  selectRating.addEventListener("change", function () {
    updateStars(this.value);
  });

  function updateStars(rating) {
    stars.forEach(star => {
      if (parseInt(star.getAttribute("data-value")) <= rating) {
        star.classList.remove("fa-star-o");
        star.classList.add("fa-star");
      } else {
        star.classList.remove("fa-star");
        star.classList.add("fa-star-o");
      }
    });
  }

  const localComments = loadCommentsFromLocalStorage(); // Cargar comentarios del localStorage

  // Mostrar todos los comentarios (API + localStorage)
  getJSONData(commentsURL).then(function (result) {
    if (result.status === "ok") {
      comments = result.data;
      showComments(comments);
      showComments(localComments);
    }
  });
});

/* Agregar al carrito */
function agregarAlCarrito() {
  let listaCarrito = [];
  let carritoGuardado = localStorage.getItem("carrito");

  if (carritoGuardado) {
    listaCarrito = JSON.parse(carritoGuardado);
  }

  let productId = localStorage.getItem("productID");
  if (productId) {
    let producto = { id: productId, name: productInfo.name, cost: productInfo.cost, currency: productInfo.currency, image: productInfo.images[0], cantidad: 1 };

    let productoExistente = listaCarrito.find(item => item.id === productId);

    if (productoExistente) {
      Swal.fire({
        text: 'Este producto ya está en el carrito.',
        icon: 'info',
        confirmButtonText: 'Continuar',
      });
    } else {
      listaCarrito.push(producto);
      localStorage.setItem("carrito", JSON.stringify(listaCarrito));
      Swal.fire({
        text: 'Producto agregado al carrito.',
        icon: 'success',
        confirmButtonText: 'Continuar',
      });
    }
  }
  actualizarBadgeCarrito()
}

document.getElementById("addToCartButton").addEventListener("click", agregarAlCarrito);

/* Comprar producto */
function comprarProducto() {
  let listaCarrito = JSON.parse(localStorage.getItem("carrito")) ?? [];

  let productId = localStorage.getItem("productID");
  if (productId) {
    let productoAComprar = { id: productId, name: productInfo.name, cost: productInfo.cost, currency: productInfo.currency, image: productInfo.images[0], cantidad: 1 };

    let productoExistente = listaCarrito.find(item => item.id === productId);

    if (!productoExistente) {
      listaCarrito.push(productoAComprar);
      localStorage.setItem("carrito", JSON.stringify(listaCarrito));
    }

    window.location.href = "cart.html";
  }
}
document.getElementById("buyButton").addEventListener("click", comprarProducto);
