const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const recipeContainer = document.getElementById('recipe-container');
const recipeModal = document.getElementById('recipe-modal');
const modalBody = document.getElementById('modal-body');
const resultsLabel = document.getElementById('results-label');
const closeBtn = document.querySelector('.close-btn');

// Navigation filter elements
const showAllBtn = document.getElementById('show-all-btn');
const showFavsBtn = document.getElementById('show-favs-btn');
const favCountSpan = document.getElementById('fav-count');

// Global State management variables
let currentMeals = []; 
let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
let currentView = 'all'; // Tracks if user is actively looking at 'all' or 'favs'

// ─── Event Listeners ──────────────────────────────────
if (searchBtn) searchBtn.addEventListener('click', fetchRecipes);
if (searchInput) {
    searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') fetchRecipes(); });
}

document.querySelectorAll('.quick-tag').forEach(btn => {
    btn.addEventListener('click', () => {
        if (searchInput) searchInput.value = btn.dataset.q;
        fetchRecipes();
        document.querySelector('.main-section')?.scrollIntoView({ behavior: 'smooth' });
    });
});

if (closeBtn) closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', e => { if (e.target === recipeModal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Navbar toggle handlers (Safeguarded with if statements)
if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
        currentView = 'all';
        showAllBtn.classList.add('active');
        if (showFavsBtn) showFavsBtn.classList.remove('active');
        displayRecipes(currentMeals, searchInput?.value || "your query");
    });
}

if (showFavsBtn) {
    showFavsBtn.addEventListener('click', () => {
        currentView = 'favs';
        showFavsBtn.classList.add('active');
        if (showAllBtn) showAllBtn.classList.remove('active');
        displayFavorites();
    });
}

// Category Dropdown Event Click Handlers
document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedCategory = link.dataset.category;
        fetchByCategory(selectedCategory);
        document.querySelector('.main-section')?.scrollIntoView({ behavior: 'smooth' });
    });
});

function closeModal() {
    if (recipeModal) {
        recipeModal.classList.remove('open');
        setTimeout(() => recipeModal.style.display = 'none', 200);
    }
}

// Update count badge on boot
updateFavBadge();

// ─── Fetch by Search Text ─────────────────────────────
function fetchRecipes() {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (!query) {
        showState('🔍', 'What are you craving?', 'Type an ingredient or dish name above to get started.');
        return;
    }

    showSkeletons(6);
    if (resultsLabel) resultsLabel.textContent = '';

    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + encodeURIComponent(query))
        .then(r => r.json())
        .then(data => {
            currentMeals = data.meals || [];
            currentView = 'all';
            if (showAllBtn) showAllBtn.classList.add('active');
            if (showFavsBtn) showFavsBtn.classList.remove('active');
            displayRecipes(currentMeals, query);
        })
        .catch(() => showState('⚠️', 'Something went wrong', 'Check your connection and try again.'));
}

// ─── Fetch by Category Filter ────────────────────
function fetchByCategory(category) {
    showSkeletons(6);
    if (resultsLabel) resultsLabel.textContent = '';
    if (searchInput) searchInput.value = ''; // clear text search input

    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + encodeURIComponent(category))
        .then(r => r.json())
        .then(data => {
            const mealsSummary = data.meals || [];
            
            if(mealsSummary.length === 0) {
                currentMeals = [];
                displayRecipes(currentMeals, category);
                return;
            }

            currentMeals = mealsSummary.map(meal => ({
                idMeal: meal.idMeal,
                strMeal: meal.strMeal,
                strMealThumb: meal.strMealThumb,
                strCategory: category, 
                strArea: '' 
            }));

            currentView = 'all';
            if (showAllBtn) showAllBtn.classList.add('active');
            if (showFavsBtn) showFavsBtn.classList.remove('active');
            displayRecipes(currentMeals, category);
        })
        .catch(() => showState('⚠️', 'Something went wrong', 'Failed to pull category contents.'));
}

// ─── Display Cards ────────────────────────────────────
function displayRecipes(meals, query) {
    if (!recipeContainer) return;
    recipeContainer.innerHTML = '';

    if (!meals || meals.length === 0) {
        if (resultsLabel) resultsLabel.textContent = '';
        if (currentView === 'favs') {
            showState('❤️', 'No favorites yet', 'Click the heart icons on any recipe card to save them here.');
        } else {
            showState('😕', 'No recipes found', `We couldn't find anything for "${query}".`);
        }
        return;
    }

    if (resultsLabel) {
        if (currentView === 'favs') {
            resultsLabel.textContent = `YOUR FAVORITES (${meals.length})`;
        } else {
            resultsLabel.textContent = `${meals.length} item${meals.length > 1 ? 's' : ''} found in "${query}"`;
        }
    }

    meals.forEach((meal, i) => {
        const isFav = favorites.some(fav => fav.idMeal === meal.idMeal);
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.style.animationDelay = `${i * 60}ms`;

        card.innerHTML = `
            <div class="recipe-card-img">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
                <span class="card-region-badge">${meal.strArea || 'Recipe'}</span>
                <button class="fav-btn ${isFav ? 'active' : ''}" aria-label="Favorite recipe">
                    ${isFav ? '❤️' : '🖤'}
                </button>
            </div>
            <div class="recipe-info">
                <h3>${meal.strMeal}</h3>
                <div class="recipe-meta">
                    <span class="meta-chip">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2"/></svg>
                        ${meal.strCategory || 'General'}
                    </span>
                </div>
                <button class="view-btn">View Full Recipe →</button>
            </div>
        `;

        card.querySelector('.view-btn').addEventListener('click', () => openModal(meal));
        
        card.querySelector('.fav-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(meal);
        });

        recipeContainer.appendChild(card);
    });
}

// ─── Favorites State Toggler ──────────────────────────
function toggleFavorite(meal) {
    const index = favorites.findIndex(fav => fav.idMeal === meal.idMeal);
    
    if (index === -1) {
        favorites.push(meal);
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
    updateFavBadge();
    
    if (currentView === 'favs') {
        displayFavorites();
    } else {
        displayRecipes(currentMeals, searchInput?.value || "your selection");
    }
}

function displayFavorites() {
    displayRecipes(favorites, "your favorites collection");
}

function updateFavBadge() {
    if (favCountSpan) favCountSpan.textContent = favorites.length;
}

// ─── Modal ────────────────────────────────────────────
function openModal(meal) {
    if (!meal.strInstructions) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
            .then(res => res.json())
            .then(data => {
                if (data.meals && data.meals[0]) {
                    renderModalContent(data.meals[0]);
                }
            });
    } else {
        renderModalContent(meal);
    }
}

function renderModalContent(meal) {
    if (!modalBody || !recipeModal) return;

    let ingredientsHTML = '<div class="ingredients-grid">';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal['strIngredient' + i];
        const measure = meal['strMeasure' + i];
        if (ingredient && ingredient.trim()) {
            ingredientsHTML += `
                <div class="ingredient-row">
                    <span class="measure">${measure ? measure.trim() : '—'}</span>
                    <span class="name">${ingredient}</span>
                </div>`;
        } else break;
    }
    ingredientsHTML += '</div>';

    modalBody.innerHTML = `
        <img class="modal-hero-img" src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="modal-body-inner">
            <h2 class="modal-title">${meal.strMeal}</h2>
            <div class="modal-chips">
                <span class="modal-chip">${meal.strCategory}</span>
                <span class="modal-chip">${meal.strArea || 'World'}</span>
            </div>
            <p class="modal-section-title">Ingredients</p>
            ${ingredientsHTML}
            <hr class="modal-divider">
            <p class="modal-section-title">Instructions</p>
            <p class="modal-instructions">${meal.strInstructions}</p>
        </div>
    `;

    recipeModal.style.display = 'flex';
    setTimeout(() => recipeModal.classList.add('open'), 10);
}

// ─── Helpers ──────────────────────────────────────────
function showState(icon, heading, message) {
    if (!recipeContainer) return;
    recipeContainer.innerHTML = `
        <div class="state-msg" style="grid-column:1/-1">
            <div class="state-icon">${icon}</div>
            <h3>${heading}</h3>
            <p>${message}</p>
        </div>`;
}

function showSkeletons(n) {
    if (!recipeContainer) return;
    recipeContainer.innerHTML = Array.from({ length: n }, () => `
        <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line short"></div>
                <div class="skeleton-line" style="height:36px;border-radius:8px;margin-top:8px"></div>
            </div>
        </div>`).join('');
}

// Initial default state message
showState('🍽️', 'Ready when you are', 'Search above or pick a quick option to discover great recipes.');