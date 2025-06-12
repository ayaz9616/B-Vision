import { useEffect, useRef } from "react";
import { FaChartLine, FaSearch, FaBalanceScale, FaUsers, FaStore, FaFileDownload } from "react-icons/fa";

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const sectionRect = section.getBoundingClientRect();
      if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
        const elements = section.querySelectorAll(".animate-on-scroll");
        elements.forEach((el: Element) => {
          (el as HTMLElement).classList.add("animated");
        });
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="w-full bg-[#0a0c23] py-16 px-4 flex flex-col items-center"
      ref={sectionRef}
    >
      <div className="mb-4">
        <span className="px-4 py-1 rounded-full bg-[#18192a] text-indigo-300 text-xs font-semibold tracking-wide shadow animate-fade-in animate-on-scroll">
          Powerful Insights at Your Fingertips
        </span>
      </div>
      <h2
        className="text-3xl sm:text-5xl font-extrabold text-white mb-4 text-center opacity-0 animate-fade-in-down animate-on-scroll"
        style={{ animationFillMode: "forwards", animationDelay: "0.2s" }}
      >
        Unlock <span className="text-indigo-400">Deep Analytics</span>
      </h2>
      <p className="text-slate-300 text-base sm:text-lg mb-12 max-w-2xl text-center animate-fade-in animate-on-scroll">
        Transform raw customer reviews into actionable insights. Our AI-powered sentiment platform analyzes feature-level feedback, tracks trends, compares products, and helps businesses make smarter decisions backed by real data.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          {
            icon: <FaSearch className="text-3xl text-indigo-400 mb-3 animate-bounce" />,
            title: "Feature-Level Sentiment",
            desc: "Pinpoint opinions on specific features like camera, battery, display, and more.",
            delay: "delay-0"
          },
          {
            icon: <FaChartLine className="text-3xl text-indigo-400 mb-3 animate-pulse" />,
            title: "Trend & Monthly Analytics",
            desc: "Visualize how customer sentiment evolves over time, month-by-month.",
            delay: "delay-100"
          },
          {
            icon: <FaBalanceScale className="text-3xl text-indigo-400 mb-3 animate-bounce" />,
            title: "Brand & Product Comparison",
            desc: "Compare competing models and brands across key sentiment metrics.",
            delay: "delay-200"
          },
          {
            icon: <FaUsers className="text-3xl text-indigo-400 mb-3 animate-pulse" />,
            title: "Demographic Insights",
            desc: "Segment sentiment data by age, gender, and verified purchase status.",
            delay: "delay-300"
          },
          {
            icon: <FaStore className="text-3xl text-indigo-400 mb-3 animate-bounce" />,
            title: "Platform & Rating Analysis",
            desc: "Break down sentiment by star ratings and e-commerce platforms.",
            delay: "delay-400"
          },
          {
            icon: <FaFileDownload className="text-3xl text-indigo-400 mb-3 animate-pulse" />,
            title: "Exportable PDF Reports",
            desc: "Download complete, filterable reports for in-depth analysis.",
            delay: "delay-500"
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center bg-[#18192a] rounded-2xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-2 hover:scale-105 duration-300 opacity-0 animate-fade-in-up animate-on-scroll ${feature.delay}`}
            style={{ animationFillMode: "forwards", animationDelay: `${idx * 0.15 + 0.5}s` }}
          >
            {feature.icon}
            <div className="text-white font-semibold text-lg mb-1 text-center">{feature.title}</div>
            <div className="text-slate-400 text-sm text-center">{feature.desc}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 1s ease forwards; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-40px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fade-in-down { animation: fade-in-down 1s cubic-bezier(0.4,0,0.2,1) forwards; }
        .delay-0 { animation-delay: 0.5s; }
        .delay-100 { animation-delay: 0.65s; }
        .delay-200 { animation-delay: 0.8s; }
        .delay-300 { animation-delay: 0.95s; }
        .delay-400 { animation-delay: 1.1s; }
        .delay-500 { animation-delay: 1.25s; }
        .animate-on-scroll { opacity: 0; }
        .animate-on-scroll.animated { opacity: 1; }
      `}</style>
    </section>
  );
}
