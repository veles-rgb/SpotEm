import { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Home() {
  const [levels, setLevels] = useState([]);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingError, setLoadingError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchLevels() {
      try {
        setLoadingLevels(true);
        setLoadingError('');

        const res = await fetch(`${apiUrl}/level`);

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.message || `Something went wrong: ${res.status}`,
          );
        }

        const data = await res.json();
        setLevels(data.levels || []);
      } catch (error) {
        setLoadingError(error?.message || 'Something went wrong');
      } finally {
        setLoadingLevels(false);
      }
    }

    fetchLevels();
  }, [apiUrl]);

  if (loadingLevels) {
    return <LoadingOverlay message="Loading levels..." fullscreen />;
  }

  return (
    <main className="page-main page-home">
      <div className="w-full max-w-5xl">
        <div className="pb-8">
          <h2 className="text-2xl font-semibold text-center">Choose a level</h2>
          <p className="text-center text-sm text-gray-500 mt-2">
            Find all targets as fast as you can.
          </p>
        </div>

        {loadingError && (
          <div className="mt-6 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {loadingError}
          </div>
        )}

        <div className="mt-8 grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))] justify-items-center">
          {levels.map((level) => (
            <a key={level.id} href={`/play/${level.id}`} className="block">
              <div className="border bg-white p-4 hover:shadow-sm transition glass-effect">
                <div className="flex flex-col items-center">
                  <img
                    src={level.imagePath}
                    alt={level.name}
                    draggable="false"
                    className="w-100 max-w-xs object-contain select-none"
                  />
                  <h3
                    style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
                    className="mt-3 text-center text-lg font-medium glass-effect"
                  >
                    {level.name}
                  </h3>
                </div>
              </div>
            </a>
          ))}
        </div>

        {levels.length === 0 && !loadingError && (
          <div className="mt-10 text-center text-gray-500">
            No levels found.
          </div>
        )}
      </div>
    </main>
  );
}
