import Image from "next/image";

export default function DataHeroSection() {
  return (
    <section className="relative w-full min-h-[400px] flex items-center justify-center bg-[#0a0c23] py-12 px-2">
      <div className="w-full flex items-center justify-center relative group">
        {/* Top text overlay */}
        <div className=" text-3xl sm:text-5xl absolute -top-14 left-1/2 -translate-x-1/2 z-20 text-center w-full px-4 pointer-events-none">
          
        </div>
        <Image
          src="/brands/3rdsec.png"
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