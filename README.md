# 🍳 FlavorFind | Discover Recipes from Every Corner

FlavorFind is a sleek, modern, fully responsive web application that allows food enthusiasts to discover recipes, explore culinary categories, and curate a personal collection of favorite dishes. The application connects directly to a live recipes database to pull down ingredients, measures, visual assets, and preparation instructions in real time.

---

## ✨ Features

*   **Global Recipe Engine:** Instant structural filtering matching your active text inputs.
*   **Intuitive Category Fallbacks:** Structural quick-tags and dropdown parameters mapping out categorized global recipes dynamically.
*   **Persistent Favorites Panel:** A lightweight collection state managed directly via `localStorage`—your chosen recipes persist across page reloads.
*   **Fluid Fullscreen Modals:** Immersive viewing layouts for ingredients, specific volume measurements, and granular step-by-step preparation steps.
*   **Mobile-First Responsive Interface:** Fluid viewport break-points built using CSS grid systems ensuring beautiful presentation from full desktop monitors down to mobile screens.

---

## 🛠️ Architecture & Core Stack

The architecture of this project centers completely around a high-performance, vanilla front-end configuration designed to execute natively within client web browsers without complex bundle steps or node build runtimes:

*   **Structure:** HTML5 Semantic Markup
*   **Styling Engine:** CSS3 with explicit Fluid Layout Systems, Flexbox, Native CSS Grids, and responsive breakpoints (`@media` rules).
*   **Runtime Logic:** Vanilla JavaScript (ES6+) implementing asynchronous network fetches via the `Fetch API`, dynamic state variables, and real-time DOM reconciliation.
*   **Data API Core:** Integrates with [TheMealDB API](https://www.themealdb.com/) endpoints.

---

## 📂 Project Structure

```text
FlavorFind/
│
├── main.html      # Main markup scaffold, global inline layout configurations, & responsive media rules
├── style.css      # Foundation theme styles, component structures, grids, and visual animations
└── Main.js        # JavaScript runtime engine handling API async fetching, UI updates, and LocalStorage state
