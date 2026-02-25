import "./MainCategories.css";

// Тип описывающий одну категорию
type Category = {
	id: string;
	name: string;
	amount: number;
};

// Пропсы компонента: список категорий и необязательный заголовок
type MainCategoriesProps = {
	categories?: Category[];
	title?: string;
};

function MainCategories({
	// Значение по умолчанию — пустой массив
	categories = [],
	// Заголовок по умолчанию
	title = "Расходы по категориям",
}: MainCategoriesProps) {
	return (
		<section
			className="main-container main-categories-container"
			aria-labelledby="categories-title"
		>
			{/* Заголовок блока */}
			<h3 id="categories-title">{title}</h3>
			<ul>
				{/* Показать заглушку, если данных нет */}
				{categories.length === 0 ? (
					<li className="empty">Нет данных</li>
				) : (
					// Отрисовка списка категорий
					categories.map(({ id, name, amount }) => (
						<li key={id} className="category-item">
							<span className="category-name">{name}</span>
							{/* Форматируем число с разделителями разрядов */}
							<span className="category-amount">{amount.toLocaleString()}</span>
						</li>
					))
				)}
			</ul>
		</section>
	);
}

export default MainCategories;
