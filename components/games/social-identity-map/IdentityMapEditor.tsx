'use client';

import { useState } from 'react';
import { IdentityMap } from '@/lib/games/social-identity-map/model';

interface LinkProps {
    map: IdentityMap;
    readOnly?: boolean;
    onChange?: (newMap: IdentityMap) => void;
}

export function IdentityMapEditor({ map, readOnly = false, onChange }: LinkProps) {
    return (
        <div className="flex flex-col md:flex-row gap-8 w-full h-full items-start justify-center p-4">
            {/* Visualizer Area */}
            <div className={`flex-1 flex items-center justify-center min-h-[500px] w-full ${readOnly ? 'flex-grow' : 'md:w-2/3'}`}>
                <MapVisualizer map={map} />
            </div>

            {/* Editing Panel - Only show if not readOnly */}
            {!readOnly && (
                <div className="w-full md:w-1/3 bg-neutral-800 p-6 rounded-xl border border-neutral-700 h-[600px] overflow-hidden flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4">แก้ไขแผนที่</h3>
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                        <LayerInput
                            label="สิ่งที่เลี่ยงไม่ได้ (Given)"
                            description="ลักษณะที่คุณติดตัวมาแต่กำเนิด"
                            values={map.given}
                            color="blue"
                            onChange={(vals) => onChange?.({ ...map, given: vals })}
                        />
                        <LayerInput
                            label="สิ่งที่เลือกเอง (Chosen)"
                            description="ลักษณะที่คุณเลือกหรือเรียนรู้ด้วยตนเอง"
                            values={map.chosen}
                            color="purple"
                            onChange={(vals) => onChange?.({ ...map, chosen: vals })}
                        />
                        <LayerInput
                            label="แกนกลาง (Core)"
                            description="คุณค่าและความเชื่อที่ลึกซึ้งที่สุด"
                            values={map.core}
                            color="amber"
                            onChange={(vals) => onChange?.({ ...map, core: vals })}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Visualizer Component ---

function MapVisualizer({ map }: { map: IdentityMap }) {
    return (
        <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center">
            {/* LAYERS */}

            {/* 1. GIVEN (Outer) */}
            <div className="absolute inset-0 rounded-full border-2 border-slate-700 bg-slate-800/20">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-slate-500 font-bold tracking-[0.2em] text-[10px] md:text-sm uppercase">สิ่งที่เลี่ยงไม่ได้</div>
                {/* Responsive radius: 300px container -> radius 150. But we need padding. */}
                <RingItems items={map.given} radiusPercent={42} color="slate" />
            </div>

            {/* 2. CHOSEN (Middle) */}
            <div className="absolute w-[66%] h-[66%] rounded-full border-2 border-indigo-700 bg-indigo-900/20 z-10">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-indigo-400 font-bold tracking-[0.2em] text-[10px] md:text-sm uppercase">สิ่งที่เลือกเอง</div>
                <RingItems items={map.chosen} radiusPercent={38} color="indigo" />
            </div>

            {/* 3. CORE (Inner) */}
            <div className="absolute w-[33%] h-[33%] rounded-full border-2 border-amber-700 bg-amber-900/40 z-20 flex flex-col items-center justify-center text-center p-2 md:p-4">
                <div className="text-amber-500 font-bold tracking-[0.2em] text-[8px] md:text-xs uppercase mb-1 md:mb-2">แกนกลาง</div>
                <div className="flex flex-wrap justify-center gap-1 md:gap-2 max-h-full overflow-hidden">
                    {map.core.map((item, i) => (
                        <span key={i} className="inline-block px-1 md:px-2 py-0.5 bg-amber-900/80 text-amber-100 text-[10px] md:text-xs rounded border border-amber-700/50 truncate max-w-full">
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function RingItems({ items, radiusPercent, color }: { items: string[], radiusPercent: number, color: string }) {
    if (items.length === 0) return null;

    // Distribute items evenly along the circle
    const angleStep = (2 * Math.PI) / items.length;

    // Style map
    const styles = {
        slate: 'bg-slate-800 border-slate-600 text-slate-200',
        indigo: 'bg-indigo-900 border-indigo-600 text-indigo-200',
        amber: 'bg-amber-900 border-amber-600 text-amber-200',
    }[color] || 'bg-gray-800';

    return (
        <div className="absolute inset-0 pointer-events-none">
            {items.map((item, i) => {
                const angle = i * angleStep - Math.PI / 2; // Start from top (-90deg)
                // We use percentages for responsiveness
                // Center is 50%, 50%.
                // x = 50 + r * cos
                // y = 50 + r * sin
                const x = 50 + radiusPercent * Math.cos(angle);
                const y = 50 + radiusPercent * Math.sin(angle);

                return (
                    <div
                        key={i}
                        className={`absolute flex items-center justify-center px-2 py-1 rounded-md border shadow-sm text-[10px] md:text-xs font-medium max-w-[80px] md:max-w-[120px] text-center transform -translate-x-1/2 -translate-y-1/2 ${styles}`}
                        style={{
                            left: `${x}%`,
                            top: `${y}%`,
                        }}
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    );
}


// --- Form Component ---

function LayerInput({ label, description, values, color, onChange }: {
    label: string,
    description: string,
    values: string[],
    color: string,
    onChange: (vals: string[]) => void
}) {
    const [newItem, setNewItem] = useState('');

    const handleAdd = () => {
        if (!newItem.trim()) return;
        onChange([...values, newItem.trim()]);
        setNewItem('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAdd();
    };

    const handleRemove = (index: number) => {
        const newVals = [...values];
        newVals.splice(index, 1);
        onChange(newVals);
    };

    const colorClasses = {
        blue: 'text-blue-400 border-blue-800/50 focus-within:border-blue-600',
        purple: 'text-purple-400 border-purple-800/50 focus-within:border-purple-600',
        amber: 'text-amber-400 border-amber-800/50 focus-within:border-amber-600',
    }[color] || 'text-gray-400';

    return (
        <div className={`p-4 rounded-lg bg-neutral-900/50 border ${colorClasses.split(' ')[1]}`}>
            <div className="mb-3">
                <h4 className={`font-bold text-sm uppercase tracking-wide ${colorClasses.split(' ')[0]}`}>{label}</h4>
                <p className="text-xs text-neutral-500">{description}</p>
            </div>

            {/* List */}
            <div className="flex flex-wrap gap-2 mb-3">
                {values.map((v, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-sm text-neutral-300">
                        {v}
                        <button
                            onClick={() => handleRemove(i)}
                            className="ml-2 text-neutral-500 hover:text-red-400"
                        >
                            ×
                        </button>
                    </span>
                ))}
                {values.length === 0 && <span className="text-xs text-neutral-600 italic">ยังไม่มีการเพิ่มลักษณะ</span>}
            </div>

            {/* Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="เพิ่มลักษณะ..."
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition"
                />
                <button
                    onClick={handleAdd}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 px-3 py-1.5 rounded text-sm transition"
                >
                    เพิ่ม
                </button>
            </div>
        </div>
    );
}
