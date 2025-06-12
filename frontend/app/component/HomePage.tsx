// 'use client';
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// function StartAnalysisButton() {
//   const router = useRouter();
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <button
//       className={`mt-10 px-8 py-3 text-lg font-semibold text-white rounded-xl shadow transition-all duration-200 outline-none
//         ${isHovered ? "bg-indigo-800" : "bg-white/10"}
//       `}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={() => router.push("/upload")}
//     >
//       Start Analysis
//     </button>
//   );
// }

// export default function HomePage() {
//   return (
//     <div className="relative min-h-screen w-full font-sans bg-[#0a0c23] overflow-hidden">
 
//       <div className="absolute -top-10 -left-10 w-[500px] h-[500px] bg-purple-500 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
//       <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-pink-500 opacity-10 rounded-full filter blur-2xl animate-pulse"></div>
//       <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full filter blur-2xl animate-pulse"></div>

//       <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2 sm:px-4">
//         <div className="mt-20 sm:mt-28 flex flex-col items-center bg-transparent rounded-3xl shadow-none p-0 max-w-2xl w-full text-center">

//           <div className="space-y-4 mb-8 max-w-xl">
//             <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-green-400 to-amber-400 font-extrabold text-3xl sm:text-5xl tracking-wide drop-shadow-lg animate-gradient-text">
//               Get the most from your <span className=" decoration-indigo-400 decoration-4">customer reviews</span>
//             </p>
//             <p className="text-indigo-300 font-semibold text-xl sm:text-2xl tracking-tight font-[‘Courier New’, monospace] animate-fade-in-up">
//               Transform feedback into <span className="text-green-400 font-bold">business growth</span> and innovation
//             </p>
//             <p className="text-white text-lg sm:text-xl font-light tracking-wide font-[‘Brush Script MT’, cursive] drop-shadow-md animate-fade-in-down">
//               Discover insights that <span className="text-indigo-400 font-semibold">drive smarter decisions</span>
//             </p>
//           </div>


//           <h1 className="text-2xl sm:text-5xl font-bold text-white mb-10 tracking-tight animate-gradient-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
//             Think better with{" "}
//             <span
//               className="font-semibold text-5xl text-indigo-400 tracking-wide"
//               style={{ fontFamily: "Inter, Segoe UI, Arial, sans-serif" }}
//             >
//               B-Vision
//             </span>
//           </h1>

//           <div className="inline-block bg-slate-800/70 text-white rounded-2xl px-4 py-2 font-medium text-sm sm:text-base mb-6 shadow animate-fade-in-down">
//             <span role="img" aria-label="new" className="mr-2">
//               ✨
//             </span>
//             Succeed with data
//           </div>


//           <StartAnalysisButton />
//         </div>
//       </main>

//       <style jsx>{`
//         @keyframes fade-in-down {
//           from {
//             opacity: 0;
//             transform: translateY(-30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-down {
//           animation: fade-in-down 1s cubic-bezier(0.4, 0, 0.2, 1) both;
//         }
//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-up {
//           animation: fade-in-up 1.2s 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
//         }
//         @keyframes gradient-text {
//           0%,
//           100% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//         }
//         .animate-gradient-text {
//           background-size: 200% 200%;
//           animation: gradient-text 4s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// }





'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";

function StartAnalysisButton() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`mt-10 px-8 py-3 text-lg font-semibold text-white rounded-xl shadow transition-all duration-200 outline-none
        ${isHovered ? "bg-indigo-800" : "bg-white/10"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push("/upload")}
    >
      Start Analysis
    </button>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full font-sans bg-[#0a0c23] overflow-hidden">
      <div className="absolute -top-10 -left-10 w-[500px] h-[500px] bg-purple-500 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-pink-500 opacity-10 rounded-full filter blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full filter blur-2xl animate-pulse"></div>
    
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2 sm:px-4">
        <div className="mt-20 sm:mt-28 flex flex-col items-center bg-transparent rounded-3xl shadow-none p-0 max-w-2xl w-full text-center">
          <div className="inline-block bg-slate-800/70 text-white rounded-2xl px-4 py-2 font-medium text-sm sm:text-base mb-6 shadow animate-fade-in-down">
            <span role="img" aria-label="new" className="mr-2">
              ✨
            </span>
            Succeed with data
          </div>
          <h1 className="text-2xl sm:text-5xl font-bold text-white mb-5 tracking-tight animate-fade-in-down bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Think better with{" "}
            <span
              className="text-2xl sm:text-5xl font-bold text-blue-400 mb-10"
              style={{ fontFamily: "Inter, Segoe UI, Arial, sans-serif" }}
            >
              B Vision
            </span>
          </h1>
          <div className="space-y-4 mb-0 max-w-xl">
            <p className="text-white sm:text-5xl font-bold tracking-wide drop-shadow-lg animate-fade-in-up bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
              <span className="decoration-indigo-400 decoration-4"></span>
            </p>
            <p className="text-white text-lg sm:text-xl font-light tracking-wide font-[‘Brush Script MT’, cursive] drop-shadow-md animate-fade-in-up">
              <span className="text-white font-semibold"> Get The Most From Your Customer Reviews & Transform feedback into business growth. Discover insights that drive smarter decisions</span>
            </p>
          </div>
          <StartAnalysisButton />
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
}