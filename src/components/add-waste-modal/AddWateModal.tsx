import "./AddWasteModal.css";

function AddWasteModal() {
	return (
		<article
			style={{ opacity: 0, zIndex: -100, transition: "opacity 0.3s ease" }}
			className="add-article"
			role="dialog"
			aria-modal="true"
			aria-labelledby="add-article-title"
		>
			<h2 id="add-article-title">Добавить</h2>
			<div className="add-article-div">
				<ul>
					<li>
						<h3>Категория</h3>
						<select
							className="article-category-input"
							name="article-category-input"
							id="article-category-input"
							aria-label="Категория"
						>
							<option value="unselected">Выберите категорию</option>
							<option value="food">Еда</option>
							<option value="clothing">Одежда</option>
							<option value="transport">Транспорт</option>
							<option value="online">Онлайн</option>
							<option value="other">Разное</option>
						</select>
					</li>
					<li>
						<h3>Сумма</h3>
						<input
							type="text"
							inputMode="numeric"
							name="amount"
							id="amount"
							className="article-amount-input"
							aria-label="Сумма"
						/>
					</li>
					<li>
						<h3>Дата</h3>
						<input
							type="text"
							className="article-date-input-valid"
							name="article-date-input"
							id="article-date-input"
							placeholder="ДД.ММ"
							inputMode="numeric"
							maxLength={5}
						/>
						<small className="article-date-error">
							Введите корректную дату в формате ДД.ММ (например 05.11)
						</small>
					</li>
				</ul>
				<div>
					<button type="button" className="article-add-button">
						Добавить
					</button>
					<button type="button" className="article-close-button">
						Закрыть
					</button>
				</div>
			</div>
		</article>
	);
}

export default AddWasteModal;
