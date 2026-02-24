import './layout.css';

function Layout({ children, onBack, onDashboard, onLogout, showBack, title }) {
    return (
      <div className="layout">
        <header className="header">
          {showBack && <button onClick={onBack}>← Back</button>}
          <button onClick={onDashboard}>Home</button>
          <strong>{title}</strong>
          <button onClick={onLogout}>Logout</button>
        </header>
        <main>{children}</main>
      </div>
    );
  }
  
export default Layout;