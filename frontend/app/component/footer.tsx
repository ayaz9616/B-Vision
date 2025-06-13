export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0c23] border-t border-[#23243a] py-10 px-6 flex flex-col items-center relative overflow-hidden">

      <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500 opacity-10 rounded-full filter blur-3xl animate-pulse z-0"></div>
      <div className="absolute -bottom-32 right-10 w-[500px] h-[500px] bg-blue-500 opacity-10 rounded-full filter blur-3xl animate-pulse z-0"></div>

      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-6 z-10">
        <span className="text-slate-400 text-sm font-medium tracking-wide">
          © {new Date().getFullYear()} <span className="text-indigo-300 font-semibold">B-Vision</span>. All rights reserved.
        </span>
        <div className="flex gap-6">
          <a
            href="/privacy-policy"
            className="text-slate-400 hover:text-gradient transition-colors text-sm relative group"
          >
            Privacy Policy
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 via-green-400 to-amber-400 transition-all group-hover:w-full duration-300"></span>
          </a>
          <a
            href="/terms-of-service"
            className="text-slate-400 hover:text-gradient transition-colors text-sm relative group"
          >
            Terms of Service
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 via-green-400 to-amber-400 transition-all group-hover:w-full duration-300"></span>
          </a>
          <a
            href="https://github.com/ayaz9616/B-Vision"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-gradient transition-colors text-sm relative group"
          >
            GitHub
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 via-green-400 to-amber-400 transition-all group-hover:w-full duration-300"></span>
          </a>
        </div>
      </div>

    </footer>
  );
}
