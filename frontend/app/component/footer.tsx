export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0c23] border-t border-[#23243a] py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-slate-400 text-sm">
          © {new Date().getFullYear()} Sentiment Analysis. All rights reserved.
        </span>
        <div className="flex gap-5">
          <a
            href="#"
            className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
          >
            Terms of Service
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}