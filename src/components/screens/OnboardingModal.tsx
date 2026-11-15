import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Palette, 
  Cpu, 
  FileText, 
  Plane, 
  Briefcase, 
  Utensils, 
  Music,
  User,
  Heart,
  Fingerprint
} from 'lucide-react';
import { useCollectly } from '../../context/CollectlyContext';
import { InstagramIcon } from '../ui/InstagramIcon';
import { clsx } from 'clsx';

const FAVORITE_TOPICS = [
  { id: 'design', label: 'Design & Systems', icon: Palette, color: '#007AFF' },
  { id: 'tech', label: 'Technology & AI', icon: Cpu, color: '#5856D6' },
  { id: 'visuals', label: 'Visuals & Reels', icon: InstagramIcon, color: '#E1306C' },
  { id: 'articles', label: 'Articles & Docs', icon: FileText, color: '#34C759' },
  { id: 'travel', label: 'Travel & Cafes', icon: Plane, color: '#AF52DE' },
  { id: 'business', label: 'Startups & Product', icon: Briefcase, color: '#FF9500' },
  { id: 'food', label: 'Food & Recipes', icon: Utensils, color: '#FF2D55' },
  { id: 'audio', label: 'Music & Podcasts', icon: Music, color: '#5AC8FA' }
];

export const OnboardingModal: React.FC = () => {
  const { 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    user, 
    updateUserProfile,
    loginWithInstagram,
    loginWithGoogle,
    isBiometricsEnabled,
    enableBiometrics,
    showToast
  } = useCollectly();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Profile
  const [name, setName] = useState(user.name || 'Ansu');
  const [email, setEmail] = useState(user.email || 'ansu@collectly.app');
  const [selectedAvatarColor, setSelectedAvatarColor] = useState('#007AFF');

  // Step 2: Favorites
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([
    'design', 'tech', 'visuals', 'articles'
  ]);

  // Step 3: Social, Cloud & Fingerprint Connect
  const [instaHandle, setInstaHandle] = useState(user.instagramHandle || '@ansu.design');
  const [isInstaLinked, setIsInstaLinked] = useState(user.instagramConnected ?? true);
  const [googleEmail, setGoogleEmail] = useState(user.googleEmail || 'ansu@gmail.com');
  const [isGoogleLinked, setIsGoogleLinked] = useState(user.googleConnected ?? true);
  const [isBioLinked, setIsBioLinked] = useState(true);

  if (!isOnboardingOpen) return null;

  const toggleFavorite = (id: string) => {
    setSelectedFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    // Save profile updates
    updateUserProfile(name, email, name.charAt(0).toUpperCase());

    // Connect accounts
    if (isInstaLinked) {
      loginWithInstagram(instaHandle);
    }
    if (isGoogleLinked) {
      loginWithGoogle(googleEmail);
    }

    setIsOnboardingOpen(false);
    setStep(1);
    showToast('Welcome to Collectly!', `Setup complete for ${name}. Enjoy saving everything.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={() => setIsOnboardingOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[var(--surface-primary)] rounded-[20px] shadow-2xl border border-black/[0.08] dark:border-white/[0.12] overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header & Step Progress Bar */}
        <div className="px-5 pt-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[5px] bg-[#007AFF] text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
              C
            </div>
            <span className="text-[13px] font-bold text-[var(--text-primary)]">
              Collectly Setup
            </span>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-200",
                  step === s ? "w-6 bg-[#007AFF]" : step > s ? "w-2 bg-[#34C759]" : "w-2 bg-black/[0.1] dark:bg-white/[0.15]"
                )}
              />
            ))}
          </div>

          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
            title="Skip for now"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto no-scrollbar flex-1 space-y-5">
          
          {/* ========================================================= */}
          {/* STEP 1: WELCOME & PROFILE SETUP                          */}
          {/* ========================================================= */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1.5 pb-1">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center text-[22px] font-bold mx-auto shadow-md">
                  {name.charAt(0).toUpperCase() || 'A'}
                </div>
                <h2 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
                  Welcome to Collectly
                </h2>
                <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                  Your AI knowledge workspace. Let's customize your profile name and workspace preferences.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1">
                    Your Name
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1]">
                    <User size={15} className="text-[#007AFF] shrink-0" />
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ansu"
                      className="bg-transparent text-[13.5px] text-[var(--text-primary)] focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1">
                    Email / Workspace Handle
                  </label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ansu@collectly.app"
                    className="w-full px-3 py-2 rounded-[10px] bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] text-[13.5px] text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1.5">
                    Avatar Accent
                  </label>
                  <div className="flex items-center gap-2">
                    {['#007AFF', '#5856D6', '#E1306C', '#34C759', '#FF9500', '#AF52DE'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedAvatarColor(color)}
                        className={clsx(
                          "w-7 h-7 rounded-full transition-transform cursor-pointer",
                          selectedAvatarColor === color && "ring-2 ring-offset-2 ring-[#007AFF] scale-110"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: CHOOSE FAVORITE TOPICS & INTERESTS               */}
          {/* ========================================================= */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#FF2D55]/10 text-[#FF2D55] flex items-center justify-center mx-auto mb-1">
                  <Heart size={20} fill="currentColor" />
                </div>
                <h2 className="text-[19px] font-bold text-[var(--text-primary)] tracking-tight">
                  Choose Your Favorites
                </h2>
                <p className="text-[12.5px] text-[var(--text-secondary)] max-w-sm mx-auto">
                  Select the topics you care about. We'll pre-configure your collections and smart filters.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {FAVORITE_TOPICS.map(topic => {
                  const isSelected = selectedFavorites.includes(topic.id);
                  const Icon = topic.icon;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => toggleFavorite(topic.id)}
                      className={clsx(
                        "p-3 rounded-[12px] border text-left flex items-center gap-2.5 transition-all cursor-pointer active:scale-98 select-none",
                        isSelected 
                          ? "bg-[#007AFF]/[0.08] dark:bg-[#0A84FF]/[0.15] border-[#007AFF] text-[var(--text-primary)] shadow-xs" 
                          : "bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.08] text-[var(--text-secondary)] hover:border-black/[0.14]"
                      )}
                    >
                      <div 
                        className="w-8 h-8 rounded-[8px] flex items-center justify-center text-white shrink-0 shadow-2xs"
                        style={{ backgroundColor: topic.color }}
                      >
                        <Icon size={16} strokeWidth={2.2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[12.5px] font-semibold block truncate">
                          {topic.label}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {isSelected ? '✓ Selected' : 'Tap to add'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: CONNECT INSTAGRAM & GOOGLE                       */}
          {/* ========================================================= */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#34C759]/10 text-[#34C759] flex items-center justify-center mx-auto mb-1">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-[19px] font-bold text-[var(--text-primary)] tracking-tight">
                  Connect Feeds & Saves
                </h2>
                <p className="text-[12.5px] text-[var(--text-secondary)] max-w-sm mx-auto">
                  Automatically synchronize your Instagram saved reels and Google starred places into Collectly.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {/* Instagram Connect Card */}
                <div className="p-3.5 rounded-[14px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white flex items-center justify-center shadow-2xs">
                        <InstagramIcon size={16} strokeWidth={2.2} />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Instagram Account</h4>
                        <p className="text-[11px] text-[var(--text-muted)]">Saved reels, inspiration & posts</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsInstaLinked(!isInstaLinked)}
                      className={clsx(
                        "px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors",
                        isInstaLinked 
                          ? "bg-[#34C759]/15 text-[#34C759]" 
                          : "bg-black/[0.05] dark:bg-white/[0.1] text-[var(--text-secondary)]"
                      )}
                    >
                      {isInstaLinked ? '✓ Connected' : '+ Connect'}
                    </button>
                  </div>

                  {isInstaLinked && (
                    <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center gap-2">
                      <span className="text-[11px] text-[var(--text-muted)]">Handle:</span>
                      <input 
                        type="text"
                        value={instaHandle}
                        onChange={(e) => setInstaHandle(e.target.value)}
                        placeholder="@ansu.design"
                        className="bg-transparent text-[12px] font-medium text-[var(--text-primary)] focus:outline-none flex-1"
                      />
                    </div>
                  )}
                </div>

                {/* Google Connect Card */}
                <div className="p-3.5 rounded-[14px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-black/50 border border-black/10 text-[#4285F4] flex items-center justify-center font-bold text-[14px] shadow-2xs">
                        G
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">Google Account</h4>
                        <p className="text-[11px] text-[var(--text-muted)]">Starred maps, places & docs</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsGoogleLinked(!isGoogleLinked)}
                      className={clsx(
                        "px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors",
                        isGoogleLinked 
                          ? "bg-[#34C759]/15 text-[#34C759]" 
                          : "bg-black/[0.05] dark:bg-white/[0.1] text-[var(--text-secondary)]"
                      )}
                    >
                      {isGoogleLinked ? '✓ Connected' : '+ Connect'}
                    </button>
                  </div>

                  {isGoogleLinked && (
                    <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center gap-2">
                      <span className="text-[11px] text-[var(--text-muted)]">Email:</span>
                      <input 
                        type="email"
                        value={googleEmail}
                        onChange={(e) => setGoogleEmail(e.target.value)}
                        placeholder="ansu@gmail.com"
                        className="bg-transparent text-[12px] font-medium text-[var(--text-primary)] focus:outline-none flex-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: ALL SET & LAUNCH                                  */}
          {/* ========================================================= */}
          {step === 4 && (
            <div className="space-y-4 text-center animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-[#34C759]/15 text-[#34C759] flex items-center justify-center mx-auto shadow-sm">
                <Check size={28} strokeWidth={2.8} />
              </div>

              <div className="space-y-1">
                <h2 className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
                  You're all set, {name}!
                </h2>
                <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                  Your personalized knowledge library is ready with your favorite topics and connected cloud sync.
                </p>
              </div>

              {/* Setup Summary Card */}
              <div className="p-4 rounded-[14px] bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-left space-y-2 text-[12.5px]">
                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                  <span>Profile User:</span>
                  <span className="font-semibold text-[var(--text-primary)]">{name}</span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                  <span>Favorites Configured:</span>
                  <span className="font-semibold text-[#007AFF]">{selectedFavorites.length} topics selected</span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                  <span>Instagram Sync:</span>
                  <span className="font-semibold text-[#34C759]">{isInstaLinked ? instaHandle : 'Skipped'}</span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                  <span>Google Sync:</span>
                  <span className="font-semibold text-[#34C759]">{isGoogleLinked ? googleEmail : 'Skipped'}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-3.5 py-2 rounded-[8px] text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(false)}
              className="px-3 py-2 text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              Skip
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="h-9 px-4.5 rounded-[9px] bg-[#007AFF] hover:bg-[#0069D9] text-white text-[12.5px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="h-9.5 px-6 rounded-[10px] bg-[#34C759] hover:bg-[#2FB34D] text-white text-[13px] font-semibold flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
