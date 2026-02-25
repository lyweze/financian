import Header from "./components/header/Header";
import Navigation from "./components/navigation/Navigation";
import MainPage from "./components/main/MainPage";
import "./App.css";

const App = () => (
	<div className="app">
		<Header />
		<Navigation />
		<MainPage />
	</div>
);

export default App;
