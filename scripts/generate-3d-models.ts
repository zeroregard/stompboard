import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PedalModel3D, PedalSpec, Dimensions3D, Vector3D, Material3D, Component3D } from '../src/types/3d.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Convert inches to millimeters
function inchesToMm(inches: number): number {
  return inches * 25.4;
}

// Parse dimension string like "4.77\" x 2.6\" x 1.39\"" to Dimensions3D
function parseDimensions(dimStr: string): Dimensions3D {
  const matches = dimStr.match(/(\d+\.?\d*)/g);
  if (!matches || matches.length < 3) {
    throw new Error(`Invalid dimension format: ${dimStr}`);
  }
  
  return {
    width: inchesToMm(parseFloat(matches[0])),  // Length
    depth: inchesToMm(parseFloat(matches[1])),  // Width  
    height: inchesToMm(parseFloat(matches[2]))  // Height
  };
}

// Get pedal color based on manufacturer
function getPedalColor(manufacturer: string, type: string): string {
  const colorMap: Record<string, string> = {
    'Boss': '#2563eb', // Blue
    'Walrus Audio': '#059669', // Green
    'Zoom': '#dc2626' // Red
  };
  return colorMap[manufacturer] || '#6b7280'; // Default gray
}

// Generate knob positions based on control count
function generateKnobPositions(controlCount: number, pedalWidth: number, pedalDepth: number): Vector3D[] {
  const positions: Vector3D[] = [];
  const knobY = 8; // Height above pedal surface
  const marginX = 15; // Margin from edges
  const marginZ = 10;
  
  if (controlCount <= 3) {
    // Single row
    const spacing = (pedalWidth - 2 * marginX) / Math.max(1, controlCount - 1);
    for (let i = 0; i < controlCount; i++) {
      positions.push({
        x: -pedalWidth/2 + marginX + (i * spacing),
        y: knobY,
        z: pedalDepth/2 - marginZ - 15
      });
    }
  } else {
    // Two rows
    const knobsPerRow = Math.ceil(controlCount / 2);
    const spacing = (pedalWidth - 2 * marginX) / Math.max(1, knobsPerRow - 1);
    
    for (let i = 0; i < controlCount; i++) {
      const row = Math.floor(i / knobsPerRow);
      const col = i % knobsPerRow;
      positions.push({
        x: -pedalWidth/2 + marginX + (col * spacing),
        y: knobY,
        z: pedalDepth/2 - marginZ - (row * 20) - 15
      });
    }
  }
  
  return positions;
}

// Generate 3D model from pedal spec
function generatePedalModel(pedalSpec: PedalSpec): PedalModel3D {
  const dimensions = parseDimensions(pedalSpec.dimensions);
  const pedalColor = getPedalColor(pedalSpec.manufacturer, pedalSpec.type);
  
  const components: Component3D[] = [];
  
  // Main body
  const mainMaterial: Material3D = {
    type: 'standard',
    color: pedalColor,
    roughness: 0.8,
    metalness: 0.1
  };
  
  // Generate knobs
  const knobPositions = generateKnobPositions(pedalSpec.controls.length, dimensions.width, dimensions.depth);
  knobPositions.forEach((pos, i) => {
    components.push({
      name: `knob-${i}`,
      type: 'cylinder',
      dimensions: { width: 8, height: 6, depth: 8 },
      position: pos,
      rotation: { x: 0, y: 0, z: 0 },
      material: {
        type: 'standard',
        color: '#1f2937', // Dark gray
        roughness: 0.3,
        metalness: 0.7
      }
    });
  });
  
  // Footswitch
  components.push({
    name: 'footswitch',
    type: 'cylinder',
    dimensions: { width: 12, height: 4, depth: 12 },
    position: { x: 0, y: 4, z: -dimensions.depth/2 + 20 },
    rotation: { x: 0, y: 0, z: 0 },
    material: {
      type: 'standard',
      color: '#374151', // Gray
      roughness: 0.2,
      metalness: 0.8
    }
  });
  
  // Input jack
  components.push({
    name: 'input-jack',
    type: 'cylinder',
    dimensions: { width: 6.35, height: 10, depth: 6.35 },
    position: { x: -dimensions.width/2 + 5, y: dimensions.height/2, z: 0 },
    rotation: { x: 0, y: 0, z: Math.PI/2 },
    material: {
      type: 'standard',
      color: '#000000', // Black
      roughness: 0.1,
      metalness: 0.9
    }
  });
  
  // Output jack
  components.push({
    name: 'output-jack',
    type: 'cylinder',
    dimensions: { width: 6.35, height: 10, depth: 6.35 },
    position: { x: dimensions.width/2 - 5, y: dimensions.height/2, z: 0 },
    rotation: { x: 0, y: 0, z: Math.PI/2 },
    material: {
      type: 'standard',
      color: '#000000', // Black
      roughness: 0.1,
      metalness: 0.9
    }
  });
  
  // LED indicator
  components.push({
    name: 'led',
    type: 'cylinder',
    dimensions: { width: 2, height: 2, depth: 2 },
    position: { x: 0, y: dimensions.height + 1, z: dimensions.depth/2 - 10 },
    rotation: { x: 0, y: 0, z: 0 },
    material: {
      type: 'basic',
      color: '#ef4444', // Red
      opacity: 0.8
    }
  });

  return {
    name: pedalSpec.name,
    slug: pedalSpec.slug,
    type: 'compound',
    dimensions,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    material: mainMaterial,
    components
  };
}

// Main function to process all pedals
async function generateAll3DModels() {
  const pedalsDir = join(__dirname, '../pedals');
  const outputDir = join(__dirname, '../src/models/pedals');
  
  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  const pedalFiles = readdirSync(pedalsDir).filter(file => file.endsWith('.json'));
  
  for (const file of pedalFiles) {
    try {
      const pedalPath = join(pedalsDir, file);
      const pedalData = JSON.parse(readFileSync(pedalPath, 'utf8'));
      
      const pedalSpec: PedalSpec = {
        name: pedalData.name,
        manufacturer: pedalData.manufacturer,
        slug: pedalData.slug,
        dimensions: pedalData.dimensions,
        weight: pedalData.weight,
        controls: pedalData.controls,
        type: pedalData.type
      };
      
      const model3D = generatePedalModel(pedalSpec);
      
      const outputPath = join(outputDir, `${pedalSpec.slug}.json`);
      writeFileSync(outputPath, JSON.stringify(model3D, null, 2));
      
      console.log(`✅ Generated 3D model for ${pedalSpec.name}`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }
  
  console.log(`\n🎉 Generated 3D models for ${pedalFiles.length} pedals!`);
}

// Run the script
generateAll3DModels().catch(console.error);

export { generatePedalModel, generateAll3DModels }; 