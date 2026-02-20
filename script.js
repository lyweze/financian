// Элементы
const headerLogo = document.querySelector(".header-logo");
const addArticle = document.querySelector(".add-article");
const mainButton = document.querySelector(".main-button");
const closeButton = document.querySelector(".article-close-button");
const addButton = document.querySelector(".article-add-button");

// Вспомогательные функции
const toggleModal = () => {
	const isOpen = addArticle.style.opacity === "1";
	addArticle.style.opacity = isOpen ? "0" : "1";
	addArticle.style.zIndex = isOpen ? "-1" : "1004";
	document.body.style.overflow = isOpen ? "visible" : "hidden";

	if (isOpen) setTimeout(() => (addArticle.style.zIndex = "-1"), 300);
};

const navigateHome = () => (window.location.href = "index.html");
const bindClick = (el, handler) => el && el.addEventListener("click", handler);

// Привязка событий
bindClick(headerLogo, navigateHome);
bindClick(mainButton, toggleModal);
bindClick(addButton, toggleModal);
bindClick(closeButton, toggleModal);
bindClick(addArticle, (e) => e.target === addArticle && toggleModal());
