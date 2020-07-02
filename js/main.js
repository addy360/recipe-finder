const search = document.querySelector(".search")
const submitSearch = document.querySelector(".submit-search")
const random = document.querySelector(".random")
const resultEl = document.querySelector(".result")
const mealsEl = document.querySelector(".meals")
const singleMealEl = document.querySelector(".single-meal")

let url = 'https://www.themealdb.com/api/json/v1/1/search.php?'
async function searchMeal(){

	singleMealEl.innerHTML = '';

	const q = search.value
	if(!q.trim()){
		const alt = document.getElementById('alert')
		alt.innerText = "Search query can not be empty"
		alt.classList.add('show')
		setTimeout(()=>alt.classList.remove('show'), 3000)
		return
	}
	const res = await fetch(`${url}s=${q}`)
	const data = await res.json()

	resultEl.innerHTML = `<h2>Search results for '${q}' :</h2>`
	search.value = ''

	if(data.meals === null){
		return resultEl.innerHTML = `<h2>Sorry! there is nothing like your query.</h2>`
	}

	mealsEl.innerHTML = data.meals.map(m=>(
			`<div class="meal">
				<img src=${m.strMealThumb} />
				<div class="meal-info" data-mealId=${m.idMeal}>
					<h3>
						${m.strMeal}
					</h3>
				</div>
			</div>`
		)).join('')
	console.log(data)

}
async function getMealById(id){
	url = `https://www.themealdb.com/api/json/v1/1/lookup.php?`
	const res = await fetch(`${url}i=${id}`)
	const data = await res.json()
	addMealToDom(data.meals[0])
}

function addMealToDom(meal){
	const detailedIngs = []
	for(let i = 1; i<=20; i++){
		if (meal[`strMeasure${i}`].trim()) {
			detailedIngs.push(`<li>${meal[`strIngredient${i}`]} -> ${meal[`strMeasure${i}`]} </li>`)
		}
	}
	console.log()
	console.log()

	const el = `
		<div id="meal-details" class="container">
		<h1>${meal['strMeal']}</h1>
		<div class="meal-container" style="background: url(${meal['strMealThumb']}) center center/cover;">
			<div class="overlay"></div>
			<!-- <img src="https://www.themealdb.com/images/media/meals/ypuxtw1511297463.jpg"> -->
			<div class="meal-content">
				<ol>
					${detailedIngs.join('')}
				</ol>
				<p>${meal['strInstructions']}</p>
			</div>
		</div>
	</div>
	`
	document.querySelector('#details').innerHTML = el
}


submitSearch.addEventListener('click', searchMeal)
mealsEl.addEventListener('click', e =>{
	const mealInfo = e.path.find(item=>{
		if(item.classList){
			return item.classList.contains('meal-info')
		}
	})
	if(mealInfo){
		const mealID = mealInfo.getAttribute('data-mealId')
		getMealById(mealID)
	}
})