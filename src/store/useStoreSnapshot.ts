import { useEffect, useState } from "react";
import {
	allIncomes,
	allOperations,
	getGoals,
	getStoreSnapshot,
	state,
	subscribe,
	tips,
} from "./Store";

export function useStoreSnapshot() {
	const [snapshot, setSnapshot] = useState(() => ({
		revision: getStoreSnapshot(),
		allOperations,
		allIncomes,
		state,
		tips,
		goals: getGoals(),
	}));

	useEffect(() => {
		return subscribe(() => {
			setSnapshot({
				revision: getStoreSnapshot(),
				allOperations,
				allIncomes,
				state,
				tips,
				goals: getGoals(), // новая ссылка на массив
			});
		});
	}, []);

	return snapshot;
}
