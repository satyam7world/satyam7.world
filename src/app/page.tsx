"use client";

import {Canvas, useFrame} from "@react-three/fiber";

import {OrbitControls, useGLTF} from "@react-three/drei";
import {Suspense, useEffect, useRef} from "react";
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
    const {scene} = useGLTF("./Heli_bell.glb");
    const bladeRef = useRef<Mesh | null>(null);

    useEffect(() => {
        // Find the blade object by name or index
        const bladeObject = scene.children.find((child) => {
            console.log('child name ', child.name)
            return child.name === "baling_baling_1"
        });

        if (bladeObject) {
            bladeRef.current = bladeObject as Mesh;
        }
    }, [scene]);

    useFrame(() => {
        if (bladeRef.current) {
            bladeRef.current.rotation.y += 0.1;
        }
    });

    return (
        <primitive object={scene} position={[0, 10, 0]}/>
    );
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
