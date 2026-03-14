import './home.css';

function HomePage({ onNavigate }) {
  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="logo">ParkIt</div>
        <div className="nav-links">
          <button onClick={() => onNavigate('LOGIN')} className="nav-btn">Login</button>
          <button onClick={() => onNavigate('REGISTER')} className="nav-btn-primary">Sign Up</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Smart Parking Made Simple</h1>
          <p>Experience hassle-free valet parking with real-time tracking and seamless payment</p>
          <button onClick={() => onNavigate('REGISTER')} className="cta-btn">Get Started</button>
        </div>
        <div className="hero-image">
          <img src="/parkit_img2.png" alt="ParkIt Valet Service" />
        </div>
      </section>

      <section className="features">
        <h2>Why Choose ParkIt?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Valet Service</h3>
            <p>Professional drivers park and retrieve your car</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Real-Time Tracking</h3>
            <p>Track your parking request status live</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Easy Payment</h3>
            <p>Transparent pricing with instant payment</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Quick Service</h3>
            <p>Fast response from available drivers</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Select Parking</h3>
            <p>Choose your parking location</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Request Valet</h3>
            <p>A driver accepts your request</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Car Parked</h3>
            <p>Your car is safely parked</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Retrieve Anytime</h3>
            <p>Request retrieval when ready</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; 2024 ParkIt. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
