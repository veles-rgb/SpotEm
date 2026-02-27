import { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Leaderboards() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchLeaderboards() {
      try {
        setIsLoading(true);

        const res = await fetch(`${apiUrl}/leaderboard`);

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.message || `Something went wrong: ${res.status}`,
          );
        }

        const data = await res.json();

        setLeaderboards(data.leaderboards);
      } catch (err) {
        setIsError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboards();
  }, [apiUrl]);

  const formatMs = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading)
    return <LoadingOverlay message="Loading leaderboards..." fullscreen />;

  if (!isLoading && isError)
    return (
      <main>
        <h2>{isError}</h2>
        <p>There was an error loading the leaderboards</p>
      </main>
    );

  return (
    <main className="page-main page-home">
      <div
        style={{
          width: '100%',
          maxWidth: '1024px',
        }}
      >
        <div style={{ paddingBottom: '2rem' }}>
          <h2
            style={{ fontSize: '1.5rem', fontWeight: 600, textAlign: 'center' }}
          >
            Leaderboards
          </h2>
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.875rem',
              opacity: 0.8,
              marginTop: '0.5rem',
            }}
          >
            Top times for each level.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem',
            justifyItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          {leaderboards.map((level) => (
            <div
              key={level.id}
              className="glass-effect"
              style={{
                width: '100%',
                maxWidth: '520px',
                padding: '2rem',
              }}
            >
              <h2
                className="glass-effect"
                style={{
                  textAlign: 'center',
                  fontWeight: 900,
                  padding: '1rem',
                  marginBottom: '0.5rem',
                }}
              >
                {level.name}
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 80px',
                  alignItems: 'center',
                  marginTop: '10px',
                  fontWeight: 600,
                  borderBottom: '1px solid rgba(255,255,255,0.5)',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                }}
              >
                <div style={{ textAlign: 'left', fontWeight: 900 }}>Rank</div>
                <div style={{ textAlign: 'center', fontWeight: 900 }}>Name</div>
                <div style={{ textAlign: 'right', fontWeight: 900 }}>Time</div>
              </div>

              {level.leaderboardEntries.length === 0 ? (
                <p style={{ textAlign: 'center', opacity: 0.85 }}>
                  No scores yet
                </p>
              ) : (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
                >
                  {level.leaderboardEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr 80px',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ textAlign: 'left' }}>{index + 1}</div>
                      <div style={{ textAlign: 'center' }}>
                        {entry.playerName}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {formatMs(entry.timeMs)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
