import * as THREE from 'three';
import { PedalModel3D, Component3D, Material3D } from '../types/3d';

// Create a Three.js material from our Material3D interface
export function createMaterial(materialData: Material3D): THREE.Material {
  const params: any = {
    color: materialData.color,
  };

  if (materialData.opacity !== undefined) {
    params.opacity = materialData.opacity;
    params.transparent = materialData.opacity < 1;
  }

  switch (materialData.type) {
    case 'basic':
      return new THREE.MeshBasicMaterial(params);
    
    case 'standard':
      if (materialData.roughness !== undefined) params.roughness = materialData.roughness;
      if (materialData.metalness !== undefined) params.metalness = materialData.metalness;
      return new THREE.MeshStandardMaterial(params);
    
    case 'physical':
      if (materialData.roughness !== undefined) params.roughness = materialData.roughness;
      if (materialData.metalness !== undefined) params.metalness = materialData.metalness;
      return new THREE.MeshPhysicalMaterial(params);
    
    default:
      return new THREE.MeshStandardMaterial(params);
  }
}

// Create a Three.js geometry from component data
export function createGeometry(component: Component3D): THREE.BufferGeometry {
  const { type, dimensions } = component;
  
  switch (type) {
    case 'box':
      return new THREE.BoxGeometry(
        dimensions.width,
        dimensions.height,
        dimensions.depth
      );
    
    case 'cylinder':
      return new THREE.CylinderGeometry(
        dimensions.width / 2,  // radiusTop
        dimensions.width / 2,  // radiusBottom
        dimensions.height,     // height
        16                     // radialSegments
      );
    
    case 'plane':
      return new THREE.PlaneGeometry(
        dimensions.width,
        dimensions.depth
      );
    
    default:
      throw new Error(`Unsupported geometry type: ${type}`);
  }
}

// Create a Three.js mesh from component data
export function createMeshFromComponent(component: Component3D): THREE.Mesh {
  const geometry = createGeometry(component);
  const material = createMaterial(component.material);
  const mesh = new THREE.Mesh(geometry, material);
  
  // Set position
  mesh.position.set(
    component.position.x,
    component.position.y,
    component.position.z
  );
  
  // Set rotation
  mesh.rotation.set(
    component.rotation.x,
    component.rotation.y,
    component.rotation.z
  );
  
  mesh.name = component.name;
  
  return mesh;
}

// Create a complete Three.js group from a PedalModel3D
export function createPedalGroup(modelData: PedalModel3D): THREE.Group {
  const group = new THREE.Group();
  group.name = modelData.name;
  
  // Create main body
  const mainGeometry = new THREE.BoxGeometry(
    modelData.dimensions.width,
    modelData.dimensions.height,
    modelData.dimensions.depth
  );
  const mainMaterial = createMaterial(modelData.material);
  const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
  mainMesh.name = 'main-body';
  group.add(mainMesh);
  
  // Add all components
  modelData.components.forEach(component => {
    const componentMesh = createMeshFromComponent(component);
    group.add(componentMesh);
  });
  
  // Set group position and rotation
  group.position.set(
    modelData.position.x,
    modelData.position.y,
    modelData.position.z
  );
  
  group.rotation.set(
    modelData.rotation.x,
    modelData.rotation.y,
    modelData.rotation.z
  );
  
  return group;
}

// Load a pedal model from JSON file
export async function loadPedalModel(modelPath: string): Promise<THREE.Group> {
  try {
    const response = await fetch(modelPath);
    if (!response.ok) {
      throw new Error(`Failed to load model: ${response.statusText}`);
    }
    
    const modelData: PedalModel3D = await response.json();
    return createPedalGroup(modelData);
  } catch (error) {
    console.error(`Error loading pedal model from ${modelPath}:`, error);
    throw error;
  }
}

// Create a simple pedalboard layout
export function createPedalBoardLayout(pedals: THREE.Group[], spacing: number = 150): THREE.Group {
  const pedalBoard = new THREE.Group();
  pedalBoard.name = 'pedalboard';
  
  // Arrange pedals in a row
  pedals.forEach((pedal, index) => {
    const x = (index - (pedals.length - 1) / 2) * spacing;
    pedal.position.x = x;
    pedal.position.y = 0;
    pedal.position.z = 0;
    pedalBoard.add(pedal);
  });
  
  return pedalBoard;
}

// Create basic lighting setup for the scene
export function createBasicLighting(): THREE.Light[] {
  const lights: THREE.Light[] = [];
  
  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  lights.push(ambientLight);
  
  // Directional light for shadows and definition
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  lights.push(directionalLight);
  
  // Point light for additional detail
  const pointLight = new THREE.PointLight(0xffffff, 0.6, 1000);
  pointLight.position.set(-10, 10, 10);
  lights.push(pointLight);
  
  return lights;
}

// Create camera with good view of pedalboard
export function createCamera(aspect: number): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(0, 100, 200);
  camera.lookAt(0, 0, 0);
  return camera;
}

// Helper to get all pedal model paths
export function getPedalModelPaths(): string[] {
  // In a real application, you'd read this from your pedal data
  // For now, we'll return the known pedal slugs
  const pedalSlugs = [
    'boss-sy-1',
    'walrus-audio-arp-87',
    'walrus-audio-deep-six',
    'walrus-audio-eras',
    'walrus-audio-jupiter-v2',
    'zoom-g1x-four',
    'zoom-ms70cdr'
  ];
  
  return pedalSlugs.map(slug => `/models/pedals/${slug}.json`);
} 