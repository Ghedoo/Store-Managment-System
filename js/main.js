// تعريف العناصر
var productNameInput = document.getElementById("productName");
var productPriceInput = document.getElementById("productPrice");
var productCategoryInput = document.getElementById("productCategory");
var productDescriptionInput = document.getElementById("productDescription");
var productImageInput = document.getElementById("productImage");

var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");

var rowData = document.getElementById("rowData");

var productList = JSON.parse(localStorage.getItem("products")) || [];
var editIndex = null;

// عرض المنتجات عند التحميل
displayProducts(productList);

// إضافة منتج جديد
function addProduct() {
  var nameRegex = /^[A-Za-z\s]{2,30}$/;
  var priceRegex = /^\d+(\.\d{1,2})?$/;
  var categoryRegex = /^[A-Za-z\s]{2,20}$/;

  if (
    productNameInput.value.trim() === "" ||
    productPriceInput.value.trim() === "" ||
    productCategoryInput.value.trim() === "" ||
    productDescriptionInput.value.trim() === "" ||
    !productImageInput.files[0]
  ) {
    alert("يرجى تعبئة جميع الحقول!");
    return;
  }

  if (!nameRegex.test(productNameInput.value)) {
    alert("الاسم يجب أن يكون نص فقط ويتراوح بين 2 و30 حرف!");
    return;
  }

  if (!priceRegex.test(productPriceInput.value)) {
    alert("السعر يجب أن يكون رقم صحيح أو عشري مع منزلتين كحد أقصى!");
    return;
  }

  if (!categoryRegex.test(productCategoryInput.value)) {
    alert("الفئة يجب أن تكون نص فقط ويتراوح طولها بين 2 و20 حرف!");
    return;
  }

  var reader = new FileReader();
  reader.onload = function () {
    var product = {
      name: productNameInput.value,
      price: productPriceInput.value,
      category: productCategoryInput.value,
      description: productDescriptionInput.value,
      image: reader.result // تخزين Base64
    };

    productList.push(product);
    localStorage.setItem("products", JSON.stringify(productList));

    clearInputs();
    displayProducts(productList);
  };

  reader.readAsDataURL(productImageInput.files[0]);
}

// عرض المنتجات
function displayProducts(arr) {
  var box = ``;
  for (var i = 0; i < arr.length; i++) {
    box += `<div class="col-lg-4 col-md-6 col-sm-12">
        <div class="card border-0 shadow-lg mb-3" >
          <img src="${arr[i].image}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${arr[i].name}</h5>
            <p class="card-text">${arr[i].description}</p>
            <h6>
                <span class="text-muted fw-bold">Price : </span> ${arr[i].price}
            </h6>
            <h6>
                <span class="text-muted fw-bold">Category : </span> ${arr[i].category}
            </h6>
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

// تعبئة البيانات للتحديث
function setFormUpdate(index) {
  var product = productList[index];
  productNameInput.value = product.name;
  productPriceInput.value = product.price;
  productCategoryInput.value = product.category;
  productDescriptionInput.value = product.description;

  editIndex = index;

  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

// تحديث منتج
function updateProduct() {
  if (productImageInput.files[0]) {
    var reader = new FileReader();
    reader.onload = function () {
      let updatedProduct = {
        name: productNameInput.value,
        price: productPriceInput.value,
        category: productCategoryInput.value,
        description: productDescriptionInput.value,
        image: reader.result
      };

      productList[editIndex] = updatedProduct;
      localStorage.setItem("products", JSON.stringify(productList));

      displayProducts(productList);
      clearInputs();

      updateBtn.classList.add("d-none");
      addBtn.classList.remove("d-none");
      editIndex = null;
    };

    reader.readAsDataURL(productImageInput.files[0]);
  } else {
    let updatedProduct = {
      name: productNameInput.value,
      price: productPriceInput.value,
      category: productCategoryInput.value,
      description: productDescriptionInput.value,
      image: productList[editIndex].image
    };

    productList[editIndex] = updatedProduct;
    localStorage.setItem("products", JSON.stringify(productList));

    displayProducts(productList);
    clearInputs();

    updateBtn.classList.add("d-none");
    addBtn.classList.remove("d-none");
    editIndex = null;
  }
}

// حذف منتج
function deleteProduct(index) {
  productList.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(productList));
  displayProducts(productList);
}

// تنظيف الحقول
function clearInputs() {
  productNameInput.value = "";
  productPriceInput.value = "";
  productCategoryInput.value = "";
  productDescriptionInput.value = "";
  productImageInput.value = "";
}
