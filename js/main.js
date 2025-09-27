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
var editIndex;
var tempImageData = null; // لتخزين الصورة عند التحديث

// شاشة التحميل
window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loadingScreen");
  const phone = document.querySelector(".phone");

  setTimeout(() => {
    phone.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      setTimeout(() => loadingScreen.remove(), 1500);
    }, 300);
  }, 2500);
});

// قائمة المنتجات
var productList = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
displayProducts(productList);

// إضافة منتج
function addProduct() {
  if (validateAll()) {
    var reader = new FileReader();
    reader.onload = function () {
      var product = {
        name: productNameInput.value,
        price: productPriceInput.value,
        category: productCategoryInput.value,
        description: productDescriptionInput.value,
        image: reader.result
      };
      productList.push(product);
      clearForm();
      localStorage.setItem("products", JSON.stringify(productList));
      displayProducts(productList);
    };
    reader.readAsDataURL(productImageInput.files[0]);
  }
}

// مسح الفورم
function clearForm() {
  // مسح القيم
  productNameInput.value = "";
  productPriceInput.value = "";
  productCategoryInput.value = "";
  productDescriptionInput.value = "";
  productImageInput.value = "";

  // حقول نصية و select تعمل fade
  const fadeInputs = document.querySelectorAll("input[type=text], input[type=number], textarea, select");
  fadeInputs.forEach(input => {
    if(input.classList.contains("is-valid") || input.classList.contains("is-invalid")){
      input.style.opacity = "0"; // fade-out
      setTimeout(() => {
        input.classList.remove("is-valid", "is-invalid");
        input.style.opacity = "1"; // إعادة opacity بعد إزالة الكلاسات
      }, 500);
    }
  });

  // file input يزيل علامات الصح/خطأ فوراً
  if(productImageInput.classList.contains("is-valid") || productImageInput.classList.contains("is-invalid")){
    productImageInput.classList.remove("is-valid", "is-invalid");
  }
}


// عرض المنتجات
function displayProducts(arr) {
  var box = "";
  for (var i = 0; i < arr.length; i++) {
    let media = arr[i].image.startsWith("data:video") 
      ? `<video autoplay loop muted playsinline class="card-img-top"><source src="${arr[i].image}" type="video/mp4"></video>` 
      : `<img src="${arr[i].image}" class="card-img-top" alt="...">`;
    
    box += `<div class="col-lg-6 col-md-6 col-sm-12">
      <div class="card border-0 shadow-lg mb-3">
        ${media}
        <div class="card-body">
          <h5 class="card-title">${arr[i].name}</h5>
          <p class="card-text">${arr[i].description}</p>
          <h6><span class="text-muted fw-bold">Price: </span>${arr[i].price}</h6>
          <h6><span class="text-muted fw-bold">Category: </span>${arr[i].category}</h6>
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

// حذف المنتج
function deleteProduct(index) {
  productList.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(productList));
  displayProducts(productList);
}

// البحث
function searchProducts() {
  var result = productList.filter(p => p.name.toLowerCase().includes(searchInput.value.toLowerCase()));
  displayProducts(result);
}

// تعديل المنتج
function setFormUpdate(index) {
  editIndex = index;
  productNameInput.value = productList[index].name;
  productPriceInput.value = productList[index].price;
  productCategoryInput.value = productList[index].category;
  productDescriptionInput.value = productList[index].description;
  tempImageData = productList[index].image; // تخزين الصورة السابقة
  updateBtn.classList.remove("d-none");
  addBtn.classList.add("d-none");
}

// حفظ التحديث
function updateProduct() {
  if (!validateAll()) return;
  productList[editIndex].name = productNameInput.value;
  productList[editIndex].price = productPriceInput.value;
  productList[editIndex].category = productCategoryInput.value;
  productList[editIndex].description = productDescriptionInput.value;

  if (productImageInput.files[0]) {
    var reader = new FileReader();
    reader.onload = function() {
      productList[editIndex].image = reader.result;
      finalizeUpdate();
    };
    reader.readAsDataURL(productImageInput.files[0]);
  } else {
    productList[editIndex].image = tempImageData;
    finalizeUpdate();
  }
}

function finalizeUpdate() {
  clearForm();
  localStorage.setItem("products", JSON.stringify(productList));
  displayProducts(productList);
  updateBtn.classList.add("d-none");
  addBtn.classList.remove("d-none");
  tempImageData = null;
}

// التحقق من جميع الحقول
function validateAll() {
  return [productNameInput, productPriceInput, productCategoryInput, productDescriptionInput, productImageInput]
    .every(input => validateForm(input));
}

// التحقق من الحقول
function validateForm(element) {
  var regex = {
    productName: /^[A-Z|a-z][\w-]{3,10}\s?\w{0,10}$/,
    productPrice: /^([1-9][0-9]{2,4}|100000)$/,
    productCategory: /^(Mobile|Laptop|Tablet|Smart Watch)\s?$/i,
    productDescription: /^[\w ]{2,300}$/,
    productImage: /^.{1,}\.(jpg|jpeg|png|gif|bmp|webp|svg|mp4)$/i
  };

  if (regex[element.id].test(element.value) || (element.id==="productImage" && tempImageData && !element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.nextElementSibling?.classList.add("d-none");
    return true;
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    element.nextElementSibling?.classList.remove("d-none");
    return false;
  }
}
