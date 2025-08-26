// عناصر الإدخال
var productNameInput = document.getElementById("productName");
var productPriceInput = document.getElementById("productPrice");
var productCategoryInput = document.getElementById("productCategory");
var productDescriptionInput = document.getElementById("productDescription");
var productImageInput = document.getElementById("productImage");
var rowData = document.getElementById("rowData");
var searchInput = document.getElementById("searchInput");
var updateBtn = document.getElementById("updateBtn");
var addBtn = document.getElementById("addBtn");

var productList = [];
var editIndex = null;

// قراءة المنتجات من LocalStorage عند تحميل الصفحة
if (localStorage.getItem("products") != null) {
  productList = JSON.parse(localStorage.getItem("products"));
  displayProducts(productList);
}

// إضافة منتج
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

  var product = {
    name: productNameInput.value,
    price: productPriceInput.value,
    category: productCategoryInput.value,
    description: productDescriptionInput.value,
    image: "imag/" + productImageInput.files[0].name
  };

  productList.push(product);

  // تخزين في localStorage
  localStorage.setItem("products", JSON.stringify(productList));

  clearInputs();
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

// عرض المنتجات
function displayProducts(arr) {
  var box = ``;
  for (var i = 0; i < arr.length; i++) {
    box += `
    <div class="col-lg-4 col-md-6 col-sm-12">
      <div class="card border-0 shadow-lg mb-3">
        <img src="${arr[i].image}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${arr[i].name}</h5>
          <p class="card-text">${arr[i].description}</p>
          <h6><span class="text-muted fw-bold">Price:</span> ${arr[i].price}</h6>
          <h6><span class="text-muted fw-bold">Category:</span> ${arr[i].category}</h6>
          <div class="d-flex justify-content-around mt-3">
            <button onclick="setFormUpdate(${i})" class="btn btn-danger">Update</button>
            <button onclick="deleteProduct(${i})" class="btn btn-secondary">Delete</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  rowData.innerHTML = box;
}

// حذف منتج
function deleteProduct(deleteIndex) {
  productList.splice(deleteIndex, 1);
  localStorage.setItem("products", JSON.stringify(productList));
  displayProducts(productList);
}

// البحث
function searchProducts() {
  var searchResult = [];
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].name.toLowerCase().includes(searchInput.value.toLowerCase())) {
      searchResult.push(productList[i]);
    }
  }
  displayProducts(searchResult);
}

// تجهيز الفورم للتحديث
function setFormUpdate(Updateindex) {
  editIndex = Updateindex;
  productNameInput.value = productList[Updateindex].name;
  productPriceInput.value = productList[Updateindex].price;
  productCategoryInput.value = productList[Updateindex].category;
  productDescriptionInput.value = productList[Updateindex].description;

  updateBtn.classList.remove("d-none");
  addBtn.classList.add("d-none");
}

// تحديث المنتج
function updateProduct() {
  let updatedProduct = {
    name: productNameInput.value,
    price: productPriceInput.value,
    category: productCategoryInput.value,
    description: productDescriptionInput.value,
    image: productImageInput.files[0]
      ? "imag/" + productImageInput.files[0].name
      : productList[editIndex].image
  };

  productList[editIndex] = updatedProduct;
  localStorage.setItem("products", JSON.stringify(productList));

  displayProducts(productList);
  clearInputs();

  updateBtn.classList.add("d-none");
  addBtn.classList.remove("d-none");
  editIndex = null;
}
