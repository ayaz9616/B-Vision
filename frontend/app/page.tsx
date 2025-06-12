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