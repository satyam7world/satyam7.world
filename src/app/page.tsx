"use client";

import {Canvas, useFrame} from "@react-three/fiber";

import {OrbitControls, useGLTF} from "@react-three/drei";
import {Suspense, useRef} from "react";
import {DoubleSide, Mesh,} from "three";

function RotatingCube() {
    const meshRef = useRef<Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color="black"/>
        </mesh>
    );
}

function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[100, 100]}/>
            <meshStandardMaterial color="green" side={DoubleSide}/>
        </mesh>
    );
}

function Model() {
    const {scene} = useGLTF('./Heli_bell.glb');
    return <primitive
        position={[0,0,0]}

        object={scene}/>;
}


export default function Home() {
    return (
        <div style={{width: "100vw", height: "100vh"}}>
            <Canvas camera={{position: [0, 2, 5], fov: 60}}>
                <ambientLight/>
                <pointLight position={[10, 10, 100]}/>
                <Suspense fallback={null}>
                    <Model/>
                </Suspense>
                <Floor/>
                <OrbitControls/>
            </Canvas>
        </div>
    );
}
