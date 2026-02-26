// --- Типы ---
type OperationCategory =
	| "food"
	| "clothing"
	| "transport"
	| "online"
	| "other"
	| "shop";

export interface Income {
	id: number;
	date: string;
	amount: number;
}
export interface Operation {
	id: number;
	category: OperationCategory;
	date: string;
	amount: number;
}
export interface Goal {
	id: number;
	title: string;
}
export interface Tip {
	id: number;
	text: string;
}
export interface StoreState {
	isModalOpen: boolean;
	isCollapsed: boolean;
	isSortedByDate: boolean;
}

// --- Категории ---
export const operationsCategories: Record<OperationCategory, string> = {
	food: "Еда",
	clothing: "Одежда",
	transport: "Транспорт",
	online: "Онлайн",
	other: "Разное",
	shop: "Магазин",
};

// --- LocalStorage ---
const OPS_KEY = "allOperations";
const INCS_KEY = "allIncomes";
const GOALS_KEY = "allGoals";

function loadFromLS<T>(key: string, fallback: T): T {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw);
	} catch (e) {
		console.log(`loadFromLS error for key ${key}:`, e);
		return fallback;
	}
}
function saveToLS<T>(key: string, value: T): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
		console.log(`[localStorage] Saved ${key}:`, value);
	} catch (e) {
		console.log(`saveToLS error for key ${key}:`, e);
	}
}

// --- Данные (с примерами) ---
export const allIncomes: Income[] = loadFromLS<Income[]>(INCS_KEY, [
	{ id: 1, date: "01-02", amount: 5000 },
	{ id: 2, date: "01-15", amount: 3200.5 },
	{ id: 3, date: "02-05", amount: 4500.75 },
	{ id: 4, date: "02-18", amount: 6100 },
	{ id: 5, date: "03-03", amount: 2800.25 },
]);
export const allOperations: Operation[] = loadFromLS<Operation[]>(OPS_KEY, [
	{ id: 1, category: "food", date: "01-01", amount: 900 },
	{ id: 2, category: "clothing", date: "01-04", amount: 120 },
	{ id: 3, category: "transport", date: "01-04", amount: 1200000 },
	{ id: 4, category: "online", date: "01-04", amount: 120 },
	{ id: 5, category: "other", date: "01-04", amount: 120 },
	{ id: 6, category: "food", date: "02-10", amount: 560.5 },
	{ id: 7, category: "clothing", date: "02-12", amount: 2300 },
	{ id: 8, category: "transport", date: "02-13", amount: 420 },
	{ id: 9, category: "online", date: "02-14", amount: 999.99 },
	{ id: 10, category: "other", date: "02-15", amount: 75.25 },
	{ id: 11, category: "food", date: "03-02", amount: 1300 },
	{ id: 12, category: "clothing", date: "03-05", amount: 480.75 },
	{ id: 13, category: "transport", date: "03-07", amount: 650 },
	{ id: 14, category: "online", date: "03-09", amount: 310.4 },
	{ id: 15, category: "other", date: "03-11", amount: 55 },
	{ id: 16, category: "shop", date: "01-08", amount: 300 },
	{ id: 17, category: "shop", date: "02-20", amount: 780.5 },
	{ id: 18, category: "shop", date: "03-15", amount: 150.99 },
]);
export const goals: Goal[] = loadFromLS<Goal[]>(GOALS_KEY, []);

export const state: StoreState = {
	isModalOpen: false,
	isCollapsed: true,
	isSortedByDate: false,
};

// --- Подписки ---
type Listener = () => void;
const listeners = new Set<Listener>();
export const subscribe = (listener: Listener): (() => void) => {
	listeners.add(listener);
	console.log("Listener subscribed:", listener);
	return () => {
		listeners.delete(listener);
		console.log("Listener unsubscribed:", listener);
	};
};

let revision = 0;
export const getStoreSnapshot = (): number => revision;
export const getGoals = (): Goal[] => [...goals];

export const notify = (): void => {
	revision += 1;
	console.log("Notify listeners. Revision:", revision);
	listeners.forEach((l) => l());
};

// --- Утилиты для id ---
export const nextOperationId = () =>
	allOperations.length ? Math.max(...allOperations.map((op) => op.id)) + 1 : 1;
export const nextIncomeId = () =>
	allIncomes.length ? Math.max(...allIncomes.map((inc) => inc.id)) + 1 : 1;
export const nextGoalId = () =>
	goals.length ? Math.max(...goals.map((g) => g.id)) + 1 : 1;

// --- Валидация ---
function isValidOperation(op: Operation): boolean {
	return (
		!!op &&
		typeof op.amount === "number" &&
		!isNaN(op.amount) &&
		typeof op.date === "string" &&
		!!op.category
	);
}
function isValidIncome(inc: Income): boolean {
	return (
		!!inc &&
		typeof inc.amount === "number" &&
		!isNaN(inc.amount) &&
		typeof inc.date === "string"
	);
}
function isValidGoal(goal: Goal): boolean {
	return !!goal && typeof goal.title === "string" && !!goal.title.trim();
}

// --- Операции и доходы: добавление, редактирование, удаление ---
export const addOperation = (op: Operation): void => {
	if (!isValidOperation(op)) {
		console.log("[addOperation] Invalid operation:", op);
		return;
	}
	allOperations.push(op);
	saveToLS(OPS_KEY, allOperations);
	console.log("[addOperation]", op);
	notify();
};
export const editOperation = (id: number, patch: Partial<Operation>): void => {
	const op = allOperations.find((o) => o.id === id);
	if (!op) {
		console.log(`[editOperation] Not found: id=${id}`);
		return;
	}
	Object.assign(op, patch);
	saveToLS(OPS_KEY, allOperations);
	console.log("[editOperation]", op);
	notify();
};
export const removeOperation = (id: number): void => {
	const idx = allOperations.findIndex((op) => op.id === id);
	if (idx === -1) {
		console.log(`[removeOperation] Not found: id=${id}`);
		return;
	}
	allOperations.splice(idx, 1);
	saveToLS(OPS_KEY, allOperations);
	console.log("[removeOperation] id =", id);
	notify();
};

export const addIncome = (inc: Income): void => {
	if (!isValidIncome(inc)) {
		console.log("[addIncome] Invalid income:", inc);
		return;
	}
	allIncomes.push(inc);
	saveToLS(INCS_KEY, allIncomes);
	console.log("[addIncome]", inc);
	notify();
};
export const editIncome = (id: number, patch: Partial<Income>): void => {
	const inc = allIncomes.find((o) => o.id === id);
	if (!inc) {
		console.log(`[editIncome] Not found: id=${id}`);
		return;
	}
	Object.assign(inc, patch);
	saveToLS(INCS_KEY, allIncomes);
	console.log("[editIncome]", inc);
	notify();
};
export const removeIncome = (id: number): void => {
	const idx = allIncomes.findIndex((inc) => inc.id === id);
	if (idx === -1) {
		console.log(`[removeIncome] Not found: id=${id}`);
		return;
	}
	allIncomes.splice(idx, 1);
	saveToLS(INCS_KEY, allIncomes);
	console.log("[removeIncome] id =", id);
	notify();
};

// --- Цели: добавление, редактирование, удаление ---
export const addGoal = (title?: string): void => {
	const id = nextGoalId();
	const finalTitle = title?.trim() ? title.trim() : `Цель ${id}`;
	const goal: Goal = { id, title: finalTitle };
	if (!isValidGoal(goal)) {
		console.log("[addGoal] Invalid goal:", goal);
		return;
	}
	goals.push(goal);
	saveToLS(GOALS_KEY, goals);
	console.log("[addGoal]", goal);
	notify();
};
export const updateGoalTitle = (id: number, title: string): void => {
	const t = title.trim();
	if (!t) {
		console.log("[updateGoalTitle] Empty title");
		return;
	}
	const goal = goals.find((g) => g.id === id);
	if (!goal) {
		console.log(`[updateGoalTitle] Not found: id=${id}`);
		return;
	}
	goal.title = t;
	saveToLS(GOALS_KEY, goals);
	console.log("[updateGoalTitle]", goal);
	notify();
};
export const removeGoal = (id: number): void => {
	const idx = goals.findIndex((g) => g.id === id);
	if (idx === -1) {
		console.log(`[removeGoal] Not found: id=${id}`);
		return;
	}
	goals.splice(idx, 1);
	saveToLS(GOALS_KEY, goals);
	console.log("[removeGoal] id =", id);
	notify();
};

// --- Экспорт/Импорт/Очистка/Сброс ---
export const exportData = () => {
	const data = JSON.stringify({ allOperations, allIncomes, goals });
	console.log("[exportData]", data);
	return data;
};
export const importData = (data: string): void => {
	try {
		const {
			allOperations: ops,
			allIncomes: incs,
			goals: gs,
		} = JSON.parse(data);
		if (Array.isArray(ops)) {
			allOperations.length = 0;
			allOperations.push(...ops);
			saveToLS(OPS_KEY, allOperations);
		}
		if (Array.isArray(incs)) {
			allIncomes.length = 0;
			allIncomes.push(...incs);
			saveToLS(INCS_KEY, allIncomes);
		}
		if (Array.isArray(gs)) {
			goals.length = 0;
			goals.push(...gs);
			saveToLS(GOALS_KEY, goals);
		}
		notify();
		console.log("[importData] Success:", { ops, incs, gs });
	} catch (e) {
		console.log("[importData] Error:", e, data);
	}
};

export const clearAll = () => {
	allOperations.length = 0;
	allIncomes.length = 0;
	goals.length = 0;
	saveToLS(OPS_KEY, allOperations);
	saveToLS(INCS_KEY, allIncomes);
	saveToLS(GOALS_KEY, goals);
	console.log("[clearAll] Store cleared");
	notify();
};

export const resetStore = () => {
	localStorage.removeItem(OPS_KEY);
	localStorage.removeItem(INCS_KEY);
	localStorage.removeItem(GOALS_KEY);
	console.log("[resetStore] localStorage keys removed");
	window.location.reload();
};

// --- Поддержка синхронизации между вкладками ---
window.addEventListener("storage", (e) => {
	if ([OPS_KEY, INCS_KEY, GOALS_KEY].includes(e.key || "")) {
		console.log(
			"[storage event]:",
			e.key,
			"Reloading arrays from localStorage",
		);
		if (e.key === OPS_KEY) {
			const ops = loadFromLS<Operation[]>(OPS_KEY, []);
			allOperations.length = 0;
			allOperations.push(...ops);
		}
		if (e.key === INCS_KEY) {
			const incs = loadFromLS<Income[]>(INCS_KEY, []);
			allIncomes.length = 0;
			allIncomes.push(...incs);
		}
		if (e.key === GOALS_KEY) {
			const gs = loadFromLS<Goal[]>(GOALS_KEY, []);
			goals.length = 0;
			goals.push(...gs);
		}
		notify();
	}
});

// --- Подсказки ---
export const tips: Tip[] = [
	{ id: 1, text: "Записывай расходы сразу — так проще контролировать бюджет." },
	{ id: 2, text: "Ставь лимиты по категориям и проверяй их раз в неделю." },
	{ id: 3, text: "Откладывай небольшой процент дохода автоматически." },
	{ id: 4, text: "Раз в месяц пересматривай подписки и отключай ненужные." },
	{
		id: 5,
		text: "Перед крупной покупкой сравни цены и дай себе 24 часа на решение.",
	},
];
