let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;
let innernav=document.querySelector(".nav-tab")
let navicon=document.querySelector(".open-close-icon")
$(document).ready(function(){
    $(".loading").fadeOut(2000,function(){
        $(".loading").removeClass('d-flex')
    })
})
displayCategories()
function closeSideNav() {
    if (innernav.classList.contains('hide-transition')) {
        innernav.classList.remove('hide-transition');
        navicon.classList.remove('fa-xmark')
    } else {
        navicon.classList.add('fa-xmark')
        innernav.classList.add('hide-transition');
    }
}
function displayCategories() {
    let meals = "";
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(res => res.json())
        .then(data => {
            if (data.categories) {
                for (let i = 0; i < data.categories.length; i++) {
                    meals += `
                    <div class="col-md-3" >
                        <div onclick="getCategoryMeals('${data.categories[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                            <img class="w-100" src="${data.categories[i].strCategoryThumb}" alt="" srcset="">
                            <div class="meal-layer position-absolute d-flex align-items-center text-black p-2 flex-column">
                                <h3>${data.categories[i].strCategory}</h3>
                                <p>${data.categories[i].strCategoryDescription}<p/>
                            </div>
                        </div>
                    </div>
                    `;
                }
            } else {
                console.error('No meals found');
            }
            rowData.innerHTML = meals;
            searchContainer.innerHTML = '';
        })
        .catch(error => {
            console.error('Fetch error');
        });
}
async function getCategoryMeals(category) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    res = await res.json()
    displayMeals(res.meals.slice(0, 20))
}
function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`
    rowData.innerHTML = ""
}
async function searchByName(term) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    res = await res.json()
    res.meals ? displayMeals(res.meals) : displayMeals([])
}
async function searchByFLetter(term) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term?term:"s"}`)
    res = await res.json()
    res.meals ? displayMeals(res.meals) : displayMeals([])
}
function displayMeals(arr) {
    let meals = "";
    for (let i = 0; i < arr.length; i++) {
        meals += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    rowData.innerHTML = meals
}
function displayMealDetails(meal) {
    searchContainer.innerHTML = "";
    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    if (!tags) tags = []
    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let meals = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = meals
}
async function getMealDetails(mealID) {
    searchContainer.innerHTML = "";
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    res = await res.json();
    displayMealDetails(res.meals[0])
}
async function getArea() {
    searchContainer.innerHTML = "";
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    res = await res.json()
    displayArea(res.meals)
}
function displayArea(arr) {
    let meals = "";
    for (let i = 0; i < arr.length; i++) {
        meals += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }
    rowData.innerHTML = meals
}
async function getIngredients() {
    searchContainer.innerHTML = "";
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    res = await res.json()
    displayIngredients(res.meals.slice(0, 20))
}
function displayIngredients(arr) {
    let meals = "";
    for (let i = 0; i < arr.length; i++) {
        meals += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }
    rowData.innerHTML = meals
}
async function getAreaMeals(area) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    res = await res.json()
    displayMeals(res.meals.slice(0, 20))
}
async function getIngredientsMeals(ingredients) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    res = await res.json()
    displayMeals(res.meals.slice(0, 20))
}
function showContacts() {
    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
}

