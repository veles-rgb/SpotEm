import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="py-4">
      <nav>
        <ul className="flex justify-center">
          <li>
            <Link to="/" className="border-2 border-rose-700 px-4 py-2 rounded">
              Home
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
