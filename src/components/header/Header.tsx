import { memo } from "react";
import "./Header.css";
import Liquid from "./liquid-effect/Liquid";

// Компонент заголовка приложения
const Header: React.FC = () => (
	<header className="header">
		{/* Блок с заливкой и названием приложения */}
		<div className="header-liquid-fill">
			<h1 className="header-logo">FINANCIAN</h1>
		</div>
		{/* Анимация жидкого эффекта */}
		<Liquid />
	</header>
);

export default memo(Header);
