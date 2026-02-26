import "./MainLastOperations.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { operationsCategories, type Operation } from "../../../store/Store";
import { useStoreSnapshot } from "../../../store/useStoreSnapshot";
import { formatAmount, parseMMDD } from "../../../utils/utils";

// svg лежат в public/assets/svg
const imgPath = "/assets/svg";

const categoryTitle = (category: Operation["category"]) =>
	operationsCategories[category] ?? category;

export default function MainLastOperations() {
	// 1) UI-состояние collapse должно быть локальным стейтом компонента (не в глобальном state)
	const [isCollapsed, setIsCollapsed] = useState(true);

	// 2) Получаем данные так, чтобы компонент ре-рендерился при изменениях стора
	const { allOperations } = useStoreSnapshot();

	// 3) Сортировка без мутаций, с корректным парсингом "MM-DD"
	const operationsSorted = useMemo(() => {
		return [...allOperations].sort(
			(a, b) => parseMMDD(b.date) - parseMMDD(a.date),
		);
	}, [allOperations]);

	const collapseBtnRef = useRef<HTMLButtonElement | null>(null);

	const containerClassName = [
		"main-container",
		"main-last-operations-container",
		isCollapsed
			? "last-operations-container-collapsed"
			: "last-operations-container-opened",
	].join(" ");

	const listClassName = isCollapsed
		? "main-last-operations-ul-collapsed"
		: "main-last-operations-ul-opened";

	const toggleCollapse = () => setIsCollapsed((v) => !v);

	// 4) Скролл — через effect, без qs/addEventListener
	useEffect(() => {
		const btn = collapseBtnRef.current;
		if (!btn) return;

		const scrollTop = isCollapsed ? 0 : btn.offsetTop;
		const delay = isCollapsed ? 0 : 300;

		const id = window.setTimeout(() => {
			window.scrollTo({ top: scrollTop, behavior: "smooth" });
		}, delay);

		return () => window.clearTimeout(id);
	}, [isCollapsed]);

	// 5) Пустое состояние без innerHTML
	if (operationsSorted.length === 0) {
		return (
			<section
				className={containerClassName}
				aria-labelledby="last-ops-title"
				style={{ justifyContent: "center", alignItems: "center" }}
			>
				<h3 id="last-ops-title">Последние операции</h3>
				<p>Здесь пока нет операций</p>
			</section>
		);
	}

	// 6) Разметка соответствует твоему HTML: h3 -> ul -> button
	return (
		<section className={containerClassName} aria-labelledby="last-ops-title">
			<h3 id="last-ops-title">Последние операции</h3>

			<ul className={listClassName}>
				{operationsSorted.map((op) => (
					<li key={op.id}>
						<div>
							<div>
								<img src={`${imgPath}/${op.category}.svg`} alt="" />
								<p>{categoryTitle(op.category)}</p>
							</div>

							<p>
								<span>{op.date}</span>
								{formatAmount(op.amount)} ₽
							</p>
						</div>
					</li>
				))}
			</ul>

			<button
				ref={collapseBtnRef}
				type="button"
				className="main-last-operation-collapse-button"
				onClick={toggleCollapse}
			>
				{isCollapsed ? "Показать все" : "Скрыть"}
			</button>
		</section>
	);
}
