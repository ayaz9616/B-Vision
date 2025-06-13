'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from '../component/navBar';

export default function DemoVideoPage() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative min-h-screen w-full font-sans bg-[#0a0c23] overflow-hidden">

      <Navbar />
      <div className="absolute -top-10 -left-10 w-[500px] h-[500px] bg-purple-500 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-pink-500 opacity-10 rounded-full filter blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full filter blur-2xl animate-pulse"></div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2 sm:px-4">
        <div className="mt-20 sm:mt-28 flex flex-col items-center bg-transparent rounded-3xl shadow-none p-0 max-w-2xl w-full text-center">
          <div className="inline-block bg-slate-800/70 text-white rounded-2xl px-4 py-2 font-medium text-sm sm:text-base mb-6 shadow animate-fade-in-down">
            <span role="img" aria-label="new" className="mr-2">🎥</span>
            Product Demo
          </div>

          <h1 className="text-2xl sm:text-5xl font-bold text-white mb-5 tracking-tight animate-fade-in-down bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
            See {" "} in Action 
            <span
              className="text-2xl sm:text-5xl font-bold text-blue-400 mb-10"
              style={{ fontFamily: "Inter, Segoe UI, Arial, sans-serif" }}
            >
               B Vision
            </span>
          </h1>

          <div className="space-y-4 mb-8 max-w-xl">
            <p className="text-white text-lg sm:text-xl font-light tracking-wide font-[‘Brush Script MT’, cursive] drop-shadow-md animate-fade-in-up">
              <span className="text-white font-semibold"> Watch how B Vision analyzes real customer reviews and delivers business-ready insights. </span>
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <iframe
              src="https://drive.google.com/file/d/12IvQMYtZEa9foG6w607hpD2A7gZDRqR1/preview"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              frameBorder="0"
              className="rounded-lg shadow-lg w-full aspect-video"
            ></iframe>
          </div>

          <div className="mt-5">
            <a
            href="https://github.com/ayaz9616/B-Vision"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-gradient transition-colors text-lg relative group"
          >
            GitHub
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 via-green-400 to-amber-400 transition-all group-hover:w-full duration-300"></span>
          </a>
          </div>

          <button
            className={`mt-10 px-8 py-3 text-lg font-semibold text-white rounded-xl shadow transition-all duration-200 outline-none
              ${isHovered ? "bg-indigo-800" : "bg-white/10"}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => router.push("/")}
          >
            Back to Home
          </button>

        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
}
