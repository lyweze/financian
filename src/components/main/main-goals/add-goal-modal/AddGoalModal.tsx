import "./AddGoalModal.css";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { normalizeGoalTitle } from "../../../../utils/utils";

// типы пропсов, которые принимает модалка
type Props = {
	isOpen: boolean; // открыт ли диалог
	onClose: () => void; // функция закрытия
	onSubmit: (title: string) => void; // отправка введённой цели
};

function AddGoalModal({ isOpen, onClose, onSubmit }: Props) {
	const titleId = useId(); // уникальный id для заголовка (aria)
	const inputRef = useRef<HTMLInputElement | null>(null); // ссылка на input

	const [title, setTitle] = useState(""); // текущее значение поля
	const [error, setError] = useState<string>(""); // сообщение об ошибке

	// при открытии модалки ставим фокус на инпут
	useLayoutEffect(() => {
		if (!isOpen) return;

		const id = window.setTimeout(() => inputRef.current?.focus(), 0);
		return () => window.clearTimeout(id);
	}, [isOpen]);

	// слушатель клавиши Esc для закрытия
	useEffect(() => {
		if (!isOpen) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") handleClose();
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	});

	// обработка добавления цели
	const handleAdd = () => {
		const res = normalizeGoalTitle(title); // нормализация/валидация
		if (!res.ok) {
			setError(res.error); // показываем ошибку
			return;
		}

		onSubmit(res.title); // вызываем колбэк с готовым заголовком
		setTitle(""); // сброс полей
		setError("");
		onClose(); // закрываем модалку
	};

	// общее закрытие (сброс состояний)
	const handleClose = () => {
		setTitle("");
		setError("");
		onClose();
	};

	// класс для анимации открытия/закрытия
	const modalClassName = [
		"add-goal-modal",
		isOpen ? "add-goal-modal--open" : "add-goal-modal--closed",
	].join(" ");

	return (
		<article
			style={{ zIndex: 9999 }}
			className={modalClassName}
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			aria-hidden={!isOpen}
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
								if (error) setError(""); // убираем ошибку при вводе
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleAdd(); // Enter — добавление
								if (e.key === "Escape") handleClose(); // Esc — закрытие
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

export default AddGoalModal;
