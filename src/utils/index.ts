import { Pedal } from '../types';

export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatPrice(price?: number): string {
  if (!price) return 'Price not available';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export function getPedalTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    fuzz: 'bg-purple-100 text-purple-800',
    distortion: 'bg-red-100 text-red-800',
    overdrive: 'bg-orange-100 text-orange-800',
    reverb: 'bg-blue-100 text-blue-800',
    delay: 'bg-indigo-100 text-indigo-800',
    chorus: 'bg-green-100 text-green-800',
    phaser: 'bg-pink-100 text-pink-800',
    flanger: 'bg-yellow-100 text-yellow-800',
    compressor: 'bg-gray-100 text-gray-800',
    boost: 'bg-emerald-100 text-emerald-800',
    eq: 'bg-teal-100 text-teal-800',
    filter: 'bg-cyan-100 text-cyan-800',
    octave: 'bg-violet-100 text-violet-800',
    tremolo: 'bg-rose-100 text-rose-800',
    looper: 'bg-slate-100 text-slate-800',
    other: 'bg-neutral-100 text-neutral-800'
  };
  
  return colorMap[type.toLowerCase()] || colorMap.other;
}

export async function loadPedals(): Promise<Pedal[]> {
  try {
    const pedals: Pedal[] = [];
    
    // List of all your pedal files
    const pedalFiles = [
      'boss-sy-1.json',
      'walrus-audio-jupiter-v2.json',
      'walrus-audio-deep-six.json',
      'walrus-audio-eras.json',
      'zoom-ms70cdr.json',
      'zoom-g1x-four.json',
      'walrus-audio-arp-87.json'
    ];
    
    // Load each pedal file
    for (const filename of pedalFiles) {
      try {
        const response = await fetch(`/pedals/${filename}`);
        if (response.ok) {
          const pedal = await response.json();
          pedals.push(pedal);
        }
      } catch (error) {
        console.warn(`Failed to load pedal: ${filename}`, error);
      }
    }
    
    return pedals;
  } catch (error) {
    console.error('Error loading pedals:', error);
    return [];
  }
}

export function generatePedalFilename(name: string, manufacturer: string): string {
  const slug = createSlug(`${manufacturer} ${name}`);
  return `${slug}.json`;
} 