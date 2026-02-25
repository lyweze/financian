import "./MainGoals.css";

// Тип цели с идентификатором и заголовком
type Goal = {
	id: string;
	title: string;
};

// Пропсы компонента: список целей и колбэки действий
type MainGoalsProps = {
	goals?: Goal[];
	onEditGoal?: (id: string) => void;
	onAddGoal?: () => void;
};

function MainGoals({
	// Значения по умолчанию для демонстрации
	goals = [
		{ id: "1", title: "Цель 1" },
		{ id: "2", title: "Цель 2" },
	],
	onEditGoal,
	onAddGoal,
}: MainGoalsProps) {
	return (
		<section
			className="main-container main-goals-container"
			aria-labelledby="goals-title"
		>
			<h3 id="goals-title">Цели</h3>
			<p>Здесь будут отображаться ваши финансовые цели и их прогресс.</p>

			{/* Список целей с кнопками редактирования */}
			<ul className="main-goals-ul">
				{goals.map(({ id, title }) => (
					<li key={id}>
						<h4>{title}</h4>
						<button
							type="button"
							className="edit-goal-button"
							onClick={() => onEditGoal?.(id)}
						>
							Редактировать
						</button>
					</li>
				))}
			</ul>

			{/* Кнопка добавления новой цели */}
			<button
				className="main-goal-add-button"
				type="button"
				onClick={onAddGoal}
			>
				Добавить цель
			</button>
		</section>
	);
}

export default MainGoals;
