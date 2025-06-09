import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  loadPedalModel, 
  createPedalBoardLayout, 
  createBasicLighting, 
  createCamera,
  getPedalModelPaths 
} from '../utils/three-helpers';

interface PedalBoard3DProps {
  width?: number;
  height?: number;
  enableControls?: boolean;
}

export default function PedalBoard3D({ 
  width = 800, 
  height = 600, 
  enableControls = true 
}: PedalBoard3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Create camera
    const camera = createCamera(width / height);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Add lighting
    const lights = createBasicLighting();
    lights.forEach(light => scene.add(light));

    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -50;
    ground.receiveShadow = true;
    scene.add(ground);

    // Mount the renderer
    mountRef.current.appendChild(renderer.domElement);

    // Load and display pedals
    loadPedalsAsync();

    // Controls setup (if enabled)
    let controls: any;
    if (enableControls) {
      import('three/examples/jsm/controls/OrbitControls').then(({ OrbitControls }) => {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 50;
        controls.maxDistance = 500;
        controls.maxPolarAngle = Math.PI / 2;
      });
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (controls) {
        controls.update();
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (controls) {
        controls.dispose();
      }
    };
  }, [width, height, enableControls]);

  const loadPedalsAsync = async () => {
    if (!sceneRef.current) return;

    try {
      const modelPaths = getPedalModelPaths();
      const loadPromises = modelPaths.map(path => loadPedalModel(path));
      const pedalGroups = await Promise.all(loadPromises);
      
      // Create pedalboard layout
      const pedalBoard = createPedalBoardLayout(pedalGroups, 180);
      
      // Enable shadows for all pedal meshes
      pedalBoard.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
      
      sceneRef.current.add(pedalBoard);
      
      console.log(`✅ Loaded ${pedalGroups.length} pedals into 3D scene`);
    } catch (error) {
      console.error('Error loading pedals:', error);
      
      // Fallback: create simple colored cubes
      createFallbackPedals();
    }
  };

  const createFallbackPedals = () => {
    if (!sceneRef.current) return;

    const colors = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#ea580c'];
    const fallbackPedals: THREE.Group[] = [];

    for (let i = 0; i < 5; i++) {
      const group = new THREE.Group();
      const geometry = new THREE.BoxGeometry(120, 35, 66);
      const material = new THREE.MeshStandardMaterial({ 
        color: colors[i % colors.length] 
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      group.name = `Fallback Pedal ${i + 1}`;
      fallbackPedals.push(group);
    }

    const pedalBoard = createPedalBoardLayout(fallbackPedals, 150);
    sceneRef.current.add(pedalBoard);
    
    console.log('✅ Created fallback pedal display');
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return;
      
      const newWidth = mountRef.current?.clientWidth || width;
      const newHeight = mountRef.current?.clientHeight || height;
      
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  return (
    <div className="w-full h-full">
      <div 
        ref={mountRef} 
        className="w-full h-full border border-gray-300 rounded-lg overflow-hidden"
        style={{ width, height }}
      />
      <div className="mt-4 text-sm text-gray-600 text-center">
        {enableControls && (
          <p>🖱️ Click and drag to rotate • Scroll to zoom • Right-click drag to pan</p>
        )}
      </div>
    </div>
  );
} 