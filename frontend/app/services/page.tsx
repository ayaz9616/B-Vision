import Image from "next/image";
import Navbar from '../component/navBar';
const analytics = [
  {
    title: "Feature-Level Sentiment",
    desc: "Pinpoint sentiment for specific features (e.g., camera, battery) in addition to overall review sentiment.",
    icon: "🔍",
  },
  {
    title: "Monthly & Trend Analytics",
    desc: "Track sentiment trends over time and visualize changes in customer perception month by month.",
    icon: "📈",
  },
  {
    title: "Brand & Product Comparison",
    desc: "Compare sentiment and review stats across brands, models, and platforms.",
    icon: "📊",
  },
  {
    title: "Demographic Insights",
    desc: "Analyze sentiment by gender, age, and verified purchase status for deeper audience understanding.",
    icon: "👥",
  },
  {
    title: "Platform & Rating Analysis",
    desc: "Break down sentiment by platform (Amazon, Flipkart, etc.) and by star ratings.",
    icon: "⭐",
  },
  {
    title: "Exportable Reports",
    desc: "Download full, filterable PDF reports of all analytics and visualizations.",
    icon: "📝",
  },
];

const businessHelp = [
  {
    icon: "💡",
    title: "Actionable Insights",
    desc: "Identify strengths and weaknesses in your products and services to drive strategic improvements.",
  },
  {
    icon: "📊",
    title: "Custom Business Reports",
    desc: "Receive comprehensive, easy-to-understand reports tailored to your KPIs and business goals.",
  },
  {
    icon: "🚀",
    title: "Boost Customer Satisfaction",
    desc: "Respond quickly to customer feedback and trends, improving loyalty and brand reputation.",
  },
  {
    icon: "🔗",
    title: "Cross-Platform Analysis",
    desc: "Unify data from multiple platforms for a holistic view of your market position.",
  },
  {
    icon: "⏱️",
    title: "Save Time & Resources",
    desc: "Automate the review analysis process, freeing your team for higher-value work.",
  },
];

export default function ProductUSP() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#10143a] via-[#181b23] to-[#0a0c23] flex flex-col items-center justify-center px-2 relative">

      <Navbar />
      <section className="w-full py-16 flex flex-col items-center relative">

        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-900 opacity-20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-800 opacity-20 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <div className="max-w-7xl w-full flex flex-col md:flex-row gap-12 items-center justify-between bg-white/5 backdrop-blur-xl rounded-3xl border border-[#23243a] shadow-2xl px-8 py-12">
      
          <div className="flex-1 flex flex-col gap-10">
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-100 mb-2 tracking-tight drop-shadow-lg">
                Our <span className="text-indigo-400">Analytics & Services</span>
              </h2>
              <p className="text-blue-200 text-lg mb-4 max-w-xl">
                Unlock deep, actionable insights from your customer reviews with our advanced, feature-aware sentiment analytics platform.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {analytics.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 bg-[#181b23]/80 rounded-2xl p-4 border border-[#23243a] hover:border-indigo-400 transition-colors"
                >
                  <span className="text-2xl sm:text-3xl mt-1">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-indigo-200 mb-1">{item.title}</h3>
                    <p className="text-blue-100 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-indigo-300 font-semibold mb-2 mt-8 text-base tracking-wide">
                How We Help Businesses
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {businessHelp.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#23243a]/80 border border-[#23243a] text-blue-100"
                  >
                    <span className="text-xl mt-1">{item.icon}</span>
                    <div>
                      <span className="font-semibold text-indigo-200">{item.title}</span>
                      <p className="text-xs text-blue-100">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-indigo-800/40 hover:scale-105 transition-transform duration-500 bg-[#181b23]/80">
              <Image
                src="/VISION.png"
                alt="Product Analytics Dashboard"
                width={600}
                height={450}
                className="object-contain w-full h-auto"
                priority
              />
            </div>
            <div className="absolute -z-10 -top-10 -right-10 w-60 h-60 bg-indigo-900 opacity-30 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
