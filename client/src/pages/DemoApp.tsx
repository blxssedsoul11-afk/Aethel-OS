import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';

interface DemoAppProps {
  appName: string;
}

export default function DemoApp({ appName }: DemoAppProps) {
  const [, setLocation] = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative flex flex-col h-screen w-screen bg-black text-white font-inter">
      {/* Status Bar */}
      <div className="flex justify-between items-center w-full px-4 py-2 text-sm border-b border-white/10">
        <span className="text-lg font-semibold">{formattedTime}</span>
        <div className="flex items-center space-x-1">
          <span>5G</span>
          <span>●●●●●</span>
          <span>100%</span>
        </div>
      </div>

      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button
          onClick={() => setLocation('/home')}
          className="text-lg font-semibold text-white/70 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-xl font-montserrat font-bold">{appName}</h1>
        <div className="w-8" />
      </div>

      {/* Demo Content */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-montserrat font-bold">Demo App</h2>
          <p className="text-white/60 text-lg">
            {appName} is coming soon
          </p>
          <p className="text-white/40 text-sm mt-8">
            This is a demo screen for the {appName} application
          </p>
        </div>
      </div>

      {/* iOS-style Glowing Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div
          className="flex items-center justify-center space-x-8 px-8 py-3 rounded-full backdrop-blur-2xl border border-white/30"
          style={{
            background: 'rgba(20, 20, 20, 0.6)',
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <button
            onClick={() => setLocation('/home')}
            className="w-10 h-10 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center"
            title="Home"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
