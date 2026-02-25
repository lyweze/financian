import "./MainCharts.css";

type MainChartsProps = {
	// Заголовок секции графика
	title?: string;
	// Текст для aria-label графика
	ariaLabel?: string;
	// id контейнера под график (для сторонних библиотек)
	chartId?: string;
};

function MainCharts({
	title = "График операций", // значение по умолчанию для заголовка
	ariaLabel = "График расходов", // значение по умолчанию для aria-label
	chartId = "chart", // значение по умолчанию для id контейнера графика
}: MainChartsProps) {
	return (
		<section
			className="main-container main-chart-container"
			aria-labelledby="chart-title" // связываем секцию с заголовком по aria
		>
			<h3 id="chart-title">{title}</h3>
			{/* Контейнер для рендеринга графика (например, через стороннюю библиотеку) */}
			<div id={chartId} role="img" aria-label={ariaLabel}></div>
		</section>
	);
}

export default MainCharts;
