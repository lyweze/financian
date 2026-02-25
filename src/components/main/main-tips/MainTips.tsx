import "./MainTips.css";

// Массив с данными советов: id для ключа, title — заголовок, text — описание
const tips = [
	{
		id: 1,
		title: "Совет 1:",
		text: "Создайте бюджет и придерживайтесь его.",
	},
	{
		id: 2,
		title: "Совет 2:",
		text: "Старайтесь откладывать часть доходов на сбережения.",
	},
];

function MainTips() {
	return (
		// Секция с советами: контейнер и доступный заголовок
		<section
			className="main-container main-tips-container"
			aria-labelledby="tips-title"
		>
			<h3 id="tips-title">Советы по управлению финансами</h3>
			<ul>
				{tips.map(({ id, title, text }) => (
					// Каждый совет выводим в виде элемента списка
					<li key={id}>
						<p>
							<span>{title}</span> {text}
						</p>
					</li>
				))}
			</ul>
		</section>
	);
}

export default MainTips;
