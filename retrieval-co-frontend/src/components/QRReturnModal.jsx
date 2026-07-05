import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRReturnModal({ isOpen, onClose, post, isOwner, onSuccessCallback }) {
    const { token } = useAuth();
    const modalBodyRef = useRef(null);
    const [qrPayload, setQrPayload] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [error, setError] = useState('');
    const [selectedFinder, setSelectedFinder] = useState('');
    const [manualLoading, setManualLoading] = useState(false);
    const [manualError, setManualError] = useState('');
    const [showManual, setShowManual] = useState(false);

    useEffect(() => {
        if (isOpen && isOwner && post) {
            generateSession();
        } else if (!isOpen) {
            setScanned(false);
            setScanResult(null);
            setError('');
            setQrPayload(null);
            setShowManual(false);
        }

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, isOwner, post]);

    useEffect(() => {
        if (showManual) {
            // Small timeout to allow layout animation/paint before scroll height calculation
            setTimeout(() => {
                if (modalBodyRef.current) {
                    modalBodyRef.current.scrollTop = modalBodyRef.current.scrollHeight;
                }
            }, 80);
        }
    }, [showManual]);

    useEffect(() => {
        let scanner = null;
        if (isOpen && !isOwner && !scanned) {
            scanner = new Html5QrcodeScanner(
                "qr-reader",
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 },
                    supportedScanTypes: [0] // Camera scan only to open camera option directly
                },
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

    const handleManualReturnConfirm = async () => {
        if (!selectedFinder) {
            setManualError('Please select a student to award Karma.');
            return;
        }

        setManualLoading(true);
        setManualError('');
        try {
            const res = await fetch(`${API_BASE}/api/return/confirm-manual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    postId: post._id,
                    finderId: selectedFinder
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to confirm return manually');

            setScanned(true);
            setScanResult('success');
            if (onSuccessCallback) {
                setTimeout(() => onSuccessCallback(), 2000);
            }
        } catch (err) {
            setManualError(err.message || 'Error confirming manual return.');
        } finally {
            setManualLoading(false);
        }
    };

    const uniqueRepliers = [];
    if (post && post.replies) {
        const seenUserIds = new Set();
        post.replies.forEach(reply => {
            const replier = reply.user;
            if (replier && typeof replier === 'object' && replier._id && !seenUserIds.has(replier._id)) {
                seenUserIds.add(replier._id);
                uniqueRepliers.push(replier);
            }
        });
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20">
            <div className="bg-surface border border-grey-200 w-full max-w-md max-h-[90vh] flex flex-col rounded-[var(--radius-xl)] overflow-hidden shadow-lg">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-grey-100 shrink-0">
                    <h3 className="text-[16px] font-display font-bold text-text flex items-center gap-2">
                        <QrCode className="text-green" size={20} />
                        Secure QR Return
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer border-none bg-transparent"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div ref={modalBodyRef} className="p-6 text-center flex-1 overflow-y-auto">
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
                                    {localStorage.getItem('demo_mode') === 'true' && (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                setLoading(true);
                                                setError('');
                                                try {
                                                    const mockData = JSON.parse(qrPayload || '{}');
                                                    const res = await fetch(`${API_BASE}/api/return/confirm-qr`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${token}`
                                                        },
                                                        body: JSON.stringify(mockData)
                                                    });
                                                    if (res.ok) {
                                                        setScanned(true);
                                                        setScanResult('success');
                                                        if (onSuccessCallback) {
                                                            setTimeout(() => onSuccessCallback(), 2000);
                                                        }
                                                    } else {
                                                        const errData = await res.json();
                                                        throw new Error(errData.error || 'Failed to simulate');
                                                    }
                                                } catch (err) {
                                                    setError(err.message);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            className="w-full bg-[rgba(61,214,140,0.12)] text-green border border-[rgba(61,214,140,0.25)] rounded-[8px] py-2.5 px-4 font-bold text-[0.85rem] cursor-pointer hover:bg-[rgba(61,214,140,0.2)] transition-colors mt-2"
                                        >
                                            ⚡ Simulate Receiver Scanning (Demo)
                                        </button>
                                    )}

                                    {/* Manual return fallback */}
                                    <div className="border-t border-border/10 pt-4 mt-4 text-left">
                                        {!showManual ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowManual(true)}
                                                className="text-[11.5px] text-text-muted hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer underline bg-transparent border-none p-0 focus:outline-none"
                                            >
                                                No QR Code? Verify manually
                                            </button>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-[13px] font-display font-bold text-text">No QR Code? Verify manually</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowManual(false)}
                                                        className="text-[10px] text-text-muted hover:text-text cursor-pointer bg-transparent border-none p-0"
                                                    >
                                                        Hide
                                                    </button>
                                                </div>
                                                <p className="text-text-muted text-[11px] mb-3">
                                                    Confirm the return manually and award 50 Karma to the returning student:
                                                </p>

                                                {manualError && (
                                                    <div className="mb-3 p-2 bg-danger-bg border border-danger/20 rounded-md text-[11px] text-danger flex items-center gap-1.5">
                                                        <AlertCircle size={13} /> {manualError}
                                                    </div>
                                                )}

                                                {uniqueRepliers.length > 0 ? (
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <select
                                                            value={selectedFinder}
                                                            onChange={(e) => setSelectedFinder(e.target.value)}
                                                            className="form-input text-[12px] flex-1 py-1.5 bg-zinc-900/60 border border-border"
                                                        >
                                                            <option value="">Select student...</option>
                                                            {uniqueRepliers.map(user => (
                                                                <option key={user._id} value={user._id}>
                                                                    {user.name} ({user.collegeId})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            disabled={manualLoading || !selectedFinder}
                                                            onClick={handleManualReturnConfirm}
                                                            className="bg-primary hover:bg-primary-dim text-ink font-bold text-[12px] px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-transparent shadow-md"
                                                        >
                                                            {manualLoading ? 'Confirming...' : 'Confirm Return'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="p-3 bg-zinc-900/30 border border-border rounded-lg text-center text-text-muted text-[11px]">
                                                        No replies received yet. The finder must reply to your post first to be selected for manual confirmation.
                                                    </div>
                                                )}
                                            </>
                                        )}
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

                                    {localStorage.getItem('demo_mode') === 'true' && post && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const mockPayload = {
                                                    postId: post._id,
                                                    ownerId: post.author?._id || post.author,
                                                    token: 'mock_secure_qr_token_for_' + post._id
                                                };
                                                handleRealScan(JSON.stringify(mockPayload));
                                            }}
                                            className="w-full bg-[rgba(0,201,200,0.12)] text-amber border border-[rgba(0,201,200,0.25)] rounded-[8px] py-2.5 px-4 font-bold text-[0.85rem] cursor-pointer hover:bg-[rgba(0,201,200,0.2)] transition-colors mt-2"
                                        >
                                            ⚡ Simulate QR Scan (Demo)
                                        </button>
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
