import "./MainPage.css";

import MainOverview from "./main-overview/mainOverview";
import MainLastOperations from "./main-last-operations/MainLastOperations";
import MainCharts from "./main-charts/MainCharts";
import MainTips from "./main-tips/MainTips";
import MainGoals from "./main-goals/MainGoals";
import MainCategories from "./main-categories/MainCategories";
import MainButton from "./main-button/MainButton";

// Описание секций: класс для li и список компонентов, которые нужно отрендерить
const sections = [
	{ className: "main-ul-li-1", components: [MainOverview, MainLastOperations] },
	{ className: "main-ul-li-2", components: [MainCharts, MainTips] },
	{ className: "main-ul-li-3", components: [MainGoals, MainCategories] },
];

function MainPage() {
	return (
		<main className="main">
			<h2 className="visually-hidden">Главная</h2>
			<ul className="main-ul">
				{sections.map(({ className, components }) => (
					<li key={className} className={className}>
						{/* Рендерим каждый компонент секции */}
						{components.map((Component, componentIndex) => (
							<Component key={`${className}-${componentIndex}`} />
						))}
					</li>
				))}
			</ul>

			<MainButton />
		</main>
	);
}

export default MainPage;
