"use strict";

/* ============================
 * Константы данных
 * ============================ */
const allIncomes = [
	{ id: 1, date: "01-02", amount: 5000.0 },
	{ id: 2, date: "01-15", amount: 3200.5 },
	{ id: 3, date: "02-05", amount: 4500.75 },
	{ id: 4, date: "02-18", amount: 6100.0 },
	{ id: 5, date: "03-03", amount: 2800.25 },
];

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

/* ============================
 * Состояние
 * ============================ */
const state = {
	isModalOpen: false,
	isCollapsed: true,
	isSortedByDate: false,
};

/* ============================
 * DOM-элементы
 * ============================ */
const qs = (sel) => document.querySelector(sel);
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
	overviewIncome: qs(".overview-income"),
	incomeModal: qs(".add-income-article"),
	incomeCloseBtn: qs(".article-income-close-button"),
};

/* ============================
 * Утилиты
 * ============================ */
const bindClick = (el, handler) => el?.addEventListener("click", handler);
const toggleClasses = (el, pairs) =>
	pairs.forEach(([cls, on]) => el.classList.toggle(cls, on));
const setVisibility = (el, visible) => {
	if (!el) return;
	el.style.opacity = visible ? "1" : "0";
	el.style.zIndex = visible ? "1004" : "-1";
	document.body.style.position = visible ? "fixed" : "static";
	if (!visible) setTimeout(() => (el.style.zIndex = "-1"), 300);
};
const formatAmount = (amount) => {
	const fixed = amount.toFixed(2);
	return parseFloat(fixed) % 1 === 0 ? amount.toFixed(0) : fixed;
};

/* ============================
 * Вспомогательные вычисления
 * ============================ */
const sortOperationsByDateDesc = () => {
	if (!state.isSortedByDate) {
		allOperations.sort((a, b) => new Date(b.date) - new Date(a.date));
		state.isSortedByDate = true;
	}
};

const recalcTotals = () =>
	allOperations.reduce((acc, { category, amount }) => {
		acc[category] = (acc[category] || 0) + amount;
		return acc;
	}, {});

/* ============================
 * Фабрики элементов
 * ============================ */
const createOperationItem = ({ category, amount, date }) => {
	const li = document.createElement("li");
	li.innerHTML = `
		<div>
			<div>
				<img src="./assets/svg/${category}.svg" alt="" />
				<p>${operationsCategories[category] ?? category}</p>
			</div>
			<p><span>${date}</span>${formatAmount(amount)} ₽</p>
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
			<p>${formatAmount(amount)} ₽</p>
		</div>`;
	return li;
};

/* ============================
 * Рендеры
 * ============================ */
const renderIncomeHistory = () => {
	const incomeHistoryList = qs(".overview-income-history-ul");
	if (!incomeHistoryList) return;

	const fragment = document.createDocumentFragment();
	[...allIncomes]
		.sort((a, b) => new Date(`2024-${b.date}`) - new Date(`2024-${a.date}`))
		.forEach(({ date, amount }) => {
			const li = document.createElement("li");
			li.innerHTML = `<p>${date.replace("-", ".")} <span>${formatAmount(
				amount,
			)} ₽</span></p>`;
			fragment.appendChild(li);
		});

	incomeHistoryList.replaceChildren(fragment);
};

const renderOperations = () => {
	sortOperationsByDateDesc();

	if (allOperations.length === 0) {
		const { lastOperationsContainer } = els;
		if (lastOperationsContainer) {
			lastOperationsContainer.innerHTML = `
				<h3>Последние операции</h3>
				<p>Здесь пока нет операций</p>`;
			lastOperationsContainer.style.justifyContent = "center";
			lastOperationsContainer.style.alignItems = "center";
		}
	}

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
	const totalExpenses = allOperations.reduce(
		(sum, { amount }) => sum + amount,
		0,
	);
	const totalIncome =
		allIncomes?.reduce((sum, { amount }) => sum + amount, 0) || 0;
	const balance = totalIncome - totalExpenses;

	if (wastes) wastes.textContent = `${formatAmount(totalExpenses)} ₽`;
	if (income) income.textContent = `${formatAmount(totalIncome)} ₽`;
	if (remainder) remainder.textContent = `${formatAmount(balance)} ₽`;
};

/* ============================
 * Валидация даты (расходы)
 * ============================ */
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
	const formatted = raw.length > 2 ? `${dd}.${mm}` : dd;
	return { raw, dd, mm, formatted };
};

const applyDateError = (input, errorEl, message) => {
	input.setCustomValidity(message);
	input.classList.replace(
		"article-date-input-valid",
		"article-date-input-error",
	);
	errorEl.classList.replace("article-date-error", "article-date-error-visible");
};

const clearDateError = (input, errorEl) => {
	input.setCustomValidity("");
	input.classList.replace(
		"article-date-input-error",
		"article-date-input-valid",
	);
	errorEl.classList.replace("article-date-error-visible", "article-date-error");
};

const setupDateValidation = () => {
	const { dateInput, dateInputError } = els;
	if (!dateInput || !dateInputError) return;

	dateInput.addEventListener("input", () => {
		const { raw, dd, mm, formatted } = formatDM(dateInput.value);
		dateInput.value = formatted;
		dateInput.dataset.raw = raw;

		if (raw.length < 4) {
			clearDateError(dateInput, dateInputError);
			return;
		}

		const d = Number(dd);
		const m = Number(mm);

		if (!isValidDayMonth(d, m)) {
			applyDateError(dateInput, dateInputError, "Неверная дата");
			dateInput.style.animation = "shake 0.3s";
			setTimeout(() => (dateInput.style.animation = ""), 300);
		} else {
			clearDateError(dateInput, dateInputError);
		}
	});

	dateInput.addEventListener("blur", () => {
		const { raw } = formatDM(dateInput.value);
		if (raw.length > 0 && raw.length < 4) {
			applyDateError(dateInput, dateInputError, "Введите дату полностью");
		}
	});
};

/* ============================
 * Валидация даты (доходы)
 * ============================ */
const applyIncomeDateError = (input, errorEl, message) => {
	input.setCustomValidity(message);
	input.classList.replace(
		"article-income-date-input-valid",
		"article-income-date-input-error",
	);
	errorEl.classList.replace(
		"article-income-date-error",
		"article-income-date-error-visible",
	);
};

const clearIncomeDateError = (input, errorEl) => {
	input.setCustomValidity("");
	input.classList.replace(
		"article-income-date-input-error",
		"article-income-date-input-valid",
	);
	errorEl.classList.replace(
		"article-income-date-error-visible",
		"article-income-date-error",
	);
};

const setupIncomeDateValidation = () => {
	const input =
		qs(".article-income-date-input-valid") ||
		qs(".article-income-date-input-error");
	const errorEl =
		qs(".article-income-date-error") ||
		qs(".article-income-date-error-visible");
	if (!input || !errorEl) return;

	input.addEventListener("input", () => {
		const { raw, dd, mm, formatted } = formatDM(input.value);
		input.value = formatted;
		input.dataset.raw = raw;

		if (raw.length < 4) {
			clearIncomeDateError(input, errorEl);
			return;
		}

		const d = Number(dd);
		const m = Number(mm);
		if (!isValidDayMonth(d, m)) {
			applyIncomeDateError(input, errorEl, "Неверная дата");
			input.style.animation = "shake 0.3s";
			setTimeout(() => (input.style.animation = ""), 300);
		} else {
			clearIncomeDateError(input, errorEl);
		}
	});

	input.addEventListener("blur", () => {
		const { raw } = formatDM(input.value);
		if (raw.length > 0 && raw.length < 4) {
			applyIncomeDateError(input, errorEl, "Введите дату полностью");
		}
	});
};

/* ============================
 * Логика UI: модалки и кнопки
 * ============================ */
const toggleModal = () => {
	state.isModalOpen = !state.isModalOpen;
	setVisibility(els.addArticle, state.isModalOpen);
};

const toggleIncomeModal = () =>
	setVisibility(els.incomeModal, els.incomeModal?.style.opacity !== "1");

const navigateHome = () => (window.location.href = "index.html");

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

	toggleClasses(lastOperationsList, [
		["main-last-operations-ul-collapsed", !state.isCollapsed],
		["main-last-operations-ul-opened", state.isCollapsed],
	]);
	toggleClasses(lastOperationsContainer, [
		["last-operations-container-collapsed", !state.isCollapsed],
		["last-operations-container-opened", state.isCollapsed],
	]);

	lastOperationsCollapse.textContent = state.isCollapsed
		? "Скрыть"
		: "Показать все";
	state.isCollapsed = !state.isCollapsed;

	const scrollTop = state.isCollapsed ? 0 : lastOperationsCollapse.offsetTop;
	setTimeout(
		() => window.scrollTo({ top: scrollTop, behavior: "smooth" }),
		state.isCollapsed ? 0 : 300,
	);
};

/* ============================
 * Добавление данных
 * ============================ */
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
	state.isSortedByDate = false;

	renderOperations();
	renderCategoriesTotals();
	renderOverviewTotals();
	toggleModal();
};

const addIncome = () => {
	const amountInput = qs(".add-income-article .article-income-amount-input");
	const dateInput =
		qs(".article-income-date-input-valid") ||
		qs(".article-income-date-input-error");
	const errorEl =
		qs(".article-income-date-error-visible") ||
		qs(".article-income-date-error");
	const rawDate = dateInput?.dataset.raw;
	const date = rawDate ? rawDate.replace(/(\d{2})(\d{2})/, "$1-$2") : null;
	const amount = parseFloat(amountInput?.value || "");

	if (!amount || !date) {
		if (!date && dateInput && errorEl) {
			applyIncomeDateError(dateInput, errorEl, "Введите дату полностью");
		}
		return;
	}

	allIncomes.push({
		id: allIncomes.length + 1,
		date,
		amount,
	});

	renderIncomeHistory();
	renderOverviewTotals();
	toggleIncomeModal();

	if (amountInput) amountInput.value = "";
	if (dateInput) {
		dateInput.value = "";
		dateInput.dataset.raw = "";
		if (errorEl) clearIncomeDateError(dateInput, errorEl);
	}
};

/* ============================
 * Инициализация модалки доходов
 * ============================ */
const incomeOpenBtn = els.overviewIncome;
const initIncomeModal = () => {
	setVisibility(els.incomeModal, false);
	bindClick(incomeOpenBtn, toggleIncomeModal);
	bindClick(els.incomeCloseBtn, toggleIncomeModal);
	els.incomeModal?.addEventListener("click", (e) => {
		if (e.target === els.incomeModal) toggleIncomeModal();
	});
};

/* ============================
 * Инициализация приложения
 * ============================ */
const init = () => {
	renderOperations();
	renderCategoriesTotals();
	renderOverviewTotals();
	renderIncomeHistory();
	setupDateValidation();
	initIncomeModal();

	bindClick(els.headerLogo, navigateHome);
	bindClick(els.mainButton, toggleModal);
	bindClick(els.closeButton, toggleModal);
	bindClick(
		els.addArticle,
		(e) => e.target === els.addArticle && toggleModal(),
	);
	bindClick(els.lastOperationsCollapse, toggleCollapse);
	bindClick(els.addButton, addOperation);

	els.overviewWastes?.addEventListener("click", () => {
		els.lastOperationsContainer.style.animation = "pulse 0.5s";
		els.lastOperationsCollapse.style.animation = "pulseColor 0.5s";
		setTimeout(() => {
			els.lastOperationsContainer.style.animation = "";
			els.lastOperationsCollapse.style.animation = "";
		}, 500);
	});
};

/* ============================
 * Запуск
 * ============================ */
init();
setupIncomeDateValidation();
bindClick(qs(".article-income-add-button"), addIncome);

document.querySelectorAll(".article-amount-input").forEach((el) => {
	el.addEventListener("input", () => {
		el.value = el.value.replace(/[^\d.]/g, "");
	});
});
document.querySelectorAll(".article-income-amount-input").forEach((el) => {
	el.addEventListener("input", () => {
		el.value = el.value.replace(/[^\d.]/g, "");
	});
});
