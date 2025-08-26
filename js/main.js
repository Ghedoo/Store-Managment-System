// cruds

// create input elements
// read / display/
// update
// delete
// search
var productNameInput = document.getElementById("productName"); //input
var productPriceInput = document.getElementById("productPrice"); //input
var productCategoryInput = document.getElementById("productCategory"); //input
var productDescriptionInput = document.getElementById("productDescription"); //input
var productImageInput = document.getElementById("productImage"); //input
var rowData = document.getElementById("rowData"); //div
var productList = []; //array
var searchInput = document.getElementById("searchInput"); //input
var updateBtn = document.getElementById("updateBtn"); //button
var addBtn = document.getElementById("addBtn"); //button


// localStorage.setItem("userName", "Ragheed alqadri");
// localStorage.setItem("age", "25");
// localStorage.setItem("gender", "male");
// console.log(localStorage.getItem("userName"));
// console.log(localStorage.getItem("age"));
// console.log(localStorage.getItem("gender"));
// localStorage.removeItem("userName");
// localStorage.removeItem("age");
// localStorage.removeItem("gender");
// localStorage.clear();


if (localStorage.getItem("products") != null) {
  productList = JSON.parse(localStorage.getItem("products"));
  displayProducts(productList);
}else{
  productList = [];
}
function addProduct() {
  // Regex للتحقق من الحقول
  var nameRegex = /^[A-Za-z\s]{2,30}$/; // الاسم نص فقط، بين 2 و30 حرف
  var priceRegex = /^\d+(\.\d{1,2})?$/; // السعر رقم صحيح أو عشري بحد أقصى منزلتين
  var categoryRegex = /^[A-Za-z\s]{2,20}$/; // الفئة نص فقط، بين 2 و20 حرف

  // التحقق من الحقول
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

  // إنشاء كائن المنتج
  var product = {
    name: productNameInput.value,
    price: productPriceInput.value,
    category: productCategoryInput.value,
    description: productDescriptionInput.value,
    image: 'imag/' + productImageInput.files[0].name
  };

  productList.push(product);
  clearInputs();
  displayProducts(productList);
}

function clearInputs() {
  productNameInput.value = null;
  productPriceInput.value = null;
  productCategoryInput.value = null;
  productDescriptionInput.value = null;
  productImageInput.value = null;
}
// display function
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
        <span class="text-muted fw-bold ">Price : </span> ${arr[i].price}
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
        </div>
`;
  }

  rowData.innerHTML = box;
}

// delete product function
function deleteProduct(deleteIndex) {
  productList.splice(deleteIndex, 1);
  localStorage.setItem("products", JSON.stringify(productList));
  displayProducts(productList);
} 
// search function
function searchProducts() {
  var searchResult=[];
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].name.toLowerCase().includes(searchInput.value.toLowerCase())) {
      searchResult.push(productList[i]);
    }
  }
 
  displayProducts(searchResult);
  console.log('search');

}

// update function
let editIndex = null;

function setFormUpdate(Updateindex) {
  editIndex = Updateindex;
  productNameInput.value = productList[Updateindex].name;
  productPriceInput.value = productList[Updateindex].price;
  productCategoryInput.value = productList[Updateindex].category;
  productDescriptionInput.value = productList[Updateindex].description;

  updateBtn.classList.remove("d-none");
  addBtn.classList.add("d-none");
}

function updateProduct() {
  let updatedProduct = {
    name: productNameInput.value,
    price: productPriceInput.value,
    category: productCategoryInput.value,
    description: productDescriptionInput.value,
 
    image: productImageInput.files[0] 
           ? 'imag/' + productImageInput.files[0].name 
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






// validation ==> نمط
// regular expression ==> regex==> global شوية شروط
  // /web\/\S+/gi
  // var regex = new RegExp('web\/\S+','gi');
  // [] يختوي على
  // ^[] يبدا بي
  // 3{n} عدد التكرار
  // $ ينتهي ب
  // {n,m} من n الى m

  // \b حدود الكلمة
  // \d عدد
  // \D غير عدد
  // \S اي شيء ما عدا فراغ
  // \s فراغ بتخليه براحته يا يحط سبيس يا لا 
  // ^ لو كانت بقلب السكوير يعني مننفي 
  // \w حرف word caracter هي لكلشي
  // \W غير حرف
  // . أي شيء
  // ؟ اختياري 
  // {0,} الا مالانهاية او *
  // + مرة او اكثر من واحد الى لا نهاية
  // ( | ) بلوك على بعضو يعني بدي ياه يكتب كلمة من كلمتين
  // flax
  // \i بخليه مش بيعتمد ع الكلمة ازا احرف كبيرة او صغيرة
  // \g كم وحدة نطبق عليها الريج هاد 
  // \m بيقلك كم سطر نعمل عليه ماتش
  // var regex = /web\/\S+/gi;
  // var value ='a web page'
  // console.log(regex.test(value));

  // يمكنك استخدام هذا الريجيكس لقبول السن من 20 إلى 80 فقط:
  // var ageRegex = /^(2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|80)$/;
  // console.log(ageRegex.test("20")); // true
// console.log(ageRegex.test("35")); // true
// console.log(ageRegex.test("80")); // true
// console.log(ageRegex.test("19")); // false
// console.log(ageRegex.test("81")); // false