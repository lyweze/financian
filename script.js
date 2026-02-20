// Утилиты
const qs = (sel) => document.querySelector(sel);
const bindClick = (el, handler) => el?.addEventListener("click", handler);
const setVisibility = (el, visible) => {
	if (!el) return;
	el.style.opacity = visible ? "1" : "0";
	el.style.zIndex = visible ? "1004" : "-1";
	document.body.style.position = visible ? "fixed" : "static";
	if (!visible) setTimeout(() => (el.style.zIndex = "-1"), 300);
};

// DOM-элементы
const els = {
	addArticle: qs(".add-article"),
	mainButton: qs(".main-button"),
	closeButton: qs(".article-close-button"),
	addButton: qs(".article-add-button"),
	categoriesList: qs(".main-categories-container ul"),
	lastOperationsCollapse: qs(".main-last-operation-collapse-button"),
	lastOperationsContainer: qs(".main-last-operations-container"),
	lastOperationsList: qs(".main-last-operations-ul-collapsed"),
	headerLogo: qs(".header-logo"),
	wastes: qs(".main-overview-wastes"),
	income: qs(".main-overview-income"),
	remainder: qs(".main-overview-remainder"),
	dateInput: qs(".article-date-input-valid"),
	dateInputError: qs(".article-date-error"),
	overviewWastes: qs(".overview-wastes"),
};

// Данные
const allOperations = [
	{ id: 1, category: "food", date: "01-01", amount: 900.0 },
	{ id: 2, category: "clothing", date: "01-04", amount: 120.0 },
	{ id: 3, category: "transport", date: "01-04", amount: 1_200_000.0 },
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
let isSortedByDate = false;

// Helpers
const sortOperationsByDateDesc = () => {
	if (!isSortedByDate) {
		allOperations.sort((a, b) => new Date(b.date) - new Date(a.date));
		isSortedByDate = true;
	}
};

const createOperationItem = ({ category, amount }) => {
	const li = document.createElement("li");
	li.innerHTML = `
		<div>
			<div>
				<img src="./assets/svg/${category}.svg" alt="" />
				<p>${operationsCategories[category] ?? category}</p>
			</div>
			<p>${amount} ₽</p>
		</div>`;
	return li;
};

const createCategoryItem = ([category, amount]) => {
	const li = document.createElement("li");
	li.innerHTML = `
		<div>
			<div>
				<img src="./assets/svg/${category}.svg" alt="" />
				<p>${operationsCategories[category] ?? category}</p>
			</div>
			<p>${amount.toFixed(2)} ₽</p>
		</div>`;
	return li;
};

const recalcTotals = () =>
	allOperations.reduce((acc, { category, amount }) => {
		acc[category] = (acc[category] || 0) + amount;
		return acc;
	}, {});

// Рендеры
const renderOperations = () => {
	sortOperationsByDateDesc();

	const { lastOperationsList } = els;
	if (!lastOperationsList) return;

	const fragment = document.createDocumentFragment();
	allOperations.forEach((op) => fragment.appendChild(createOperationItem(op)));
	lastOperationsList.replaceChildren(fragment);
};

const renderCategoriesTotals = () => {
	const { categoriesList } = els;
	if (!categoriesList) return;

	const totals = recalcTotals();
	const fragment = document.createDocumentFragment();

	Object.entries(totals).forEach((entry) =>
		fragment.appendChild(createCategoryItem(entry)),
	);

	categoriesList.replaceChildren(fragment);
};

const renderOverviewTotals = () => {
	const { wastes, income, remainder } = els;
	const totalExpenses = allOperations.reduce((sum, { amount }) => sum + amount, 0);

	if (wastes) wastes.textContent = `${totalExpenses.toFixed(2)} ₽`;
	if (income) income.textContent = "нет";
	if (remainder) remainder.textContent = "пусто(";
};

// Логика
const toggleModal = () => {
	isModalOpen = !isModalOpen;
	setVisibility(els.addArticle, isModalOpen);
};

const navigateHome = () => (window.location.href = "index.html");

const toggleCollapse = () => {
	const { lastOperationsList, lastOperationsContainer, lastOperationsCollapse } = els;
	if (!lastOperationsList || !lastOperationsContainer || !lastOperationsCollapse) return;

	lastOperationsList.classList.toggle("main-last-operations-ul-collapsed", !isCollapsed);
	lastOperationsList.classList.toggle("main-last-operations-ul-opened", isCollapsed);

	lastOperationsContainer.classList.toggle("last-operations-container-collapsed", !isCollapsed);
	lastOperationsContainer.classList.toggle("last-operations-container-opened", isCollapsed);

	lastOperationsCollapse.textContent = isCollapsed ? "Скрыть" : "Показать все";
	isCollapsed = !isCollapsed;

	const scrollTop = isCollapsed ? 0 : lastOperationsCollapse.offsetTop;
	setTimeout(
		() => window.scrollTo({ top: scrollTop, behavior: "smooth" }),
		isCollapsed ? 0 : 300,
	);
};

const addOperation = () => {
	const categoryInput = qs(".article-category-input")?.value;
	const amountInput = qs(".article-amount-input")?.value;
	const rawDate = qs(".article-date-input-valid")?.dataset.raw;
	const dateInput = rawDate ? rawDate.replace(/(\d{2})(\d{2})/, "$1-$2") : null;

	if (!categoryInput || !amountInput || !dateInput) return;

	allOperations.unshift({
		id: allOperations.length + 1,
		category: categoryInput,
		amount: parseFloat(amountInput),
		date: dateInput,
	});
	isSortedByDate = false;

	renderOperations();
	renderCategoriesTotals();
	renderOverviewTotals();
	toggleModal();
};

// Валидация даты
const isValidDayMonth = (dd, mm) => {
	if (!(mm >= 1 && mm <= 12)) return false;
	const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	let max = daysInMonth[mm - 1];
	if (mm === 2) max = 29;
	return dd >= 1 && dd <= max;
};

const formatDM = (value) => {
	const raw = value.replace(/\D/g, "").slice(0, 4);
	const dd = raw.slice(0, 2);
	const mm = raw.slice(2, 4);
	let formatted = dd;
	if (raw.length > 2) formatted += "." + mm;
	return { raw, dd, mm, formatted };
};

const setupDateValidation = () => {
	const { dateInput, dateInputError } = els;
	if (!dateInput || !dateInputError) return;

	dateInput.addEventListener("input", () => {
		const { raw, dd, mm, formatted } = formatDM(dateInput.value);
		dateInput.value = formatted;
		dateInput.dataset.raw = raw;

		if (raw.length < 4) {
			dateInput.setCustomValidity("");
			dateInputError.classList.remove("article-date-error-visible");
			dateInputError.classList.add("article-date-error");
			return;
		}

		const d = Number(dd);
		const m = Number(mm);

		if (!isValidDayMonth(d, m)) {
			dateInput.setCustomValidity("Неверная дата");
			dateInput.classList.replace("article-date-input-valid", "article-date-input-error");
			dateInputError.classList.replace("article-date-error", "article-date-error-visible");
			dateInput.style.animation = "shake 0.3s";
			setTimeout(() => (dateInput.style.animation = ""), 300);
		} else {
			dateInput.setCustomValidity("");
			dateInput.classList.replace("article-date-input-error", "article-date-input-valid");
			dateInputError.classList.replace("article-date-error-visible", "article-date-error");
		}
	});

	dateInput.addEventListener("blur", () => {
		const { raw } = formatDM(dateInput.value);
		if (raw.length > 0 && raw.length < 4) {
			dateInput.setCustomValidity("Введите дату полностью");
			dateInput.classList.replace("article-date-input-valid", "article-date-input-error");
			dateInputError.classList.replace("article-date-error", "article-date-error-visible");
		}
	});
};

// Инициализация
const init = () => {
	renderOperations();
	renderCategoriesTotals();
	renderOverviewTotals();
	setupDateValidation();

	bindClick(els.headerLogo, navigateHome);
	bindClick(els.mainButton, toggleModal);
	bindClick(els.closeButton, toggleModal);
	bindClick(els.addArticle, (e) => e.target === els.addArticle && toggleModal());
	bindClick(els.lastOperationsCollapse, toggleCollapse);
	bindClick(els.addButton, addOperation);

	els.overviewWastes?.addEventListener("click", () => {
		els.lastOperationsContainer.style.animation = "pulse 0.5s";
		els.lastOperationsCollapse.style.animation = "pulseColor 0.5s";
		setTimeout(() => {
			els.lastOperationsContainer.style.animation = "";
			els.lastOperationsCollapse.style.animation = "";
		}, 500);
		console.log("Показать детали расходов");
	});
};

init();
