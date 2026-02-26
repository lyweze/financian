import { memo } from "react";
import type { Goal } from "../../../store/Store";

type Props = {
	goal: Goal;
	isEditing: boolean;
	draftTitle: string;
	onEditStart(): void;
	onEditCancel(): void;
	onEditSave(): void;
	onRemove(): void;
	onDraftChange(v: string): void;
};

export const GoalItem = memo(function GoalItem({
	goal,
	isEditing,
	draftTitle,
	onEditStart,
	onEditCancel,
	onEditSave,
	onRemove,
	onDraftChange,
}: Props) {
	return (
		<li className={isEditing ? "is-editing" : ""}>
			{isEditing ? (
				<input
					id={`goal-title-input-${goal.id}`}
					value={draftTitle}
					onChange={(e) => onDraftChange(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") onEditSave();
						if (e.key === "Escape") onEditCancel();
					}}
					aria-label="Название цели"
					autoFocus
				/>
			) : (
				<h4>{goal.title}</h4>
			)}

			{isEditing ? (
				<div style={{ display: "flex", gap: 10 }}>
					<button type="button" onClick={onEditSave}>
						Сохранить
					</button>
					<button type="button" onClick={onEditCancel}>
						Отмена
					</button>
				</div>
			) : (
				<div style={{ display: "flex", gap: 10 }}>
					<button type="button" onClick={onEditStart}>
						Редактировать
					</button>
					<button type="button" onClick={onRemove}>
						Удалить
					</button>
				</div>
			)}
		</li>
	);
});
