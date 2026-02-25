import "./Navigation.css";

type NavItem = {
	id: string; // Уникальный идентификатор пункта
	label: string; // Текст, отображаемый пользователю
};

type NavigationProps = {
	activeId?: NavItem["id"]; // Текущий активный пункт
	onSelect?: (id: NavItem["id"]) => void; // Колбэк при выборе пункта
};

const NAV_ITEMS: NavItem[] = [
	{ id: "home", label: "Главная" },
	{ id: "settings", label: "Настройки" },
];

function Navigation({ activeId = "home", onSelect }: NavigationProps) {
	return (
		<nav className="nav" aria-label="Основная навигация">
			<ul className="nav-ul">
				{NAV_ITEMS.map((item) => {
					const isActive = item.id === activeId; // Проверяем, активен ли пункт
					return (
						<li
							key={item.id}
							className={`nav-ul-li${isActive ? " nav-ul-li-active" : ""}`} // Добавляем класс для активного пункта
						>
							<button
								type="button"
								aria-current={isActive ? "page" : undefined} // Обозначаем текущую страницу для доступности
								onClick={() => onSelect?.(item.id)} // Вызываем колбэк при клике
							>
								<span>{item.label}</span>
							</button>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

export default Navigation;
