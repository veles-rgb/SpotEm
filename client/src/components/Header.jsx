import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="glass-effect py-4">
      <nav
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}
      >
        {/* Left: logo aligned left */}
        <div
          style={{
            justifySelf: 'start',
            paddingLeft: '2rem',
            fontWeight: 900,
            fontFamily: 'Bungee',
            fontSize: '2rem',
            userSelect: 'none',
          }}
        >
          SpotEm
        </div>

        {/* Center: nav perfectly centered */}
        <div style={{ justifySelf: 'center' }}>
          <ul className="flex" style={{ gap: '1rem' }}>
            <li className="glass-effect rounded-xl">
              <Link
                draggable="false"
                to="/"
                className="flex items-center justify-center px-4 py-2"
              >
                Home
              </Link>
            </li>
            <li className="glass-effect rounded-xl">
              <Link
                to="/leaderboards"
                draggable="false"
                className="flex items-center justify-center px-4 py-2"
              >
                Leaderboards
              </Link>
            </li>
            <li className="glass-effect rounded-xl">
              <Link
                draggable="false"
                className="flex items-center justify-center px-4 py-2"
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        <div />
      </nav>
    </header>
  );
}
