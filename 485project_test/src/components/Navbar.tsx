function Navbar() {
    return (
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1px', borderBottom: '1px solid black' }}>

          <h2 className="nav-bar-studio-text">S T U D I O</h2>

        <button className="login-signup-button">Login or Sign Up</button>
      </nav>
    );
  }
  
  export default Navbar;
  