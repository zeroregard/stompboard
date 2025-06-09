import React from 'react';
import PedalBoard3D from '../components/PedalBoard3D';

export default function PedalBoard3DPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          3D Pedalboard View
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore your guitar pedals in an interactive 3D environment. 
          Each pedal is rendered with realistic proportions and components 
          based on actual specifications.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-center">
          <PedalBoard3D 
            width={900} 
            height={600} 
            enableControls={true} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🎛️ Interactive Controls
          </h3>
          <p className="text-blue-700">
            Click and drag to rotate the view, scroll to zoom in/out, 
            and right-click drag to pan around the pedalboard.
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            📐 Realistic Proportions
          </h3>
          <p className="text-green-700">
            All pedals are rendered with accurate dimensions converted 
            from their real-world specifications in millimeters.
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            🎨 Brand Colors
          </h3>
          <p className="text-purple-700">
            Each manufacturer has distinct colors: Boss (blue), 
            Walrus Audio (green), and Zoom (red) for easy identification.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Technical Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Rendering Engine:</strong> Three.js WebGL
          </div>
          <div>
            <strong>Model Format:</strong> JSON-based component system
          </div>
          <div>
            <strong>Lighting:</strong> Ambient + Directional + Point lights
          </div>
          <div>
            <strong>Shadows:</strong> PCF Soft Shadow mapping enabled
          </div>
          <div>
            <strong>Components:</strong> Main body, knobs, footswitch, jacks, LED
          </div>
          <div>
            <strong>Materials:</strong> PBR Standard materials with roughness/metalness
          </div>
        </div>
      </div>
    </div>
  );
} 