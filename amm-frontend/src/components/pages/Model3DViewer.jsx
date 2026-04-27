import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera, Environment, Html } from "@react-three/drei";

function Model({ modelPath }) {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} scale={0.5} />;
}

function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}

function MPDMarker({ position, onClick, isSelected }) {
    const [hovered, setHovered] = useState(false);
    
    return (
        <group position={position}>
            <mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={onClick}
                scale={isSelected ? 1.5 : (hovered ? 1.3 : 1)}
            >
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial 
                    color={isSelected ? "#60a5fa" : "#10b981"} 
                    emissive={isSelected ? "#60a5fa" : "#10b981"}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.9}
                />
            </mesh>
            
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.25, 0.3, 32]} />
                <meshBasicMaterial 
                    color={isSelected ? "#60a5fa" : "#10b981"} 
                    transparent 
                    opacity={0.3} 
                />
            </mesh>
        </group>
    );
}

function Model3DViewer({ selectedModel, mpdPosition, onCanvasClick, getModelPath }) {
    if (!selectedModel || !getModelPath(selectedModel)) {
        return (
            <div className="w-full h-[600px] bg-neutral-900 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">
                    {selectedModel 
                        ? "3D model not available for this aircraft" 
                        : "Please select an aircraft model"}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-[600px] bg-neutral-900 rounded-lg overflow-hidden">
            <Canvas onClick={onCanvasClick}>
                <Suspense fallback={<LoadingFallback />}>
                    <PerspectiveCamera makeDefault position={[0, 5, 15]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                    <Environment preset="sunset" />
                    
                    <Model modelPath={getModelPath(selectedModel)} />
                    
                    {mpdPosition && (
                        <MPDMarker
                            position={[
                                mpdPosition[0] * 2.5,
                                mpdPosition[1] * 2.5,
                                mpdPosition[2] * 2.5
                            ]}
                            onClick={() => {}}
                            isSelected={true}
                        />
                    )}
                    
                    <OrbitControls 
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={5}
                        maxDistance={50}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

export default Model3DViewer;
