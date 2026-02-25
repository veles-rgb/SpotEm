import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Play() {
  const { levelId } = useParams();
  const [level, setLevel] = useState(null);
  const targets = level?.targets ?? [];
  const [target, setTarget] = useState(null);
  const [foundSpots, setFoundSpots] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loadingLevel, setLoadingLevel] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  // User leaderboard stuff
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState('');
  const [name, setName] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState('');
  // Server timer stuff
  const [runId, setRunId] = useState(null);
  const [timeStartedAt, setTimeStartedAt] = useState(null);
  const [serverTimeMs, setServerTimeMs] = useState(null);
  const [serverTimeError, setServerTimeError] = useState('');
  const [now, setNow] = useState(Date.now());

  const elapsedMs = timeStartedAt ? Math.max(0, now - timeStartedAt) : 0;
  const isRunning = gameStarted && !isGameOver;

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!timeStartedAt || !isRunning) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 250); // updates 4 times per second

    return () => clearInterval(interval);
  }, [timeStartedAt, isRunning]);

  useEffect(() => {
    async function fetchLevel() {
      try {
        setLoadingLevel(true);

        const res = await fetch(`${apiUrl}/level/${levelId}`);

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.message || `Failed to load level (${res.status})`,
          );
        }

        const data = await res.json();
        setLevel(data);
      } catch (err) {
        setErrors((prev) => [...prev, err.message || 'Something went wrong']);
      } finally {
        setLoadingLevel(false);
      }
    }

    if (levelId) fetchLevel();
  }, [apiUrl, levelId]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoadingLeaderboard(true);

        const res = await fetch(`${apiUrl}/leaderboard/${levelId}`);

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.message || `Failed to load leaderboard (${res.status})`,
          );
        }

        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        setLeaderboardError(err.message || 'Something went wrong');
      } finally {
        setLoadingLeaderboard(false);
      }
    }

    if (levelId) fetchLeaderboard();
  }, [apiUrl, levelId]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setPostError('Name is required.');
      return;
    }

    try {
      setIsPosting(true);

      const res = await fetch(`${apiUrl}/leaderboard/${levelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          serverTimeMs,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Failed to post (${res.status})`);
      }

      setPostError('');
      setIsPosting(false);
      window.location.reload();
    } catch (err) {
      setPostError(err.message || 'Something went wrong');
    } finally {
      setIsPosting(false);
    }
  }

  async function handleTimeStart() {
    try {
      setServerTimeError('');

      if (!levelId) {
        throw new Error('Missing levelId');
      }

      const res = await fetch(`${apiUrl}/run/start/${levelId}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Failed to start timer ${res.status}`);
      }

      const data = await res.json();

      setTimeStartedAt(Number(data.startedAt));
      setRunId(data.runId);
    } catch (err) {
      setServerTimeError(err.message || 'ERROR');
    }
  }

  async function handleTimeStop() {
    try {
      setServerTimeError('');

      if (!levelId) {
        throw new Error('Missing levelId');
      }

      if (!runId) {
        throw new Error('Missing runId');
      }

      const res = await fetch(`${apiUrl}/run/finish/${runId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ levelId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Failed to stop timer ${res.status}`);
      }

      const data = await res.json();

      setServerTimeMs(data.timeMs);
    } catch (err) {
      setServerTimeError(err.message || 'ERROR');
    }
  }

  function startGame() {
    setGameStarted(true);
    handleTimeStart();
  }

  function checkIfCorrect(clickTarget, obj) {
    if (!clickTarget) return false;
    const halfW = obj.widthPct / 2;
    const halfH = obj.heightPct / 2;

    return (
      clickTarget.x >= obj.x - halfW &&
      clickTarget.x <= obj.x + halfW &&
      clickTarget.y >= obj.y - halfH &&
      clickTarget.y <= obj.y + halfH
    );
  }

  function onImageClick(e) {
    if (isGameOver) return;
    const rect = e.target.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    setTarget({ x: xPct, y: yPct });
  }

  function onButtonClick(obj) {
    if (checkIfCorrect(target, obj)) {
      const newFound = [...foundSpots, { ...obj }];
      setFoundSpots(newFound);
      setTarget(null);

      if (newFound.length === targets.length) {
        setIsGameOver(true);
        handleTimeStop();
      }
    } else {
      setTarget(null);
    }
  }

  const formatFinalTime = (ms) => {
    if (!ms) return '0:00';

    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <button
          onClick={startGame}
          style={{
            padding: '20px 40px',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          PLAY
        </button>
        {loadingLeaderboard ? (
          <LoadingOverlay message="Fetching leaderboard..." fullscreen />
        ) : (
          <div>
            <h2 style={{ textAlign: 'center' }}>
              {level?.name ?? 'Level'} Leaderboard
            </h2>
            {leaderboardError && <p>{leaderboardError}</p>}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 80px',
                alignItems: 'center',
              }}
            >
              <div style={{ textAlign: 'left' }}>Rank</div>
              <div style={{ textAlign: 'center' }}>Name</div>
              <div style={{ textAlign: 'right' }}>Time</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {leaderboard.map((l, index) => {
                return (
                  <div
                    key={l.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 80px',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>{index + 1}</div>
                    <div style={{ textAlign: 'center' }}>{l.playerName}</div>
                    <div style={{ textAlign: 'right' }}>
                      {(() => {
                        const totalSeconds = Math.floor(l.timeMs / 1000);
                        const mins = Math.floor(totalSeconds / 60);
                        const secs = totalSeconds % 60;
                        return `${mins}:${secs.toString().padStart(2, '0')}`;
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {loadingLevel && (
        <LoadingOverlay message="Fetching level..." fullscreen />
      )}

      {serverTimeError ? (
        <div>{serverTimeError}</div>
      ) : (
        <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px' }}>
          {formatFinalTime(elapsedMs)}
        </div>
      )}

      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      )}

      {isGameOver && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '40px',
            zIndex: 1000,
            border: '5px solid green',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          }}
        >
          <h1>LEVEL COMPLETE!</h1>
          <p style={{ fontSize: '1.5rem' }}>
            Time: {formatFinalTime(serverTimeMs)}
          </p>
          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={3}
                maxLength={25}
                required
              />
            </label>
            <button type="submit" disabled={isPosting}>
              {isPosting ? 'Submitting...' : 'Submit'}
            </button>
            {postError && <p>{postError}</p>}
          </form>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* IMAGE + TARGETS SIDE PANEL */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '20px',
          width: '100%',
          marginTop: '20px',
        }}
      >
        {/* CENTER IMAGE */}
        <div
          style={{
            display: 'inline-block',
            position: 'relative',
            cursor: 'crosshair',
          }}
        >
          <img
            onClick={onImageClick}
            src={level?.imagePath}
            alt="Game Map"
            style={{
              display: 'block',
              maxHeight: '80vh',
              maxWidth: '80vw',
              objectFit: 'contain',
              userSelect: 'none',
            }}
            draggable="false"
          />

          {/* Successful Marks */}
          {foundSpots.map((spot, index) => (
            <div
              key={index}
              style={{
                width: '50px',
                height: '50px',
                position: 'absolute',
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#00ff00',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '2px solid #00ff00',
                pointerEvents: 'none',
                textAlign: 'center',
                lineHeight: '50px',
              }}
            >
              ✓
            </div>
          ))}

          {/* Interaction UI */}
          {target && !isGameOver && (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  width: '50px',
                  height: '50px',
                  border: '3px solid red',
                  backgroundColor: 'rgba(255, 0, 0, 0.25)',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'absolute',
                  left: `${target.x + 2}%`,
                  top: `${target.y}%`,
                  backgroundColor: 'white',
                  border: '1px solid grey',
                  zIndex: 10,
                }}
              >
                {targets
                  .filter(
                    (obj) => !foundSpots.some((spot) => spot.name === obj.name),
                  )
                  .map((obj) => (
                    <img
                      key={obj.name}
                      onClick={() => onButtonClick(obj)}
                      style={{ padding: '5px 15px', cursor: 'pointer' }}
                      src={obj.imagePath}
                      alt={obj.name}
                    />
                  ))}
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE TARGET PREVIEWS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {targets.map((t) => {
            const isFound = foundSpots.some((s) => s.name === t.name);
            return (
              <img
                key={t.name}
                src={t.imagePath}
                alt={t.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                  opacity: isFound ? 0.4 : 1,
                }}
                draggable="false"
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
