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
export const allIncomes: Income[] = [
	{ id: 1, date: "01-02", amount: 5000 },
	{ id: 2, date: "01-15", amount: 3200.5 },
	{ id: 3, date: "02-05", amount: 4500.75 },
	{ id: 4, date: "02-18", amount: 6100 },
	{ id: 5, date: "03-03", amount: 2800.25 },
];
export const allOperations: Operation[] = [
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
];
export const operationsCategories: Record<OperationCategory, string> = {
	food: "Еда",
	clothing: "Одежда",
	transport: "Транспорт",
	online: "Онлайн",
	other: "Разное",
	shop: "Магазин",
};
export interface StoreState {
	isModalOpen: boolean;
	isCollapsed: boolean;
	isSortedByDate: boolean;
}
export const state: StoreState = {
	isModalOpen: false,
	isCollapsed: true,
	isSortedByDate: false,
};

/** ---- подписки ---- */
type Listener = () => void;
const listeners = new Set<Listener>();
export const subscribe = (listener: Listener): (() => void) => {
	listeners.add(listener);
	return () => listeners.delete(listener);
};

/** Версия стора для useSyncExternalStore */
let revision = 0;
/** Снапшот для useSyncExternalStore */
export const getStoreSnapshot = (): number => revision;
/** Селектор для целей — копия массива */
export const getGoals = (): Goal[] => [...goals];

export const notify = (): void => {
	revision += 1;
	listeners.forEach((l) => l());
};

/** Примеры действий */
export const addOperation = (op: Operation): void => {
	allOperations.push(op);
	notify();
};
export const addIncome = (inc: Income): void => {
	allIncomes.push(inc);
	notify();
};
export const setModalOpen = (open: boolean): void => {
	state.isModalOpen = open;
	notify();
};

export interface Tip {
	id: number;
	text: string;
}
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

// Goals
export interface Goal {
	id: number;
	title: string;
}
export const goals: Goal[] = [];

const nextGoalId = (): number =>
	goals.length ? Math.max(...goals.map((g) => g.id)) + 1 : 1;

export const addGoal = (title?: string): void => {
	const id = nextGoalId();
	const finalTitle = title?.trim() ? title.trim() : `Цель ${id}`;
	goals.push({ id, title: finalTitle });
	notify();
};
export const updateGoalTitle = (id: number, title: string): void => {
	const t = title.trim();
	if (!t) return;
	const goal = goals.find((g) => g.id === id);
	if (!goal) return;
	goal.title = t;
	notify();
};
export const removeGoal = (id: number): void => {
	const idx = goals.findIndex((g) => g.id === id);
	if (idx === -1) return;
	goals.splice(idx, 1);
	notify();
};
