import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Timer from '../components/Timer';

export default function Play() {
  const { level } = useParams();
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [target, setTarget] = useState(null);
  const [foundSpots, setFoundSpots] = useState([]);
  const [finalTime, setFinalTime] = useState(null);

  // Temporary targets for testing
  const [spotObjs] = useState([
    { name: 'Target 1', x: 63.45, y: 21.95, widthPct: 5, heightPct: 5 },
    { name: 'Target 2', x: 72.75, y: 24.68, widthPct: 5, heightPct: 5 },
    { name: 'Target 3', x: 78.17, y: 24.36, widthPct: 5, heightPct: 5 },
  ]);

  function startGame() {
    setGameStarted(true);
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

      if (newFound.length === spotObjs.length) {
        setIsGameOver(true);
      }
    } else {
      setTarget(null);
    }
  }

  const formatFinalTime = (s) => {
    if (!s) return '0:00';
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <button
          onClick={startGame}
          style={{ padding: '20px 40px', fontSize: '2rem', cursor: 'pointer' }}
        >
          PLAY
        </button>
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
      <Timer isActive={gameStarted && !isGameOver} setTime={setFinalTime} />

      {isGameOver && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '40px',
            zIndex: 1000,
            border: '5px solid green',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          }}
        >
          <h1>LEVEL COMPLETE!</h1>
          <p style={{ fontSize: '1.5rem' }}>
            Time: {formatFinalTime(finalTime)}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Play Again
          </button>
        </div>
      )}

      <div
        style={{
          display: 'inline-block',
          position: 'relative',
          marginTop: '20px',
          cursor: 'crosshair',
        }}
      >
        <img
          onClick={onImageClick}
          src={`/level/${level}/map${level}.png`}
          alt="Game Map"
          style={{ display: 'block', maxWidth: '100%', userSelect: 'none' }}
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
              {spotObjs
                .filter(
                  (obj) => !foundSpots.some((spot) => spot.name === obj.name),
                )
                .map((obj) => (
                  <button
                    key={obj.name}
                    onClick={() => onButtonClick(obj)}
                    style={{ padding: '5px 15px', cursor: 'pointer' }}
                  >
                    {obj.name}
                  </button>
                ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
