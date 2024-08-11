"use client";

import {Canvas, useFrame} from "@react-three/fiber";
import {OrbitControls, useGLTF, Html, Sky} from "@react-three/drei";
import {Suspense, useEffect, useRef, useState} from "react";
import {Mesh, Vector3} from "three";

function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]}>
            <planeGeometry args={[1000, 1000]}/>
            <meshStandardMaterial color="green"/>
        </mesh>
    );
}

function Banner({isVisible}) {
    return (
        <Html center style={{display: isVisible ? "block" : "none"}}>
            <div style={{
                textAlign: "center",
                padding: "20px",
                fontSize: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "10px",
                width: "300px",
                position: "absolute",
                bottom: "20px",  // Keep the banner fixed at the bottom
                left: "50%",
                transform: "translateX(-50%)"
            }}>
                <h1>Welcome to Satyam7.world</h1>
                <a href="https://github.com/satyam7world" target="_blank" rel="noopener noreferrer">GitHub</a><br/>
                <a href="https://www.linkedin.com/in/satyam7world/" target="_blank"
                   rel="noopener noreferrer">LinkedIn</a><br/>
                <a href="mailto:connect@satyam7.world">Email</a>
            </div>
        </Html>
    );
}

function Model() {
    const {scene} = useGLTF("./Heli_bell.glb");
    const bladeRef = useRef<Mesh | null>(null);
    const [hoverPosition, setHoverPosition] = useState(new Vector3(0, 1, 0));
    const [hoverDirection, setHoverDirection] = useState(1);

    useEffect(() => {
        const bladeObject = scene.children.find((child) => child.name === "baling_baling_1");
        if (bladeObject) {
            bladeRef.current = bladeObject as Mesh;
        }
    }, [scene]);

    useFrame((state) => {
        // Rotate the blades
        if (bladeRef.current) {
            bladeRef.current.rotation.y += 0.3;
        }

        // Hover the helicopter
        setHoverPosition((prev) => {
            const newPos = prev.clone();
            newPos.y += 0.005 * hoverDirection;
            if (newPos.y > 1.2 || newPos.y < 0.8) {
                setHoverDirection(-hoverDirection);
            }
            scene.position.copy(newPos);
            return newPos;
        });

        // Slight rotation for realistic hovering effect
        scene.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.05;
        scene.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.05;
    });

    return (
        <primitive object={scene} position={hoverPosition}/>
    );
}

export default function Home() {
    const [isBannerVisible, setBannerVisibility] = useState(true);

    const handleToggleBanner = () => {
        setBannerVisibility(prev => !prev);
    };

    return (
        <div style={{width: "100vw", height: "100vh"}}>
            <Canvas camera={{position: [5, 5, 10], fov: 60}}>
                <Sky sunPosition={[100, 10, 100]}/>
                <ambientLight/>
                <pointLight position={[10, 10, 10]}/>
                <Suspense fallback={null}>
                    <Model/>
                    <Banner isVisible={isBannerVisible}/>
                </Suspense>
                <Floor/>
                <OrbitControls
                    maxDistance={30}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>
            <button
                onClick={handleToggleBanner}
                style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                {isBannerVisible ? 'Hide' : 'Show'}
            </button>
        </div>
    );
}
