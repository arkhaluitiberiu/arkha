const articlesContainer = document.getElementById("articles-container");
const loadMoreBtn = document.getElementById("load-more-btn");
const loader = document.getElementById("loader");
const sortSelect = document.getElementById("sort-select");
const filterButtons = document.querySelectorAll(".filter-btn");

let allArticles = [];
let visibleArticles = [];
let currentIndex = 0;
const pageSize = 10;
let activeFilters = new Set();
let currentSort = "newest";

// Load articles from JSON
fetch("articles.json")
  .then((res) => res.json())
  .then((data) => {
    allArticles = data;
  });


// Create individual article card
function createArticleCard(article) {
  const card = document.createElement("article");
  card.className = "article-card";

  const meta = `<div class="article-meta">${new Date(
    article.date
  ).toLocaleDateString()}</div>`;

  const contentWords = article.content.split(" ");
  const shortContent = contentWords.slice(0, 60).join(" ");
  const isLong = contentWords.length > 60;

  const content = document.createElement("div");
  content.className = "article-content";
  content.innerHTML = `<p>${shortContent}${isLong ? "..." : ""}</p>`;

  if (isLong) {
    const readMore = document.createElement("button");
    readMore.className = "read-more";
    readMore.innerText = "Read more";
    readMore.addEventListener("click", () => {
      content.classList.toggle("expanded");
      content.innerHTML = content.classList.contains("expanded")
        ? `<p>${article.content}</p>`
        : `<p>${shortContent}...</p>`;
      readMore.innerText = content.classList.contains("expanded")
        ? "Read less"
        : "Read more";
    });
    card.appendChild(readMore);
  }

  card.innerHTML = `
    <h2>${article.title}</h2>
    ${meta}
  `;
  card.appendChild(content);
  articlesContainer.appendChild(card);
}



const themeToggle = document.getElementById("theme-toggle");

// Aplică tema salvată (dacă există)
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
} else if (savedTheme === "light") {
  document.body.classList.remove("dark");
  themeToggle.textContent = "🌙";
} else {
  // Detectare automată: dacă nu există alegere salvată
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
}


// Toggle button
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});



// Afișăm banner-ul doar dacă nu e deja acceptat
if (!localStorage.getItem("cookiesAccepted")) {
  document.getElementById("cookie-banner").style.display = "block";
}

document.getElementById("cookie-accept").addEventListener("click", () => {
  localStorage.setItem("cookiesAccepted", "true");
  document.getElementById("cookie-banner").style.display = "none";
});
