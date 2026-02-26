import "./MainGoals.css";

import { useState, useCallback } from "react";
import {
	addGoal,
	removeGoal,
	updateGoalTitle,
	type Goal,
} from "../../../store/Store";
import { useStoreSnapshot } from "../../../store/useStoreSnapshot";
import { normalizeGoalTitle } from "../../../utils/utils";
import AddGoalModal from "./add-goal-modal/AddGoalModal";
import { GoalItem } from "./GoalItem";

export default function MainGoals() {
	const { goals } = useStoreSnapshot();

	const [isAddOpen, setAddOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [draftTitle, setDraftTitle] = useState("");

	const startEdit = useCallback((goal: Goal) => {
		setEditingId(goal.id);
		setDraftTitle(goal.title);
	}, []);

	const cancelEdit = useCallback(() => {
		setEditingId(null);
		setDraftTitle("");
	}, []);

	const saveEdit = useCallback(() => {
		if (editingId == null) return;
		const res = normalizeGoalTitle(draftTitle);
		if (!res.ok) return;
		updateGoalTitle(editingId, res.title);
		cancelEdit();
	}, [editingId, draftTitle, cancelEdit]);

	const handleRemove = useCallback(
		(goal: Goal) => {
			if (editingId === goal.id) cancelEdit();
			removeGoal(goal.id);
		},
		[editingId, cancelEdit],
	);

	return (
		<>
			<section
				className="main-container main-goals-container"
				aria-labelledby="goals-title"
			>
				<h3 id="goals-title">Цели</h3>

				{goals.length === 0 && (
					<p>Здесь будут отображаться ваши финансовые цели и их прогресс.</p>
				)}

				<ul className="main-goals-ul">
					{goals.map((goal) => {
						const isEditing = goal.id === editingId;
						return (
							<GoalItem
								key={goal.id}
								goal={goal}
								isEditing={isEditing}
								draftTitle={draftTitle}
								onEditStart={() => startEdit(goal)}
								onEditCancel={cancelEdit}
								onEditSave={saveEdit}
								onRemove={() => handleRemove(goal)}
								onDraftChange={setDraftTitle}
							/>
						);
					})}
				</ul>

				<button
					className="main-goal-add-button"
					type="button"
					onClick={() => setAddOpen(true)}
				>
					Добавить цель
				</button>
			</section>

			<AddGoalModal
				isOpen={isAddOpen}
				onClose={() => setAddOpen(false)}
				onSubmit={addGoal}
			/>
		</>
	);
}
