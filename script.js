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
    applyFiltersAndSort();
  });

// Apply filters and sort
function applyFiltersAndSort() {
  showLoader();
  setTimeout(() => {
    let filtered = [...allArticles];

    // Apply filters
    if (activeFilters.size > 0) {
      filtered = filtered.filter((article) =>
        article.categories.some((cat) => activeFilters.has(cat))
      );
    }

    // Apply sort
    switch (currentSort) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "longest":
        filtered.sort((a, b) => b.content.length - a.content.length);
        break;
      case "shortest":
        filtered.sort((a, b) => a.content.length - b.content.length);
        break;
    }

    visibleArticles = filtered;
    currentIndex = 0;
    articlesContainer.innerHTML = "";
    renderNextBatch();
    hideLoader();
  }, 500);
}

// Render next 10 articles
function renderNextBatch() {
  const next = visibleArticles.slice(currentIndex, currentIndex + pageSize);
  next.forEach(createArticleCard);
  currentIndex += pageSize;

  if (currentIndex >= visibleArticles.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
}

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

// Filtering logic
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.category;
    if (activeFilters.has(cat)) {
      activeFilters.delete(cat);
      btn.classList.remove("active");
    } else {
      activeFilters.add(cat);
      btn.classList.add("active");
    }
    applyFiltersAndSort();
  });
});

// Sorting logic
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  applyFiltersAndSort();
});

// Load more logic
loadMoreBtn.addEventListener("click", () => {
  showLoader();
  setTimeout(() => {
    renderNextBatch();
    hideLoader();
  }, 400);
});

// Loader handlers
function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}
