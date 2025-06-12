"use client";

import Navbar from '../component/navBar';
import { motion } from "framer-motion";

export default function ContactPage() {
  const people = [
    { name: "Mohammad Ayaz", email: "ayaz9616835404@gmail.com" },
    { name: "Tushar Patel", email: "tushar789patel@gmail.com" },
    { name: "Ayush Kumar Singh", email: "ayushkmac@gmail.com" },
    { name: "Ishant Singh", email: "ishant24singh@gmail.com" },
    { name: "Param Preet Singh", email: "vanshbagga2020@gmail.com" },
  ];

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center justify-center relative overflow-hidden px-4 ">
      <div className='mt-15'>
      <Navbar />

      {/* Background floating blobs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-0 left-0"></div>
      <div className="absolute w-[600px] h-[600px] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-0 right-0"></div>

      <motion.section
        className="backdrop-blur-md bg-[#15193c]/80 rounded-2xl shadow-2xl p-10 max-w-xl w-full relative z-10"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-extrabold text-center text-white mb-8">
          Meet the <span className="text-indigo-400">Team</span>
        </h2>

        <ul className="space-y-6">
          {people.map((person, index) => (
            <motion.li
              key={person.email}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-[#23285a] to-[#1a1f4a] rounded-xl px-6 py-4 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <span className="text-white font-semibold text-lg">{person.name}</span>
              <a
                href={`mailto:${person.email}`}
                className="text-indigo-300 hover:underline text-sm sm:text-base mt-2 sm:mt-0"
              >
                {person.email}
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.section>
      </div>
    </main>
  );
}
