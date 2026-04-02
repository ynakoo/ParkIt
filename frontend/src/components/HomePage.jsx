import { useNavigate } from 'react-router-dom';
import './home.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="home-nav glass-panel-nav">
        <div className="logo cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-gradient">ParkIt</span>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/login')} className="nav-btn">Login</button>
          <button onClick={() => navigate('/register')} className="nav-btn-primary shadow-hover">Sign Up</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="badge">The Future of Parking</div>
          <h1>Your Personal <br/><span className="text-gradient">Digital Valet</span></h1>
          <p>Experience hassle-free parking. Arrive at a location, let our professional drivers take the wheel, and request your car back with a single tap.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/register')} className="cta-btn shadow-hover">Get Started Now</button>
            <button onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="cta-secondary">See How It Works</button>
          </div>
        </div>
        <div className="hero-image-wrapper">
          {/* Using a glass panel to frame the image nicely */}
          <div className="glass-panel image-glass">
             <img src="/parkit_img2.png" alt="ParkIt Valet Service" className="hero-img" onError={(e) => e.target.style.display = 'none'} />
             <div className="floating-badge badge-1">Fully Insured</div>
             <div className="floating-badge badge-2">5-min Retrieval</div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="lifecycle-section">
        <h2>How <span className="text-gradient">ParkIt</span> Works</h2>
        <p className="subtitle">Five simple steps to a stress-free parking experience.</p>
        
        <div className="timeline-container glass-panel">
          <div className="timeline-step">
            <div className="step-circle hover-grow">1</div>
            <h3>Select Location</h3>
            <p>Open the app and choose your parking area upon arrival.</p>
          </div>
          
          <div className="timeline-line"></div>
          
          <div className="timeline-step">
            <div className="step-circle hover-grow">2</div>
            <h3>Select Vehicle</h3>
            <p>Choose which of your registered cars you're parking today.</p>
          </div>
          
          <div className="timeline-line"></div>
          
          <div className="timeline-step">
            <div className="step-circle hover-grow">3</div>
            <h3>Leave in Pickup</h3>
            <p>Leave your car and keys at the pickup area. You're free to go immediately!</p>
          </div>
          
          <div className="timeline-line"></div>
          
          <div className="timeline-step">
            <div className="step-circle hover-grow">4</div>
            <h3>We Park It</h3>
            <p>Your car is safely driven to our secure parking facility.</p>
          </div>

          <div className="timeline-line"></div>
          
          <div className="timeline-step">
            <div className="step-circle hover-grow">5</div>
            <h3>One-Tap Retrieval</h3>
            <p>Request your car from your phone when you're ready to leave.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer glass-panel">
        <p>&copy; {new Date().getFullYear()} ParkIt. All rights reserved. Your premier digital valet.</p>
      </footer>
    </div>
  );
}

export default HomePage;
