import "./AddGoalModal.css";

import { useEffect, useId, useRef, useState } from "react";
import { normalizeGoalTitle } from "../../../utils/utils";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (title: string) => void; // сюда MainGoals передаст addGoal
};

export default function AddGoalModal({ isOpen, onClose, onSubmit }: Props) {
	const titleId = useId();
	const inputRef = useRef<HTMLInputElement | null>(null);

	const [title, setTitle] = useState("");
	const [error, setError] = useState<string>("");

	useEffect(() => {
		if (!isOpen) return;
		const id = window.setTimeout(() => inputRef.current?.focus(), 0);
		return () => window.clearTimeout(id);
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isOpen, onClose]);

	const handleAdd = () => {
		const res = normalizeGoalTitle(title);
		if (!res.ok) {
			setError(res.error);
			return;
		}

		onSubmit(res.title);

		setTitle("");
		setError("");
		onClose();
	};

	const handleClose = () => {
		console.log("[AddGoalModal] handleClose called");
		setTitle("");
		setError("");
		onClose();
	};

	if (!isOpen) return null;

	return (
		<article
			style={{ opacity: 1, zIndex: 1004, transition: "opacity 0.3s ease" }}
			className="add-goal-modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) handleClose();
			}}
		>
			<h2 id={titleId}>Добавить цель</h2>

			<div className="add-goal-modal__content">
				<ul>
					<li>
						<h3>Название</h3>
						<input
							ref={inputRef}
							type="text"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
								if (error) setError("");
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleAdd();
								if (e.key === "Escape") handleClose();
							}}
							aria-label="Название цели"
						/>

						{error ? (
							<small className="add-goal-modal__error--visible">{error}</small>
						) : (
							<small className="add-goal-modal__error">
								Введите название цели
							</small>
						)}
					</li>
				</ul>

				<div className="add-goal-modal__buttons">
					<button type="button" onClick={handleAdd}>
						Добавить
					</button>
					<button type="button" onClick={handleClose}>
						Закрыть
					</button>
				</div>
			</div>
		</article>
	);
}
