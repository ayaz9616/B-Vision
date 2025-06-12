import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [bars, setBars] = useState([20, 40, 60, 30, 50]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(bars => bars.map(height => {
        const delta = Math.floor(Math.random() * 30 - 15); 
        const newHeight = Math.min(90, Math.max(10, height + delta));
        return newHeight;
      }));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #17213a 0%, #0a0c23 100%)"
      }}
    >
      <div className="bg-[#0a0c23] rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center border border-[#23243a]">
        <h2 className="text-2xl font-bold text-white mb-2 text-center flex items-center gap-2">
          <span role='img' aria-label='Chart'>📊</span> Analyzing Data...
        </h2>
        <p className="text-blue-100 mb-6 text-center text-base">Please wait while we analyze your reviews.</p>

        <div className="flex items-end justify-center h-40 space-x-3 mt-4 mb-8">
          {bars.map((height, idx) => (
            <div key={idx} className="w-6 rounded-xl bg-gradient-to-t from-indigo-500 to-blue-400 transition-all duration-500"
              style={{ height: `${height}%` }}
            ></div>
          ))}
        </div>

        <p className="text-blue-200 text-sm text-center">Extracting features and sentiments...</p>
      </div>
    </div>
  )
}
