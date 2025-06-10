import Image from "next/image";

export default function ThinkSecc() {
  return (
    <section className="relative w-full min-h-[400px] flex flex-col sm:flex-row items-center justify-center bg-[#0a0c23] py-12 px-2">
      <div className="w-full sm:w-1/2 flex flex-col items-center justify-center mb-6 sm:mb-0">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 text-center">
          Reach your goals with <span className="text-indigo-400">confidence</span>
        </h2>
      </div>
      <div className="w-full sm:w-1/2 flex items-center justify-center group">
        <Image
          src="/brands/thinksec.png"
          alt="Data Hero Section"
          width={1200}
          height={800}
          className="w-full max-w-4xl h-auto object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 95vw, (max-width: 1200px) 80vw, 1200px"
          priority
        />
      </div>
    </section>
  );
}