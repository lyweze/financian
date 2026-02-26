import "./MainCategories.css";

import { useMemo } from "react";
import { operationsCategories, type Operation } from "../../../store/Store";
import { formatAmount, recalcTotals } from "../../../utils/utils";

// Если svg лежат в Vite в папке public/assets/svg
const imgPath = "/assets/svg";

const categoryTitle = (category: string) =>
	operationsCategories[category as Operation["category"]] ?? category;

function MainCategories() {
	const totals = useMemo(() => recalcTotals(), []);
	const entries = useMemo(() => Object.entries(totals), [totals]);

	return (
		<section
			className="main-container main-categories-container"
			aria-labelledby="categories-title"
		>
			<h3 id="categories-title">Расходы по категориям</h3>

			<ul>
				{entries.map(([category, amount]) => (
					<li key={category}>
						<div>
							<div>
								<img src={`${imgPath}/${category}.svg`} alt="" />
								<p>{categoryTitle(category)}</p>
							</div>

							<p>{formatAmount(amount)} ₽</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}

export default MainCategories;
