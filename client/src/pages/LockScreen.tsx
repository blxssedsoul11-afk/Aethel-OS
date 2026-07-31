import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

export default function LockScreen() {
  const [, setLocation] = useLocation();
  const [time, setTime] = useState(new Date());
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isUnlocking) return;
    touchStartY.current = e.touches[0].clientY;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || isUnlocking) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY.current - currentY;
    const progress = Math.max(0, Math.min(1, diff / 150)); // 150px to unlock
    setSwipeProgress(progress);

    if (progress >= 0.8) {
      handleUnlock();
    }
  };

  const handleTouchEnd = () => {
    if (!isUnlocking) {
      setIsSwiping(false);
      setSwipeProgress(0);
    }
  };

  const handleUnlock = () => {
    setIsUnlocking(true);
    setIsSwiping(false);

    // Smooth transition to home after animation
    setTimeout(() => {
      setLocation('/home');
    }, 400);
  };

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-between h-screen w-screen bg-cover bg-center p-8 text-white font-inter overflow-hidden"
      style={{
        backgroundImage: `url(/manus-storage/aethelos_wallpaper_black_silver_fbed1532.png)`,
        backgroundColor: '#0f0f0f',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Unlock flash overlay */}
      {isUnlocking && (
        <div
          className="absolute inset-0 bg-white pointer-events-none"
          style={{
            animation: 'fadeOut 0.4s ease-out forwards',
          }}
        />
      )}

      <style>{`
        @keyframes fadeOut {
          0% {
            opacity: 0.2;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>

      <div className="text-center mt-16">
        <h1 className="text-7xl font-light tracking-tight">{formattedTime}</h1>
        <p className="text-2xl font-medium opacity-80 mt-2">{formattedDate}</p>
      </div>

      <div className="flex flex-col items-center mb-16">
        <div className="relative w-24 h-24 mb-4">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-white/30 transition-all"
            style={{
              borderColor: `rgba(255, 255, 255, ${0.3 + swipeProgress * 0.7})`,
              transform: `scale(${1 + swipeProgress * 0.15})`,
              opacity: 1 - swipeProgress * 0.2,
            }}
          />

          {/* Butterfly SVG */}
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            style={{
              transform: `translateY(${swipeProgress * -25}px) scale(${1 + swipeProgress * 0.1})`,
              opacity: Math.max(0.3, 1 - swipeProgress * 0.5),
              transition: isSwiping ? 'none' : 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
              filter: `brightness(${1 + swipeProgress * 0.2})`,
            }}
          >
            <path
              d="M50 20 Q70 30 75 50 Q70 70 50 80 Q30 70 25 50 Q30 30 50 20"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            <circle cx="40" cy="45" r="3" fill="white" />
            <circle cx="60" cy="45" r="3" fill="white" />
          </svg>
        </div>

        {/* Unlock text with animation */}
        <div
          style={{
            transition: isSwiping ? 'none' : 'all 0.3s ease-out',
            transform: `translateY(${swipeProgress * -10}px)`,
            opacity: Math.max(0.4, 1 - swipeProgress * 0.6),
          }}
        >
          <p className="text-lg opacity-70 font-montserrat tracking-wide">
            {swipeProgress > 0.6 ? '✓ Release to Unlock' : 'Swipe Up to Unlock'}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 w-16 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{
              width: `${swipeProgress * 100}%`,
              boxShadow: `0 0 ${swipeProgress * 12}px rgba(255, 255, 255, ${swipeProgress * 0.8})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
