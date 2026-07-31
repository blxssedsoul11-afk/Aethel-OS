import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';

interface RippleState {
  x: number;
  y: number;
  isActive: boolean;
  appName: string;
}

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const [ripple, setRipple] = useState<RippleState>({
    x: 0,
    y: 0,
    isActive: false,
    appName: '',
  });
  const [rippleSize, setRippleSize] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const appIcons = [
    { name: 'Messages', icon: '/manus-storage/aethelos_icon_messages_black_silver_0c12cf17.png' },
    { name: 'Camera', icon: '/manus-storage/aethelos_icon_camera_black_silver_4941c2e0.png' },
    { name: 'Browser', icon: '/manus-storage/aethelos_icon_browser_black_silver_78d109a6.png' },
    { name: 'Settings', icon: '/manus-storage/aethelos_icon_settings_black_silver_e4d7d04f.png' },
  ];

  useEffect(() => {
    if (!ripple.isActive) return;

    let animationFrame: number;
    let progress = 0;
    const maxSize = Math.max(window.innerWidth, window.innerHeight) * 2;

    const animate = () => {
      progress += 0.08; // Smooth increment
      setRippleSize(progress * maxSize);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setLocation(`/app/${ripple.appName.toLowerCase()}`);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [ripple.isActive, ripple.appName, setLocation]);

  const handleAppClick = (e: React.MouseEvent<HTMLButtonElement>, appName: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setRipple({
      x,
      y,
      isActive: true,
      appName,
    });
    setRippleSize(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-screen w-screen bg-cover bg-center p-4 text-white font-inter overflow-hidden"
      style={{
        backgroundImage: `url(/manus-storage/aethelos_wallpaper_black_silver_fbed1532.png)`,
        backgroundColor: '#0f0f0f',
      }}
    >
      {/* Ripple effect - expanding circle from tap point */}
      {ripple.isActive && (
        <div
          className="fixed pointer-events-none z-50 bg-white rounded-full"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${rippleSize}px`,
            height: `${rippleSize}px`,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 60px rgba(255, 255, 255, ${Math.max(0, 1 - rippleSize / (Math.max(window.innerWidth, window.innerHeight) * 2))})`,
          }}
        />
      )}

      {/* Status Bar */}
      <div className="flex justify-between items-center w-full px-2 py-1">
        <span className="text-xl font-semibold">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="flex items-center space-x-1">
          <span className="text-sm">5G</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17 6.5V13.5C17 14.3284 16.3284 15 15.5 15H4.5C3.67157 15 3 14.3284 3 13.5V6.5C3 5.67157 3.67157 5 4.5 5H15.5C16.3284 5 17 5.67157 17 6.5ZM15.5 6.5H4.5V13.5H15.5V6.5Z" />
          </svg>
          <span className="text-sm">100%</span>
        </div>
      </div>

      {/* App Grid */}
      <div className="flex-grow grid grid-cols-4 gap-6 p-6 mt-4">
        {appIcons.map((app) => (
          <button
            key={app.name}
            onClick={(e) => handleAppClick(e, app.name)}
            className="flex flex-col items-center space-y-2 focus:outline-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/20 flex items-center justify-center hover:border-white/40 transition-all active:scale-95">
              <img src={app.icon} alt={app.name} className="w-10 h-10" />
            </div>
            <span className="text-xs text-center font-medium text-white/80">{app.name}</span>
          </button>
        ))}
      </div>

      {/* Glowing line navigation bar */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div
          className="h-1 rounded-full"
          style={{
            width: '120px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.3)',
          }}
        />
      </div>

      {/* Lock Button (for demo) */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setLocation('/')}
          className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all"
        >
          Lock
        </button>
      </div>
    </div>
  );
}
