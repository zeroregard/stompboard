import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Pedal } from '../types';
import { formatPrice, getPedalTypeColor } from '../utils';

export default function PedalDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [pedal, setPedal] = useState<Pedal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPedal = async () => {
      if (!slug) {
        setError('No pedal specified');
        setLoading(false);
        return;
      }

      try {
        // TODO: Load pedal JSON file based on slug
        setError('Pedal loading not yet implemented');
      } catch (err) {
        setError('Failed to load pedal');
      } finally {
        setLoading(false);
      }
    };

    loadPedal();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading pedal...</p>
        </div>
      </div>
    );
  }

  if (error || !pedal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to all pedals
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Pedal not found</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return <div>Pedal detail placeholder</div>;
} 