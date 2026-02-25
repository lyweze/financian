import { useMemo, useState } from "react";
import "./MainLastOperations.css";

type Operation = {
	id: string; // Уникальный идентификатор операции
	title: string; // Название операции
	amount: number; // Сумма операции
	date: string; // Дата операции
};

type MainLastOperationsProps = {
	operations?: Operation[]; // Список операций
	initialCollapsed?: boolean; // Состояние свернутости по умолчанию
	maxPreview?: number; // Максимум операций, отображаемых в свернутом состоянии
};

function MainLastOperations({
	operations = [],
	initialCollapsed = true,
	maxPreview = 5,
}: MainLastOperationsProps) {
	const [collapsed, setCollapsed] = useState(initialCollapsed); // Состояние: свернуто/развернуто

	// Вычисляем список отображаемых операций: либо обрезка, либо весь список
	const visibleOperations = useMemo(
		() => (collapsed ? operations.slice(0, maxPreview) : operations),
		[collapsed, operations, maxPreview],
	);

	// Проверяем, есть ли больше операций, чем помещается в предпросмотр
	const hasMore = operations.length > maxPreview;

	return (
		<section
			className={`main-container main-last-operations-container ${
				collapsed ? "last-operations-container-collapsed" : ""
			}`}
			aria-labelledby="last-ops-title"
		>
			<h3 id="last-ops-title">Последние операции</h3>

			<ul
				className={
					collapsed
						? "main-last-operations-ul-collapsed"
						: "main-last-operations-ul"
				}
			>
				{visibleOperations.length ? (
					visibleOperations.map(({ id, title, amount, date }) => (
						<li key={id} className="main-last-operations-item">
							<span className="main-last-operations-title">{title}</span>
							<span className="main-last-operations-amount">{amount}</span>
							<span className="main-last-operations-date">{date}</span>
						</li>
					))
				) : (
					<li className="main-last-operations-empty">
						<p>Нет операций</p>
					</li>
				)}
			</ul>

			{hasMore && (
				<button
					type="button"
					className="main-last-operation-collapse-button"
					onClick={() => setCollapsed((prev) => !prev)}
				>
					{collapsed ? "Показать все" : "Скрыть"}
				</button>
			)}
		</section>
	);
}

export default MainLastOperations;
