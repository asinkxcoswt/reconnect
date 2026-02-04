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
                className="bg-neutral-900 w-full max-w-md rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Decoration */}
                <div className="h-1.5 w-full bg-blue-600 opacity-80" />

                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="bg-neutral-800 hover:bg-neutral-700 w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-all transform hover:rotate-90 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 py-4 text-neutral-300">
                    {children}
                </div>

                {/* Actions */}
                {actions && (
                    <div className="px-8 pb-8 pt-4 flex flex-col gap-3">
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
    isPending?: boolean;
}

export function PromptModal({ isOpen, onClose, title, value, onChange, onSubmit, placeholder, submitLabel = 'บันทึก', isPending = false }: PromptModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            actions={
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onSubmit}
                        disabled={isPending}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isPending && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {submitLabel}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="w-full py-2 text-neutral-400 hover:text-white font-medium transition-colors disabled:opacity-50 cursor-pointer"
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
                    className="w-full bg-neutral-800 border-2 border-neutral-700 rounded-2xl px-6 py-4 text-white font-medium placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
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
    const colorClass = type === 'success' ? 'bg-green-600 hover:bg-green-500' : type === 'warning' ? 'bg-amber-600 hover:bg-amber-500' : type === 'error' ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            actions={
                <button
                    onClick={onClose}
                    className={`w-full py-3.5 ${colorClass} text-white font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98] cursor-pointer`}
                >
                    {buttonLabel}
                </button>
            }
        >
            <div className="text-center py-4">
                <div className="text-5xl mb-4">{icon}</div>
                <p className="text-lg text-white font-bold leading-relaxed">{message}</p>
            </div>
        </Modal>
    );
}
