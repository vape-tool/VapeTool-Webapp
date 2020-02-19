import React, { Suspense } from 'react';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MeshStandardMaterial } from 'three';
import sampleCoil from '@/assets/sampleCoil.obj';

function Coil() {
  const material = new MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x444444,
    roughness: 0.5,
    metalness: 1.0,
    refractionRatio: 1.0,
    envMapIntensity: 1.0,
  });
  const coilObj = useLoader(OBJLoader, sampleCoil);
  coilObj.scale.set(15.0, 15.0, 15.0);
  // loadedMesh is a group of meshes. For
  // each mesh set the material, and compute the information
  // three.js needs for rendering.
  coilObj.children.forEach(child => {
    child.material = material;
    child.geometry.computeFaceNormals();
    child.geometry.computeVertexNormals();
  });

  useFrame(() => {
    coilObj.rotation.x += 0.01;
    coilObj.rotation.y += 0.01;
  });

  return <primitive object={coilObj} dispose={null}/>;
}

function CoilVisualizer() {
  return (
    <Canvas>
      <ambientLight/>
      <pointLight position={[50, 50, 50]}/>
      <Suspense fallback={null}>
        <Coil/>
      </Suspense>
    </Canvas>
  );
}

export default CoilVisualizer;
