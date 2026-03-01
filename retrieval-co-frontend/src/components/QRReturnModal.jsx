import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRReturnModal({ isOpen, onClose, post, isOwner, onSuccessCallback }) {
    const { token } = useAuth();
    const [qrPayload, setQrPayload] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && isOwner && post) {
            generateSession();
        } else if (!isOpen) {
            setScanned(false);
            setScanResult(null);
            setError('');
            setQrPayload(null);
        }
    }, [isOpen, isOwner, post]);

    useEffect(() => {
        let scanner = null;
        if (isOpen && !isOwner && !scanned) {
            scanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scanner.render(
                (decodedText) => {
                    if (scanner) scanner.clear();
                    handleRealScan(decodedText);
                },
                (errorMessage) => { }
            );
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(console.error);
            }
        };
    }, [isOpen, isOwner, scanned]);

    const generateSession = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/return/${post._id}/generate-qr`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate QR');
            setQrPayload(JSON.stringify(data.qrData));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRealScan = async (scannedDataString) => {
        setLoading(true);
        setError('');
        try {
            let payload;
            try {
                payload = JSON.parse(scannedDataString);
            } catch (e) {
                throw new Error("Invalid QR code format. Not recognized by Retrieval Co.");
            }

            if (!payload.postId || !payload.token || !payload.ownerId) {
                throw new Error("Invalid QR code format. Missing required data.");
            }

            const res = await fetch(`${API_BASE}/api/return/confirm-qr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to confirm return');

            setScanned(true);
            setScanResult('success');
            if (onSuccessCallback) {
                setTimeout(() => onSuccessCallback(), 2000);
            }
        } catch (err) {
            setError(err.message || 'Error processing QR code.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <div className="bg-surface border border-grey-200 w-full max-w-md rounded-[var(--radius-xl)] overflow-hidden shadow-lg">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-grey-100">
                    <h3 className="text-[16px] font-display font-bold text-text flex items-center gap-2">
                        <QrCode className="text-green" size={20} />
                        Secure QR Return
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-grey-400 hover:text-danger transition-colors p-1 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 text-center">
                    {scanned ? (
                        <div className="py-8">
                            <div className="w-16 h-16 bg-green-light rounded-full flex items-center justify-center mx-auto mb-5">
                                <CheckCircle2 size={32} className="text-green" />
                            </div>
                            <h4 className="text-xl font-display font-bold text-text mb-2">Return Confirmed!</h4>
                            <p className="text-text-muted text-[13px]">
                                The handoff was successful. +50 Karma awarded to the finder.
                            </p>
                        </div>
                    ) : (
                        <>
                            {isOwner ? (
                                <div className="space-y-5">
                                    <p className="text-text-muted text-[13px] leading-relaxed">
                                        Show this QR code to the person returning your item.
                                        When they scan it, the item will be marked as returned and they will receive Karma.
                                    </p>

                                    {error && (
                                        <div className="bg-danger-bg border border-danger/20 p-3 rounded-[var(--radius)] text-[12px] text-danger flex items-center gap-2 text-left">
                                            <AlertCircle size={14} /> {error}
                                        </div>
                                    )}
                                    {loading ? (
                                        <div className="py-10 flex flex-col items-center justify-center text-grey-400">
                                            <RefreshCw className="animate-spin mb-3" size={28} />
                                            <p className="text-[13px]">Generating secure QR session...</p>
                                        </div>
                                    ) : qrPayload ? (
                                        <div className="bg-grey-50 p-6 rounded-[var(--radius-lg)] inline-block mx-auto border border-grey-100">
                                            <QRCodeSVG
                                                value={qrPayload}
                                                size={200}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>
                                    ) : null}

                                    <div className="flex items-start gap-2.5 bg-blue-pale border border-blue-light/30 p-3.5 rounded-[var(--radius)] text-left">
                                        <AlertCircle className="text-blue shrink-0 mt-0.5" size={15} />
                                        <p className="text-[12px] text-blue">
                                            Do not share this code online. Only show it in-person during the handoff.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <p className="text-text-muted text-[13px] leading-relaxed">
                                        Scan the QR code on the owner's screen to securely confirm you returned the item.
                                        You will receive Karma for this successful return!
                                    </p>

                                    {loading ? (
                                        <div className="py-10 flex flex-col items-center justify-center text-grey-400 bg-grey-50 rounded-[var(--radius-lg)] border-2 border-dashed border-grey-200">
                                            <RefreshCw className="animate-spin mb-3" size={28} />
                                            <p className="text-[13px]">Processing scanned QR...</p>
                                        </div>
                                    ) : (
                                        <div className="mx-auto w-full max-w-sm rounded-[var(--radius-lg)] bg-grey-50 border-2 border-dashed border-grey-200 overflow-hidden">
                                            <div id="qr-reader" className="w-full"></div>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="bg-danger-bg border border-danger/20 p-3 rounded-[var(--radius)] text-[12px] text-danger flex items-center gap-2 text-left">
                                            <AlertCircle size={14} /> {error}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
