import "./MainPage.css";

import MainOverview from "./main-overview/mainOverview";
import MainLastOperations from "./main-last-operations/MainLastOperations";
import MainCharts from "./main-charts/MainCharts";
import MainTips from "./main-tips/MainTips";
import MainGoals from "./main-goals/MainGoals";
import MainCategories from "./main-categories/MainCategories";
import MainButton from "./main-button/MainButton";

function MainPage() {
	return (
		<main className="main">
			<h2 className="visually-hidden">Главная</h2>

			<ul className="main-ul">
				<li className="main-ul-li-1">
					<MainOverview />
					<MainLastOperations />
				</li>
				<li className="main-ul-li-2">
					<MainCharts />
					<MainTips />
				</li>
				<li className="main-ul-li-3">
					<MainGoals />
					<MainCategories />
				</li>
			</ul>

			< MainButton />
		</main>
	);
}

export default MainPage;
