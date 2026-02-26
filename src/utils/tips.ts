import type { Tip } from "../store/Store";

/**
 * Возвращает Tip "совет дня".
 * Логика: берём номер дня (в UTC, чтобы не прыгало от таймзоны) и делаем mod tips.length.
 */
export function getTipOfTheDay(
	tips: Tip[],
	now: Date = new Date(),
): Tip | null {
	if (tips.length === 0) return null;

	const dayNumberUtc = Math.floor(now.getTime() / 86_400_000); // 24*60*60*1000
	const index = dayNumberUtc % tips.length;

	return tips[index] ?? null;
}
