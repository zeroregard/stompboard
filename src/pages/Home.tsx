import { useState, useEffect, Suspense } from 'react';
import { Pedal } from '../types';
import { loadPedals } from '../utils';
import PedalCard from '../components/PedalCard';

export default function Home() {
  const [pedals, setPedals] = useState<Pedal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedals = async () => {
      try {
        const loadedPedals = await loadPedals();
        setPedals(loadedPedals);
      } catch (error) {
        console.error('Failed to load pedals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedals();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your pedals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Stompboard</h1>
        <p className="text-gray-600">
          {pedals.length === 0 
            ? "No pedals found. Start by adding your first pedal!" 
            : `Manage your collection of ${pedals.length} guitar pedals`
          }
        </p>
      </div>

      {pedals.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm12-3c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zM9 10l12-3"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No pedals</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first guitar pedal to your collection.
            </p>
            <div className="mt-6">
              <div className="rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  <strong>To add a pedal:</strong> Run <code className="bg-white px-2 py-1 rounded">npm run add-pedal</code> in your terminal
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Suspense fallback={<div>Loading pedals...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pedals.map((pedal) => (
              <PedalCard key={pedal.slug} pedal={pedal} />
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
} 