import { Link } from 'react-router-dom';
import { Pedal } from '../types';
import { getPedalTypeColor } from '../utils';

interface PedalCardProps {
  pedal: Pedal;
}

export default function PedalCard({ pedal }: PedalCardProps) {
  return (
    <Link to={`/${pedal.slug}`} className="block">
      <div className="pedal-card group">
        <div className="relative">
          <img
            src={pedal.imageUrl}
            alt={`${pedal.manufacturer} ${pedal.name}`}
            className="pedal-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          <div className="absolute top-2 right-2">
            <span className={`pedal-type-badge ${getPedalTypeColor(pedal.type)}`}>
              {pedal.type}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {pedal.name}
            </h3>
            <span className="text-sm text-gray-500 font-medium">
              {pedal.manufacturer}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {pedal.description}
          </p>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">
                {pedal.milliAmps}mA
              </span>
              <span className="text-gray-500">
                {pedal.voltage}V
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 