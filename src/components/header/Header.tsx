import { useCallback } from "react";
import "./Header.css";
import Liquid from "./liquid-effect/Liquid";

const Header = () => {
	const handleLogoClick = useCallback(() => {
		if (window.location.pathname === "/") {
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}
		window.location.assign("/");
	}, []);

	return (
		<header className="header">
			<div
				className="header-liquid-fill"
				onClick={handleLogoClick}
				aria-label="На главную"
			>
				<h1 className="header-logo">FINANCIAN</h1>
			</div>
			<Liquid />
		</header>
	);
};

export default Header;
