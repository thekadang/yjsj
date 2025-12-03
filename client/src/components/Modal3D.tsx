import React from 'react';

interface Modal3DProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width?: string;
    height?: string;
}

const Modal3D: React.FC<Modal3DProps> = ({ isOpen, onClose, children, width = '1280px', height = '85vh' }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.3)' // Slight dark overlay
        }} onClick={onClose}>
            <div style={{
                width: width,
                height: height,
                maxHeight: '90vh', // Prevent overflowing screen
                backgroundColor: '#fff',
                borderRadius: '15px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.2)', // 3D Shadow effect
                overflowY: 'auto',
                padding: '20px',
                position: 'relative',
                transform: 'perspective(1000px) rotateX(1deg)', // Slight 3D tilt
                transition: 'transform 0.3s ease',
                border: '1px solid rgba(255,255,255,0.8)'
            }} onClick={(e) => e.stopPropagation()}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    &times;
                </button>

                {children}
            </div>
        </div>
    );
};

export default Modal3D;
