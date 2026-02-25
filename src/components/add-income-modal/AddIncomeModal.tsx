import "./AddIncomeModal.css";

function AddIncomeModal() {
	return (
		<article
			style={{ opacity: 0, zIndex: -100, transition: "opacity 0.3s ease" }}
			className="add-income-article"
			role="dialog"
			aria-modal="true"
			aria-labelledby="add-income-article-title"
		>
			<h2 id="add-income-article-title">Доходы</h2>
			<div className="add-income-main-div">
				<div className="add-income-article-div">
					<h3>Добавить доход</h3>
					<ul>
						<li>
							<h3>Сумма</h3>
							<input
								type="text"
								inputMode="numeric"
								name="income-amount"
								id="income-amount"
								className="article-income-amount-input"
								aria-label="Сумма"
							/>
						</li>
						<li>
							<h3>Дата</h3>
							<input
								type="text"
								className="article-income-date-input-valid"
								name="income-date"
								id="income-date"
								placeholder="ДД.ММ"
								inputMode="numeric"
								maxLength={5}
								pattern="[0-9]*"
							/>
							<small className="article-income-date-error">
								Введите корректную дату в формате ДД.ММ (например 05.11)
							</small>
						</li>
					</ul>
					<div>
						<button type="button" className="article-income-add-button">
							Добавить
						</button>
						<button type="button" className="article-income-close-button">
							Закрыть
						</button>
					</div>
				</div>

				<h3>История</h3>
				<ul className="overview-income-history-ul">
					<li>
						<p>
							дата <span>Сумма ₽</span>
						</p>
					</li>
				</ul>
			</div>
		</article>
	);
}

export default AddIncomeModal;
