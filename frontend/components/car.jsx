import * as THREE from 'three';
import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { Stats, OrbitControls, Environment } from '@react-three/drei';

const CarModel = () => {

    return (
        <primitive 
            object={useGLTF("/car-model.glb").scene}
            scale={0.25}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
        />
    );

};

const CarScene = () => {

    return (
        <Canvas camera={{ position: [0, 0.35, 1], fov: 50, near: 0.1, far: 1000 }}>
            <ambientLight intensity={10}/>
            <directionalLight position={[2, 2, 2]} intensity={1}/>
            <Environment preset="city" background={false}/>
            <Suspense>
                <CarModel/>
            </Suspense>
            <OrbitControls autoRotate/>
            <Stats/>
        </Canvas>
    )

};

export default CarScene;