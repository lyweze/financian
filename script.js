// Утилиты
const qs = (sel) => document.querySelector(sel);
const bindClick = (el, handler) => el?.addEventListener("click", handler);
const setVisibility = (el, visible) => {
	if (!el) return;
	el.style.opacity = visible ? "1" : "0";
	el.style.zIndex = visible ? "1004" : "-1";
	// document.body.style.overflowY = visible ? "hidden" : "scroll";
	document.body.style.position = visible ? "fixed" : "static";
	if (!visible) setTimeout(() => (el.style.zIndex = "-1"), 300);
};

// DOM-элементы
const els = {
	headerLogo: qs(".header-logo"),
	addArticle: qs(".add-article"),
	mainButton: qs(".main-button"),
	closeButton: qs(".article-close-button"),
	addButton: qs(".article-add-button"),
	categoriesList: qs(".main-categories-container ul"),
	lastOperationsCollapse: qs(".main-last-operation-collapse-button"),
	lastOperationsContainer: qs(".main-last-operations-container"),
	lastOperationsList: qs(".main-last-operations-ul-collapsed"),
};

// Данные
const allOperations = [
	{ id: 1, category: "food", date: "01-01", amount: 900.0 },
	{ id: 2, category: "clothing", date: "01-04", amount: 120.0 },
	{ id: 3, category: "transport", date: "01-04", amount: 1200000.0 },
	{ id: 4, category: "online", date: "01-04", amount: 120.0 },
	{ id: 5, category: "other", date: "01-04", amount: 120.0 },
	{ id: 6, category: "food", date: "02-10", amount: 560.5 },
	{ id: 7, category: "clothing", date: "02-12", amount: 2300.0 },
	{ id: 8, category: "transport", date: "02-13", amount: 420.0 },
	{ id: 9, category: "online", date: "02-14", amount: 999.99 },
	{ id: 10, category: "other", date: "02-15", amount: 75.25 },
	{ id: 11, category: "food", date: "03-02", amount: 1300.0 },
	{ id: 12, category: "clothing", date: "03-05", amount: 480.75 },
	{ id: 13, category: "transport", date: "03-07", amount: 650.0 },
	{ id: 14, category: "online", date: "03-09", amount: 310.4 },
	{ id: 15, category: "other", date: "03-11", amount: 55.0 },
	{ id: 16, category: "shop", date: "01-08", amount: 300.0 },
	{ id: 17, category: "shop", date: "02-20", amount: 780.5 },
	{ id: 18, category: "shop", date: "03-15", amount: 150.99 },
];

const operationsCategories = {
	food: "Еда",
	clothing: "Одежда",
	transport: "Транспорт",
	online: "Онлайн",
	other: "Разное",
	shop: "Магазин",
};

// Состояния
let isModalOpen = false;
let isCollapsed = true;

// Рендеры
const renderOperations = () => {
	const { lastOperationsList } = els;
	if (!lastOperationsList) return;

	const fragment = document.createDocumentFragment();
	allOperations.forEach(({ category, amount }) => {
		const li = document.createElement("li");
		li.innerHTML = `
			<div>
				<div>
					<img src="./assets/svg/${category}.svg" alt="" />
					<p>${operationsCategories[category] ?? category}</p>
				</div>
				<p>${amount} ₽</p>
			</div>`;
		fragment.appendChild(li);
	});
	lastOperationsList.innerHTML = "";
	lastOperationsList.appendChild(fragment);
};

const renderCategoriesTotals = () => {
	const { categoriesList } = els;
	if (!categoriesList) return;

	const totals = allOperations.reduce((acc, { category, amount }) => {
		acc[category] = (acc[category] || 0) + amount;
		return acc;
	}, {});

	categoriesList.innerHTML = "";
	Object.entries(totals).forEach(([category, amount]) => {
		const li = document.createElement("li");
		li.innerHTML = `
			<div>
				<div>
					<img src="./assets/svg/${category}.svg" alt="" />
					<p>${operationsCategories[category] ?? category}</p>
				</div>
				<p>${amount.toFixed(2)} ₽</p>
			</div>`;
		categoriesList.appendChild(li);
	});
};

// Логика
const toggleModal = () => {
	isModalOpen = !isModalOpen;
	setVisibility(els.addArticle, isModalOpen);
};

const navigateHome = () => {
	window.location.href = "index.html";
};

const toggleCollapse = () => {
	const {
		lastOperationsList,
		lastOperationsContainer,
		lastOperationsCollapse,
	} = els;
	if (
		!lastOperationsList ||
		!lastOperationsContainer ||
		!lastOperationsCollapse
	)
		return;

	lastOperationsList.classList.toggle(
		"main-last-operations-ul-collapsed",
		!isCollapsed,
	);
	lastOperationsList.classList.toggle(
		"main-last-operations-ul-opened",
		isCollapsed,
	);

	lastOperationsContainer.classList.toggle(
		"last-operations-container-collapsed",
		!isCollapsed,
	);
	lastOperationsContainer.classList.toggle(
		"last-operations-container-opened",
		isCollapsed,
	);

	lastOperationsCollapse.textContent = isCollapsed ? "Скрыть" : "Показать все";
	isCollapsed = !isCollapsed;

	if (isCollapsed) {
		window.scrollTo({ top: 0, behavior: "smooth" });
	} else {
		setTimeout(() => {
			window.scrollTo({
				top: lastOperationsContainer.offsetTop + 20,
				behavior: "smooth",
			});
		}, 300);
	}
};

// Инициализация
const init = () => {
	renderOperations();
	renderCategoriesTotals();

	bindClick(els.headerLogo, navigateHome);
	bindClick(els.mainButton, toggleModal);
	bindClick(els.addButton, toggleModal);
	bindClick(els.closeButton, toggleModal);
	bindClick(
		els.addArticle,
		(e) => e.target === els.addArticle && toggleModal(),
	);
	bindClick(els.lastOperationsCollapse, toggleCollapse);
};

init();
