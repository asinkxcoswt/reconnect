
'use client';

import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-br from-gray-800 to-gray-900 w-full max-w-md rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] border border-gray-700/50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Decoration */}
                <div className="h-2 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-80" />

                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{title}</h3>
                    <button
                        onClick={onClose}
                        className="bg-gray-700/50 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all transform hover:rotate-90 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 py-6 text-gray-300 font-medium">
                    {children}
                </div>

                {/* Actions */}
                {actions && (
                    <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

interface PromptModalProps extends Omit<ModalProps, 'children' | 'actions'> {
    value: string;
    onChange: (val: string) => void;
    onSubmit: () => void;
    placeholder?: string;
    submitLabel?: string;
}

export function PromptModal({ isOpen, onClose, title, value, onChange, onSubmit, placeholder, submitLabel = 'ยืนยัน' }: PromptModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            actions={
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onSubmit}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-purple-900/30 active:scale-[0.98] cursor-pointer"
                    >
                        {submitLabel}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-gray-400 hover:text-white font-bold transition-colors cursor-pointer"
                    >
                        ยกเลิก
                    </button>
                </div>
            }
        >
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-lg shadow-inner"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                />
            </div>
        </Modal>
    );
}

interface AlertModalProps extends Omit<ModalProps, 'children' | 'actions'> {
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    buttonLabel?: string;
}

export function AlertModal({ isOpen, onClose, title, message, type = 'info', buttonLabel = 'ตกลง' }: AlertModalProps) {
    const icon = type === 'success' ? '✨' : type === 'warning' ? '⚠️' : type === 'error' ? '🚫' : '💡';
    const colorClass = type === 'success' ? 'from-green-500 to-emerald-600' : type === 'warning' ? 'from-yellow-500 to-orange-600' : type === 'error' ? 'from-red-500 to-pink-600' : 'from-blue-500 to-purple-600';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            actions={
                <button
                    onClick={onClose}
                    className={`w-full py-4 bg-gradient-to-r ${colorClass} text-white font-black rounded-2xl transition-all shadow-xl active:scale-[0.98] cursor-pointer`}
                >
                    {buttonLabel}
                </button>
            }
        >
            <div className="text-center py-4">
                <div className={`text-6xl mb-6 transform transition-all duration-500 hover:scale-110 drop-shadow-2xl`}>{icon}</div>
                <p className="text-xl text-white font-bold leading-relaxed">{message}</p>
            </div>
        </Modal>
    );
}
