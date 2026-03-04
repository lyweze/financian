import "./Background.css";

const BgPath = "public/assets/bg/bg-2.jpg";

function Background() {
	return <img src={BgPath} alt="Background-image" className="background" />;
}
export default Background;
