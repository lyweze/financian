import React from "react";
import "./Navigation.css";

type NavItem = {
	label: string;
	isActive?: boolean;
};

const navItems: NavItem[] = [
	{ label: "Главная", isActive: true },
	{ label: "Настройки" },
];

const Navigation: React.FC = () => (
	<nav className="nav" aria-label="Основная навигация">
		<ul className="nav-ul">
			{navItems.map(({ label, isActive }) => (
				<li
					key={label}
					className={`nav-ul-li${isActive ? " nav-ul-li-active" : ""}`}
				>
					<button type="button">
						<span>{label}</span>
					</button>
				</li>
			))}
		</ul>
	</nav>
);

export default Navigation;
