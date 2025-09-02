// create
// read  display
// update
// delete
// search
// تعريف العناصر
var productNameInput = document.getElementById("productName");
var productPriceInput = document.getElementById("productPrice");
var productCategoryInput = document.getElementById("productCategory");
var productDescriptionInput = document.getElementById("productDescription");
var productImageInput = document.getElementById("productImage");
var rowData = document.getElementById("rowData");
var searchInput = document.getElementById("searchInput");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var editIndex ;

// تعريف قائمة المنتجات
var productList;
if( localStorage.getItem("products")!=null ) {
  productList = JSON.parse(localStorage.getItem("products"));
  displayProducts(productList);
}else{
  productList = [];
}

// add product
function addProduct() {
  if (
    validateForm(productNameInput) &&
    validateForm(productPriceInput) &&
    validateForm(productCategoryInput) &&
    validateForm(productDescriptionInput) &&
    validateForm(productImageInput)
  ) {
    var reader = new FileReader();
    reader.onload = function () {
      var product = {
        name: productNameInput.value,
        price: productPriceInput.value,
        category: productCategoryInput.value,
        description: productDescriptionInput.value,
        image: reader.result // ← هون نخزن الصورة أو الـ gif أو mp4 كـ Base64
      };

      productList.push(product);
      clearForm();
      localStorage.setItem("products", JSON.stringify(productList));
      displayProducts(productList);
    };

    reader.readAsDataURL(productImageInput.files[0]); // ← يحول أي صورة/فيديو لـ Base64
  }
}

// function addProduct() {
//  if  (validateForm(productNameInput)
//    && validateForm(productPriceInput)
//    && validateForm(productCategoryInput)
//    && validateForm(productDescriptionInput)
//    && validateForm(productImageInput)
//    && validateForm(productImageInput)
//    ) {
//  var product = {
//     name: productNameInput.value,
//     price: productPriceInput.value,
//     category: productCategoryInput.value,
//     description: productDescriptionInput.value,
//     image: ' imag/' + productImageInput.files[0]?.name
//   };
//   productList.push(product);
//    clearForm();
   
// // التخزين في localStorage
// localStorage.setItem("products", JSON.stringify(productList));
//    displayProducts(productList);
//  }
// }

// clearForm
function clearForm() {
  productNameInput.value = null;
  productPriceInput.value = null;
  productCategoryInput.value = null;
  productDescriptionInput.value = null;
  productImageInput.value = null;

}

// display products
function displayProducts(arr) {
  var box = ``;
  for (var i = 0; i < arr.length; i++) {
    let media;
    if (arr[i].image.startsWith("data:video")) {
      media = `<video autoplay loop muted playsinline class="card-img-top">
                 <source src="${arr[i].image}" type="video/mp4">
               </video>`;
    } else {
      media = `<img src="${arr[i].image}" class="card-img-top" alt="...">`;
    }

    box += `<div class="col-lg-6 col-md-6 col-sm-12">
        <div class="card border-0 shadow-lg mb-3" >
          ${media}
          <div class="card-body">
            <h5 class="card-title">${arr[i].name}</h5>
            <p class="card-text">${arr[i].description}</p>
            <h6><span class="text-muted fw-bold">Price : </span> ${arr[i].price}</h6>
            <h6><span class="text-muted fw-bold">Category : </span> ${arr[i].category}</h6>
            <div class="d-flex justify-content-around mt-3">
              <button onclick="setFormUpdate(${i})" class="btn btn-danger">Update</button>
              <button onclick="deleteProduct(${i})" class="btn btn-secondary">Delete</button>
            </div>
          </div>
        </div>
      </div>`;
  }
  rowData.innerHTML = box;
}

// function displayProducts(arr) {
//   var box = ``;
//   for (var i = 0; i < arr.length; i++) {
//     box += `<div class="col-lg-6 col-md-6 col-sm-12">
//         <div class="card border-0 shadow-lg mb-3" >
//           <img src="${arr[i].image}" class="card-img-top" alt="...">
//           <div class="card-body">
//             <h5 class="card-title">${arr[i].name}</h5>
//             <p class="card-text">${arr[i].description}</p>
//             <h6>
//                 <span class="text-muted fw-bold">Price : </span> ${arr[i].price}
//             </h6>
//             <h6>
//                 <span class="text-muted fw-bold">Category : </span> ${arr[i].category}
//             </h6>
//             <div class="d-flex justify-content-around mt-3">
//               <button onclick="setFormUpdate(${i})" class="btn btn-danger">Update</button>
//               <button onclick="deleteProduct(${i})" class="btn btn-secondary">Delete</button>
//             </div>
//           </div>
//         </div>
//       </div>`;
//   }
//   rowData.innerHTML = box;
// }

// delete product
function deleteProduct(index) {
  productList.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(productList));
  displayProducts(productList);
}

// search
function searchProducts() {
  var searchResult = [];
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].name.toLowerCase().includes(searchInput.value.toLowerCase())) {
      searchResult.push(productList[i]);
    }
  }
  displayProducts(searchResult);
}


// update
function setFormUpdate(updateIndex) {
  editIndex = updateIndex;
  productNameInput.value = productList[updateIndex].name;
  productPriceInput.value = productList[updateIndex].price;
  productCategoryInput.value = productList[updateIndex].category;
  productDescriptionInput.value = productList[updateIndex].description;
  productImageInput.files[0] = productList[updateIndex].image;
  updateBtn.classList.remove("d-none");
  addBtn.classList.add("d-none");
}
function updateProduct() {
  productList[editIndex].name = productNameInput.value;
  productList[editIndex].price = productPriceInput.value;
  productList[editIndex].category = productCategoryInput.value;
  productList[editIndex].description = productDescriptionInput.value;
  productList[editIndex].image = ' imag/' + productImageInput.files[0]?.name;
  clearForm();
  localStorage.setItem("products", JSON.stringify(productList));
  displayProducts(productList);
  updateBtn.classList.add("d-none");
  addBtn.classList.remove("d-none");  

}

// validation
function validateForm(element) {
  
  var regex = {
    productName: /^[A-Z|a-z][\w-]{3,10}\s?\w{0,10}$/,
    productPrice: /^([1-9][0-9]{2,4}|100000)$/,
    productCategory: /^(Mobile|Laptop|Tablet|Smart Watch)\s?$/i,
    productDescription: /^[\w ]{2,300}$/,
    productImage: /^.{1,}\.(jpg|jpeg|png|gif|bmp|webp|svg|mp4)$/i
  };
  // regex[element.id ]

  if (regex[element.id].test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.nextElementSibling.classList.add("d-none");
    return true;
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    element.nextElementSibling.classList.remove("d-none");
  }
    return false;
}
