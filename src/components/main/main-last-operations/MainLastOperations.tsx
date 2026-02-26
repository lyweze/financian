import "./MainLastOperations.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { operationsCategories, type Operation } from "../../../store/Store";
import { useStoreSnapshot } from "../../../store/useStoreSnapshot";
import { formatAmount, parseMMDD } from "../../../utils/utils";

/* constants */
const imgPath = "/assets/svg";

/* helpers */
const categoryTitle = (category: Operation["category"]) =>
	operationsCategories[category] ?? category;

/* собственный хук для сортировки */
function useSortedOperations(ops: Operation[]) {
	return useMemo(
		() => [...ops].sort((a, b) => parseMMDD(b.date) - parseMMDD(a.date)),
		[ops],
	);
}

interface MainLastOperationsProps {
	animate?: boolean;
}

export default function MainLastOperations({
	animate,
}: MainLastOperationsProps) {
	/* refs */
	const sectionRef = useRef<HTMLElement | null>(null);
	const collapseBtnRef = useRef<HTMLButtonElement | null>(null);

	/* локальный UI‑стейт */
	const [isCollapsed, setIsCollapsed] = useState(true);

	/* данные из стора */
	const { allOperations } = useStoreSnapshot();
	const operationsSorted = useSortedOperations(allOperations);

	/* классы */
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

	/* эффекты */
	useEffect(() => {
		// прокрутка при разворачивании/сворачивании
		const btn = collapseBtnRef.current;
		if (!btn) return;

		const scrollTop = isCollapsed ? 0 : btn.offsetTop;
		const delay = isCollapsed ? 0 : 300;

		const id = window.setTimeout(() => {
			window.scrollTo({ top: scrollTop, behavior: "smooth" });
		}, delay);

		return () => window.clearTimeout(id);
	}, [isCollapsed]);

	useEffect(() => {
		if (!sectionRef.current || !animate) return;
		sectionRef.current.classList.remove("pulse");
		void sectionRef.current.offsetWidth; // reflow
		sectionRef.current.classList.add("pulse");
	}, [animate]);

	/* пустое состояние */
	if (operationsSorted.length === 0) {
		return (
			<section
				ref={sectionRef}
				className={`${containerClassName} ${animate ? "pulse" : ""}`}
				aria-labelledby="last-ops-title"
				style={{ justifyContent: "center", alignItems: "center" }}
			>
				<h3 id="last-ops-title">Последние операции</h3>
				<p>Здесь пока нет операций</p>
			</section>
		);
	}

	/* основной рендер */
	return (
		<section
			ref={sectionRef}
			className={`${containerClassName} ${animate ? "pulse" : ""}`}
			aria-labelledby="last-ops-title"
		>
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
