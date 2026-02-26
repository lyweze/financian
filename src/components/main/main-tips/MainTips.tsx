import "./MainTips.css";

import { useMemo } from "react";
import { useStoreSnapshot } from "../../../store/useStoreSnapshot";
import { getTipOfTheDay } from "../../../utils/tips";

export default function MainTips() {
	const { tips } = useStoreSnapshot();

	const tip = useMemo(() => getTipOfTheDay(tips), [tips]);

	return (
		<section
			className="main-container main-tips-container"
			aria-labelledby="tip-title"
		>
			<h3 id="tip-title">Совет дня</h3>
			<p>{tip?.text ?? "Советов пока нет"}</p>
		</section>
	);
}
