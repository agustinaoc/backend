const ORDER_ASC_BY_PRICE = "MINMAX";
const ORDER_DESC_BY_PRICE = "MAXMIN";
const ORDER_BY_PROD_SOLDCOUNT = "VENDIDOS";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minPrice = undefined;
let maxPrice = undefined;
let catName = "";

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE) 
        {
        result = array.sort((a, b) => (a.cost) - (b.cost));
    } else if (criteria === ORDER_DESC_BY_PRICE) 
        {
        result = array.sort((a, b) => (b.cost) - (a.cost));
    } else if (criteria === ORDER_BY_PROD_SOLDCOUNT) 
        {
        result = array.sort((a, b) => b.soldCount - a.soldCount);
    }
    return result;
}


function showProductsList(products = currentProductsArray) {
    let htmlContentToAppend = "";
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
    

        
        if (((minPrice == undefined) || (minPrice != undefined && parseFloat(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseFloat(product.cost) <= maxPrice))) {
            
            htmlContentToAppend += `
            <div class="pb-5 container product-item" data-product-id="${product.id}">
                <div class="card mb-4 shadow-sm custom-card cursor-active">
                    <div class="card-body d-flex align-items-start">
                        <div class="image-container">
                            <img class="product-image" src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="text-container ml-3">
                            <h3 class="m-3">${product.name}</h3>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text precio"><strong>Costo:</strong> ${product.cost} ${product.currency}</p>
                            <div class="vendidos-container">
                                <p class="card-text"><strong>Vendidos:</strong> ${product.soldCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    }
    
    document.getElementById("products-container").innerHTML = htmlContentToAppend;
    document.querySelector('h2.display-7').textContent = catName;
    selectedProduct();
}

function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;
    currentProductsArray = productsArray || currentProductsArray;
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);
    showProductsList();
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProductsArray = resultObj.data.products;
            catName = resultObj.data.catName; 
            showProductsList();
        }
    });

    document.getElementById("sortAscPrice").addEventListener("click", function() {
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDescPrice").addEventListener("click", function() {
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortBySoldCount").addEventListener("click", function() {
        sortAndShowProducts(ORDER_BY_PROD_SOLDCOUNT);
    });

    document.getElementById("btnClearFilter").addEventListener("click", function() {
        document.getElementById("minPrice").value = "";
        document.getElementById("maxPrice").value = "";

        minPrice = undefined;
        maxPrice = undefined;

        showProductsList();
        selectedProduct();
    });

    document.getElementById("btnPriceFilter").addEventListener("click", function(){
        minPrice = document.getElementById("minPrice").value;
        maxPrice = document.getElementById("maxPrice").value;

        if ((minPrice != undefined) && (minPrice != "") && (parseFloat(minPrice)) >= 0){
            minPrice = parseFloat(minPrice);
        }
        else{
            minPrice = undefined;
        }

        if ((maxPrice != undefined) && (maxPrice != "") && (parseFloat(maxPrice)) >= 0){
            maxPrice = parseFloat(maxPrice);
        }
        else{
            maxPrice = undefined;
        }

        showProductsList();   
    });
});

  //Guarda en localStorage el ID del producto seleccionado y redirige a product-info
  function selectedProduct() {
    let productItem = document.querySelectorAll(".product-item");
    productItem.forEach(function (product) {
      product.addEventListener("click", function() {
        let idProduct = product.getAttribute("data-product-id");

        localStorage.setItem("productID", idProduct);
        window.location.href = "product-info.html";
      })
    })
  }


// Filtrar y mostrar productos según el texto en la barra de búsqueda
function filterProducts(searchTerm) {
    let filteredProducts = currentProductsArray.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    showProductsList(filteredProducts);
}

document.getElementById("searchBar").addEventListener("input", function() {
    let searchTerm = this.value;
    filterProducts(searchTerm);  

});
