import React, { useState } from 'react';
import { Fingerprint, Check, ShieldCheck, X } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { clsx } from 'clsx';

export const BiometricScanModal: React.FC = () => {
  const { 
    isBiometricModalOpen, 
    setIsBiometricModalOpen, 
    loginWithFingerprint,
    user 
  } = useCollectly();

  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');

  if (!isBiometricModalOpen) return null;

  const handleTriggerScan = async () => {
    setScanState('scanning');
    try {
      await loginWithFingerprint();
      setScanState('success');
      setTimeout(() => {
        setScanState('idle');
        setIsBiometricModalOpen(false);
      }, 700);
    } catch {
      setScanState('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={clsx(
          "relative w-full max-w-[340px] rounded-[24px] p-6 text-center shadow-2xl transition-all duration-300",
          "bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl",
          "border border-black/[0.08] dark:border-white/[0.12]",
          scanState === 'success' && "ring-2 ring-[#34C759]/50"
        )}
      >
        {/* Close button */}
        <button
          onClick={() => setIsBiometricModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Tactile Fingerprint Sensor Target */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Animated concentric pulse rings */}
          <div 
            className={clsx(
              "absolute w-28 h-28 rounded-full transition-all duration-500",
              scanState === 'scanning' && "animate-ping bg-[#007AFF]/15 dark:bg-[#0A84FF]/20",
              scanState === 'success' && "bg-[#34C759]/20 scale-110"
            )} 
          />
          <div 
            className={clsx(
              "absolute w-24 h-24 rounded-full border transition-all duration-300",
              scanState === 'scanning' ? "border-[#007AFF] animate-pulse" : "border-black/[0.08] dark:border-white/[0.1]",
              scanState === 'success' && "border-[#34C759] ring-4 ring-[#34C759]/20"
            )} 
          />

          <button
            type="button"
            onClick={handleTriggerScan}
            disabled={scanState === 'scanning' || scanState === 'success'}
            className={clsx(
              "relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md active:scale-95",
              scanState === 'idle' && "bg-gradient-to-b from-black/[0.04] to-black/[0.08] dark:from-white/[0.08] dark:to-white/[0.04] text-[#007AFF] dark:text-[#0A84FF] hover:ring-2 hover:ring-[#007AFF]/40",
              scanState === 'scanning' && "bg-[#007AFF] text-white scale-105",
              scanState === 'success' && "bg-[#34C759] text-white scale-105"
            )}
            title="Touch or click sensor to scan fingerprint"
          >
            {scanState === 'success' ? (
              <Check size={36} strokeWidth={2.5} className="animate-in zoom-in-75 duration-200" />
            ) : (
              <Fingerprint 
                size={38} 
                strokeWidth={1.75} 
                className={clsx(
                  scanState === 'scanning' && "animate-pulse"
                )} 
              />
            )}
          </button>
        </div>

        {/* Status text */}
        <div className="space-y-1 mt-2">
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            {scanState === 'idle' && 'Fingerprint Sign In'}
            {scanState === 'scanning' && 'Scanning Fingerprint...'}
            {scanState === 'success' && 'Identity Verified!'}
          </h3>
          <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
            {scanState === 'idle' && `Touch sensor or click above to unlock as ${user.name}`}
            {scanState === 'scanning' && 'Verifying biometric sensor with Windows Hello / Touch ID...'}
            {scanState === 'success' && `Welcome back, ${user.name}!`}
          </p>
        </div>

        {/* Security badge footer */}
        <div className="mt-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)]">
          <ShieldCheck size={13} className="text-[#34C759]" />
          <span>FIDO2 / WebAuthn Hardware Protected</span>
        </div>
      </div>
    </div>
  );
};

export default BiometricScanModal;
