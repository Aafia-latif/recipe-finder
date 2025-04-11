document.getElementById("searchBtn").addEventListener("click", searchMeals);

async function searchMeals() {
  const query = document.getElementById("searchInput").value.trim();
  const container = document.getElementById("mealsContainer");
  container.innerHTML = "";

  if (!query) {
    alert("Please enter a search term.");
    return;
  }

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await res.json();

    if (!data.meals) {
      container.innerHTML =
        "<p class='col-span-3 text-center'>No meals found.</p>";
      return;
    }

    data.meals.forEach((meal) => {
      const card = `
        <div class="bg-white rounded-lg shadow p-4">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="rounded w-full h-40 object-cover mb-4" />
          <h2 class="text-xl font-semibold mb-2">${meal.strMeal}</h2>
          <button onclick="showRecipe('${meal.idMeal}')" class="text-green-600 hover:underline">
            View Recipe
          </button>
        </div>
      `;
      container.innerHTML += card;
    });
  } catch (error) {
    console.error("Error fetching meals:", error);
    container.innerHTML =
      "<p class='col-span-3 text-center text-red-600'>Something went wrong. Try again later.</p>";
  }
}

async function showRecipe(id) {
  const existing = document.getElementById("modal");
  if (existing) existing.remove();

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  const meal = data.meals[0];

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim() !== "") {
      ingredients.push(`${measure} ${ing}`);
    }
  }

  const modalHTML = `
    <div id="modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-lg w-full relative overflow-y-auto max-h-[90vh]">
        <button onclick="closeModal()" class="absolute top-2 right-3 text-2xl text-gray-500 hover:text-black">&times;</button>
        <h2 class="text-2xl font-bold mb-2">${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" class="rounded w-full mb-4" />
        <h3 class="font-semibold mb-1">Ingredients:</h3>
        <ul class="list-disc list-inside mb-4 text-sm">
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
        <h3 class="font-semibold mb-1">Instructions:</h3>
        <p class="text-sm whitespace-pre-line">${meal.strInstructions}</p>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.remove();
}
