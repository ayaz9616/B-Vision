import { useEffect, useRef } from "react";
import { FaMicrophone, FaRegFileAlt, FaListAlt, FaSpellCheck, FaSave } from "react-icons/fa";

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const sectionRect = section.getBoundingClientRect();
      // Only trigger when section is in viewport
      if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
        const elements = section.querySelectorAll(".animate-on-scroll");
        elements.forEach((el: Element) => {
          (el as HTMLElement).classList.add("animated");
        });
        // Remove scroll listener after animation triggers
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once in case already in view
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
          All your notes, connected
        </span>
      </div>
      <h2
        className="text-3xl sm:text-5xl font-extrabold text-white mb-4 text-center opacity-0 animate-fade-in-down animate-on-scroll"
        style={{ animationFillMode: "forwards", animationDelay: "0.2s" }}
      >
        Give Yourself <span className="text-indigo-400">Superpowers</span>
      </h2>
      <p className="text-slate-300 text-base sm:text-lg mb-12 max-w-2xl text-center animate-fade-in animate-on-scroll">
        Mirror the way your mind works by associating notes through backlinks.<br className="hidden sm:block" />
        Reflect builds you a second brain that you can reference anytime.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          {
            icon: <FaMicrophone className="text-3xl text-indigo-400 mb-3 animate-bounce" />,
            title: "Transcribe voice notes",
            desc: "with human-level accuracy",
            delay: "delay-0"
          },
          {
            icon: <FaRegFileAlt className="text-3xl text-indigo-400 mb-3 animate-pulse" />,
            title: "Generate article outlines",
            desc: "from your scattered thoughts",
            delay: "delay-100"
          },
          {
            icon: <FaListAlt className="text-3xl text-indigo-400 mb-3 animate-bounce" />,
            title: "List key takeaways and action",
            desc: "items from your meeting notes",
            delay: "delay-200"
          },
          {
            icon: <FaSpellCheck className="text-3xl text-indigo-400 mb-3 animate-pulse" />,
            title: "Fix grammar, spelling,",
            desc: "and improve your writing",
            delay: "delay-300"
          },
          {
            icon: <FaSpellCheck className="text-3xl text-indigo-400 mb-3 animate-bounce" />,
            title: "Fix grammar, spelling,",
            desc: "and improve your writing",
            delay: "delay-400"
          },
          {
            icon: <FaSave className="text-3xl text-indigo-400 mb-3 animate-pulse" />,
            title: "Save your own",
            desc: "custom prompts",
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
      {/* Tailwind custom keyframes for fade-in and fade-in-up */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-down {
          animation: fade-in-down 1s cubic-bezier(0.4,0,0.2,1) forwards;
        }
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