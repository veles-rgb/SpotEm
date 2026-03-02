export default function About() {
  return (
    <main
      className="page-main"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="glass-effect" style={{ padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', fontWeight: '900' }}>About</h1>
        <p style={{ marginBottom: '2rem' }}>
          This project was created as part of{' '}
          <a
            style={{ textDecoration: 'underline' }}
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.theodinproject.com/lessons/nodejs-where-s-waldo-a-photo-tagging-app"
          >
            The Odin Project.
          </a>
        </p>
        <p style={{ textAlign: 'center' }}>
          Created by{' '}
          <a
            style={{ textDecoration: 'underline' }}
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/veles-rgb/SpotEm/tree/main"
          >
            veles-rgb
          </a>
        </p>
      </div>
    </main>
  );
}
