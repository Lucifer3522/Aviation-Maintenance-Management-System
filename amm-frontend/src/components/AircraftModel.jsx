import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera, Environment, Html } from "@react-three/drei";
import { Suspense, useState } from "react";

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

function getStatusColor(status) {
    switch (status) {
        case "Completed":
            return "#4ade80";
        case "Pending":
            return "#facc15";
        case "In Progress":
            return "#60a5fa";
        default:
            return "#9ca3af";
    }
}

function MPDMarker({ position, mpd, onClick }) {
    const [hovered, setHovered] = useState(false);
    const color = getStatusColor(mpd.status);
    
    return (
        <group position={position}>
            <mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={onClick}
                scale={hovered ? 1.3 : 1}
            >
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial 
                    color={color} 
                    emissive={color}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.9}
                />
            </mesh>
            
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.25, 0.3, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
            
            {hovered && (
                <Html distanceFactor={10}>
                    <div className="bg-neutral-800 text-white p-2 rounded shadow-lg text-xs whitespace-nowrap border border-neutral-600">
                        <div className="font-semibold">{mpd.code}</div>
                        <div className="text-gray-300">{mpd.maintenance}</div>
                        <div className="text-gray-400">Status: {mpd.status}</div>
                    </div>
                </Html>
            )}
        </group>
    );
}

function AircraftModel({ modelPath, mpdList = [] }) {
    const [selectedMPD, setSelectedMPD] = useState(null);
    
    return (
        <div className="w-full h-[500px] bg-neutral-900 rounded-lg overflow-hidden relative">
            <Canvas>
                <Suspense fallback={<LoadingFallback />}>
                    <PerspectiveCamera makeDefault position={[0, 5, 15]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                    <Environment preset="sunset" />
                    
                    <Model modelPath={modelPath} />
                    
                    {mpdList.map((mpd) => {
                        if (!mpd.position || mpd.position.length < 3) return null;
                        
                        const scaleX = 2.5;
                        const scaleY = 2.5;
                        const scaleZ = 2.5;
                        
                        const position = [
                            mpd.position[0] * scaleX,
                            mpd.position[1] * scaleY,
                            mpd.position[2] * scaleZ
                        ];
                        
                        return (
                            <MPDMarker
                                key={mpd._id}
                                position={position}
                                mpd={mpd}
                                onClick={() => setSelectedMPD(mpd)}
                            />
                        );
                    })}
                    
                    <OrbitControls 
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={5}
                        maxDistance={50}
                    />
                </Suspense>
            </Canvas>
            
            <div className="absolute top-4 right-4 bg-neutral-800/90 backdrop-blur-sm p-3 rounded-lg text-xs space-y-2">
                <div className="font-semibold text-white mb-2">Status Legend:</div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-gray-300">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="text-gray-300">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-gray-300">In Progress</span>
                </div>
            </div>
            
            {selectedMPD && (
                <div className="absolute bottom-4 left-4 bg-neutral-800/95 backdrop-blur-sm p-4 rounded-lg max-w-sm">
                    <button 
                        onClick={() => setSelectedMPD(null)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                    <div className="text-white">
                        <div className="font-bold text-lg mb-2">{selectedMPD.code}</div>
                        <div className="text-sm space-y-1">
                            <div><span className="text-gray-400">Task:</span> {selectedMPD.task}</div>
                            <div><span className="text-gray-400">Maintenance:</span> {selectedMPD.maintenance}</div>
                            <div><span className="text-gray-400">Period:</span> {selectedMPD.period}</div>
                            <div><span className="text-gray-400">Status:</span> 
                                <span className={`ml-2 font-semibold ${
                                    selectedMPD.status === "Completed" ? "text-green-400" :
                                    selectedMPD.status === "Pending" ? "text-yellow-400" : 
                                    "text-blue-400"
                                }`}>
                                    {selectedMPD.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AircraftModel;
