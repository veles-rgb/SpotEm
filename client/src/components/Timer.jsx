import { useEffect, useState } from 'react';

export default function Timer({ isActive, setTime }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive && seconds > 0) {
      setTime(seconds);
    }
  }, [isActive, seconds, setTime]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px' }}>
      {formatTime(seconds)}
    </div>
  );
}
