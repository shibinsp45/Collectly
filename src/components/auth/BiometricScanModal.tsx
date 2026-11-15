import React, { useState } from 'react';
import { Fingerprint, Check, ShieldCheck, X, Delete, Lock, KeyRound, Sparkles } from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { clsx } from 'clsx';

export const BiometricScanModal: React.FC = () => {
  const { 
    isBiometricModalOpen, 
    setIsBiometricModalOpen, 
    loginWithFingerprint,
    unlockWithPin,
    mobilePin,
    user,
    showToast
  } = useCollectly();

  const [mode, setMode] = useState<'fingerprint' | 'pin'>('fingerprint');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [pinDigits, setPinDigits] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);

  if (!isBiometricModalOpen) return null;

  const handleTriggerScan = async () => {
    setScanState('scanning');
    try {
      const ok = await loginWithFingerprint();
      if (ok) {
        setScanState('success');
        setTimeout(() => {
          setScanState('idle');
          setIsBiometricModalOpen(false);
        }, 700);
      } else {
        setScanState('idle');
        setMode('pin'); // Offer PIN lock fallback smoothly
      }
    } catch {
      setScanState('idle');
      setMode('pin');
    }
  };

  const handleKeyPress = (num: string) => {
    if (pinDigits.length < 4) {
      const newDigits = pinDigits + num;
      setPinDigits(newDigits);

      if (newDigits.length === 4) {
        // Validate immediately
        setTimeout(() => {
          if (newDigits === mobilePin) {
            setScanState('success');
            setTimeout(() => {
              unlockWithPin(newDigits);
              setPinDigits('');
              setScanState('idle');
            }, 500);
          } else {
            setIsShaking(true);
            showToast('Incorrect PIN', `The PIN entered is invalid. Try default: ${mobilePin}`, 'danger');
            setTimeout(() => {
              setIsShaking(false);
              setPinDigits('');
            }, 600);
          }
        }, 150);
      }
    }
  };

  const handleDeleteDigit = () => {
    setPinDigits(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className={clsx(
          "relative w-full max-w-[340px] rounded-[26px] p-6 text-center shadow-2xl transition-all duration-300",
          "glass-panel border border-white/20",
          scanState === 'success' && "ring-2 ring-[#34C759]/60",
          isShaking && "animate-shake"
        )}
      >
        {/* Close button */}
        <button
          onClick={() => {
            setIsBiometricModalOpen(false);
            setPinDigits('');
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header Icon */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full insta-gradient-bg text-white flex items-center justify-center shadow-sm">
            <Lock size={15} />
          </div>
          <span className="text-[14px] font-bold text-[var(--text-primary)]">
            Mobile Security
          </span>
        </div>

        {/* Tab Switcher: Fingerprint vs Phone PIN */}
        <div className="flex items-center bg-black/20 dark:bg-white/10 p-1 rounded-full mb-4">
          <button
            type="button"
            onClick={() => setMode('fingerprint')}
            className={clsx(
              "flex-1 py-1.5 rounded-full text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              mode === 'fingerprint' 
                ? "bg-white text-black shadow-sm" 
                : "text-[var(--text-secondary)] hover:text-white"
            )}
          >
            <Fingerprint size={13} />
            <span>Fingerprint</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('pin')}
            className={clsx(
              "flex-1 py-1.5 rounded-full text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              mode === 'pin' 
                ? "bg-white text-black shadow-sm" 
                : "text-[var(--text-secondary)] hover:text-white"
            )}
          >
            <KeyRound size={13} />
            <span>Phone PIN</span>
          </button>
        </div>

        {/* MODE 1: MOBILE FINGERPRINT SENSOR */}
        {mode === 'fingerprint' ? (
          <div className="space-y-4 py-2">
            <div className="relative my-3 flex items-center justify-center">
              {/* Concentric pulse rings */}
              <div 
                className={clsx(
                  "absolute w-28 h-28 rounded-full transition-all duration-500",
                  scanState === 'scanning' && "animate-ping bg-[#E1306C]/25",
                  scanState === 'success' && "bg-[#34C759]/20 scale-110"
                )} 
              />
              <div 
                className={clsx(
                  "absolute w-24 h-24 rounded-full border transition-all duration-300",
                  scanState === 'scanning' ? "border-[#E1306C] animate-pulse" : "border-white/20",
                  scanState === 'success' && "border-[#34C759] ring-4 ring-[#34C759]/30"
                )} 
              />

              <button
                type="button"
                onClick={handleTriggerScan}
                disabled={scanState === 'scanning' || scanState === 'success'}
                className={clsx(
                  "relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg active:scale-95",
                  scanState === 'idle' && "insta-gradient-bg text-white hover:scale-105",
                  scanState === 'scanning' && "bg-[#E1306C] text-white scale-105",
                  scanState === 'success' && "bg-[#34C759] text-white scale-105"
                )}
                title="Tap sensor to scan mobile fingerprint"
              >
                {scanState === 'success' ? (
                  <Check size={36} strokeWidth={2.8} className="animate-in zoom-in-75 duration-200" />
                ) : (
                  <Fingerprint 
                    size={40} 
                    strokeWidth={1.8} 
                    className={clsx(scanState === 'scanning' && "animate-pulse")} 
                  />
                )}
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
                {scanState === 'idle' && 'Touch Fingerprint Sensor'}
                {scanState === 'scanning' && 'Scanning Biometric...'}
                {scanState === 'success' && 'Unlocked!'}
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                {scanState === 'idle' && 'Place your registered finger on the sensor to unlock saved files.'}
                {scanState === 'scanning' && 'Verifying with Mobile Secure Enclave...'}
                {scanState === 'success' && 'Saved items are now accessible.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMode('pin')}
              className="text-[12px] font-medium text-[#007AFF] hover:underline cursor-pointer pt-1"
            >
              Use Phone PIN instead
            </button>
          </div>
        ) : (
          /* MODE 2: PHONE PIN LOCK KEYPAD */
          <div className="space-y-4 py-1">
            <div className="space-y-1">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
                Enter Phone PIN
              </h3>
              <p className="text-[11.5px] text-[var(--text-secondary)]">
                Enter your 4-digit code (Default PIN: <strong className="text-[var(--text-primary)]">{mobilePin}</strong>)
              </p>
            </div>

            {/* 4 PIN Dots */}
            <div className="flex items-center justify-center gap-3.5 my-3">
              {[0, 1, 2, 3].map(idx => {
                const isFilled = pinDigits.length > idx;
                return (
                  <div
                    key={idx}
                    className={clsx(
                      "w-4 h-4 rounded-full border-2 transition-all duration-200",
                      isFilled
                        ? "insta-gradient-bg border-transparent scale-110 shadow-sm"
                        : "border-white/30 bg-black/10"
                    )}
                  />
                );
              })}
            </div>

            {/* 3x4 Phone Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num)}
                  className="w-16 h-12 rounded-[14px] glass-card text-[18px] font-bold text-[var(--text-primary)] hover:bg-white/20 active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                >
                  {num}
                </button>
              ))}

              {/* Bottom row: Fingerprint toggle, 0, Backspace */}
              <button
                type="button"
                onClick={() => setMode('fingerprint')}
                className="w-16 h-12 rounded-[14px] glass-card text-[#E1306C] hover:bg-white/20 active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                title="Switch to Fingerprint"
              >
                <Fingerprint size={20} />
              </button>

              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="w-16 h-12 rounded-[14px] glass-card text-[18px] font-bold text-[var(--text-primary)] hover:bg-white/20 active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleDeleteDigit}
                className="w-16 h-12 rounded-[14px] glass-card text-[var(--text-secondary)] hover:text-white hover:bg-white/20 active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                title="Delete"
              >
                <Delete size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Security badge footer */}
        <div className="mt-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)]">
          <ShieldCheck size={13} className="text-[#34C759]" />
          <span>Mobile Hardware & PIN Protected</span>
        </div>
      </div>
    </div>
  );
};

export default BiometricScanModal;
