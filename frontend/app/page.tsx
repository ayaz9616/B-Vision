// // 'use client';
// // import { useRouter } from 'next/navigation';

// // export default function Home() {
// //   const router = useRouter();

// //   return (
// //     <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
// //       <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4 flex items-center gap-2">
// //         <span role="img" aria-label="Smartphone">📱</span> Smart Review Sentiment Analyzer
// //       </h1>
// //       <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl text-center">
// //         Upload customer reviews and visualize feature-based sentiment.
// //       </p>
// //       <button
// //         className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-pink-500 hover:to-blue-500 text-white font-semibold rounded-full px-8 py-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 text-lg"
// //         onClick={() => router.push('/upload')}
// //       >
// //         Start Analysis
// //       </button>
// //     </main>
// //   );
// // }





// // pages/index.tsx
// 'use client';
// import { useRouter } from 'next/navigation';

// export default function Home() {
//   const router = useRouter();

//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
//       <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//         <span role="img" aria-label="Smartphone">📱</span> Smart Review Sentiment Analyzer
//       </h1>
//       <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl text-center">
//         Upload customer reviews and visualize feature-based sentiment.
//       </p>
//       <button
//         className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-pink-500 hover:to-blue-500 text-white font-semibold rounded-full px-8 py-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 text-lg"
//         onClick={() => router.push('/upload')}
//       >
//         Start Analysis
//       </button>
//     </main>
//   );
// }










// 'use client';
// import FeaturesSection from './component/2ndcom';
// import DataHeroSection from './component/3rdcom';
// import Footer from './component/footer';
// import HomePage from './component/HomePage';
// import Navbar from './component/navBar';
// import TestimonialSection from './component/testimonial';
// import ThinkSecc from './component/think';

// export default function Home() {
//   return (
//     <>
//       <HomePage />
//       <Navbar />
//       <FeaturesSection/>
//       <DataHeroSection/>
//        <ThinkSecc/>
//       <TestimonialSection/>
//       <Footer/>
//     </>
//   );
// }





'use client';
import FeaturesSection from './component/2ndcom';
import DataHeroSection from './component/3rdcom';
import Footer from './component/footer';
import HomePage from './component/HomePage';
import Navbar from './component/navBar';
import TestimonialSection from './component/testimonial';
import ThinkSecc from './component/think';

export default function Home() {
  return (
    <>
      <HomePage />
      <Navbar />
      <FeaturesSection/>
      <DataHeroSection/>
       <ThinkSecc/>
      <TestimonialSection/>
      <Footer/>
      

    </>
  );
}