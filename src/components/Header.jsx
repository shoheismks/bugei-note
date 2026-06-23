import heroImage from "../assets/hero.jpg";

function Header() {
  return (
    <header>
      <h1>SHU・HA・RI</h1>
      <p>Learn. Adapt. Transcend.</p>
      <img className="hero-image" src={heroImage} alt="" />
    </header>
  );
}

export default Header;
