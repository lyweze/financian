import {
	allOperations,
	operationsCategories,
	state,
	type Operation,
} from "../store/Store";

/**
 * В этом файле оставляем ТОЛЬКО "чистые" утилиты (без querySelector/innerHTML/addEventListener),
 * чтобы они одинаково хорошо работали и в React, и вне React.
 *
 * Причины изменений:
 * - Убраны qs/bindClick/toggleClasses/setVisibility: это прямые DOM-манипуляции, не React-way.
 * - Убраны createOperationItem/createCategoryItem: они возвращали HTML-элементы (не подходят для React JSX).
 * - imgPath убран из utils: путь к public-ассетам лучше задавать в компонентах (например "/assets/svg").
 * - Исправлена сортировка дат: "MM-DD" нельзя надёжно парсить через new Date("01-04").
 * - Перестали использовать declare const: теперь реальные импорты из store/Store.
 */

/** Форматирование суммы: целое без дроби, иначе 2 знака после запятой */
export const formatAmount = (amount: number): string =>
	Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(2);

/** Человекочитаемое название категории */
export const categoryTitle = (
	category: keyof typeof operationsCategories | string,
): string =>
	category in operationsCategories
		? operationsCategories[category as keyof typeof operationsCategories]
		: category;

/**
 * Парсинг "MM-DD" в число для сравнения/сортировки.
 * Пример: "02-10" -> 210, "12-31" -> 1231
 */
export const parseMMDD = (mmdd: string): number => {
	const [mmStr, ddStr] = mmdd.split("-");
	const mm = Number(mmStr);
	const dd = Number(ddStr);
	if (!Number.isFinite(mm) || !Number.isFinite(dd)) return -Infinity;
	return mm * 100 + dd;
};

/**
 * Сортировка операций по дате по убыванию.
 * ВАЖНО:
 * - Функция МУТИРУЕТ allOperations (как и раньше), но делает это корректно для "MM-DD".
 * - Флаг state.isSortedByDate сохранён (как у тебя), чтобы сортировка выполнялась один раз.
 *
 * Если позже перейдёшь на реактивный стор (useState/Context/Zustand),
 * лучше сделать сортировку НЕ мутирующей и возвращающей новый массив.
 */
export const sortOperationsByDateDesc = (): void => {
	if (state.isSortedByDate) return;

	allOperations.sort(
		(a: Operation, b: Operation) => parseMMDD(b.date) - parseMMDD(a.date),
	);

	state.isSortedByDate = true;
};

/** Вернуть новый массив операций, отсортированный по дате (НЕ мутируя allOperations). */
export const getOperationsSortedByDateDesc = (): Operation[] =>
	[...allOperations].sort((a, b) => parseMMDD(b.date) - parseMMDD(a.date));

/** Пересчёт итогов по категориям */
export const recalcTotals = (): Record<string, number> =>
	allOperations.reduce<Record<string, number>>((acc, { category, amount }) => {
		acc[category] = (acc[category] || 0) + amount;
		return acc;
	}, {});

/** Проверка корректности дня и месяца */
export const isValidDayMonth = (dd: number, mm: number): boolean => {
	if (mm < 1 || mm > 12) return false;
	const max = new Date(2000, mm, 0).getDate(); // 2000 — високосный год
	return dd >= 1 && dd <= max;
};

/** Форматирование ввода ddmm -> dd.mm с разбиением на части */
export const formatDM = (
	value: string,
): { raw: string; dd: string; mm: string; formatted: string } => {
	const raw = value.replace(/\D/g, "").slice(0, 4);
	const dd = raw.slice(0, 2);
	const mm = raw.slice(2, 4);
	return { raw, dd, mm, formatted: raw.length > 2 ? `${dd}.${mm}` : dd };
};

/**
 * Дополнительно (опционально): если захочешь перейти на нормальные даты "YYYY-MM-DD",
 * можно добавить отдельный парсер/сортировку и постепенно мигрировать.
 */
// export const parseYMD = (ymd: string): number => new Date(ymd).getTime();

/* -------------------- Goals helpers -------------------- */

export type GoalTitleResult =
	| { ok: true; title: string }
	| { ok: false; error: string };

/**
 * Нормализует и валидирует название цели.
 * Единые правила для модалки добавления и редактирования.
 */
export const normalizeGoalTitle = (value: string): GoalTitleResult => {
	const title = value.replace(/\s+/g, " ").trim();

	if (!title) return { ok: false, error: "Введите название цели" };
	if (title.length < 2)
		return { ok: false, error: "Слишком короткое название" };
	if (title.length > 40)
		return { ok: false, error: "Слишком длинное название" };

	return { ok: true, title };
};
