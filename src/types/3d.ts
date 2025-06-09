export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Dimensions3D {
  width: number;  // mm
  height: number; // mm
  depth: number;  // mm
}

export interface Material3D {
  type: 'basic' | 'standard' | 'physical';
  color: string;
  roughness?: number;
  metalness?: number;
  opacity?: number;
}

export interface Component3D {
  name: string;
  type: 'box' | 'cylinder' | 'plane';
  dimensions: Dimensions3D;
  position: Vector3D;
  rotation: Vector3D;
  material: Material3D;
}

export interface PedalModel3D {
  name: string;
  slug: string;
  type: 'box' | 'cylinder' | 'compound';
  dimensions: Dimensions3D;
  position: Vector3D;
  rotation: Vector3D;
  material: Material3D;
  components: Component3D[];
}

export interface PedalSpec {
  name: string;
  manufacturer: string;
  slug: string;
  dimensions: string; // e.g., "4.77\" x 2.6\" x 1.39\""
  weight: string;
  controls: string[];
  type: string;
} 