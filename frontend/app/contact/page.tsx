import Navbar from '../component/navBar';
export default function ContactPage() {
  const people = [
    { name: "Mohammad Ayaz", email: "ayaz9616835404@gmail.com" },
    { name: "Tushar Patel", email: "bob.smith@email.com" },
    { name: "Ayush Kumar Singh", email: "ayushkmac@gmail.com" },
    { name: "Ishan Singh", email: "diana.patel@email.com" },
    { name: "Param Preet Singh", email: "vanshbagga2020@gmail.com" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#10143a] flex items-center justify-center px-4">
        <Navbar />
      <section className="bg-[#15193c] rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-indigo-100 mb-6 text-center">
          Contact <span className="text-indigo-400">Team</span>
        </h2>
        <ul className="space-y-4">
          {people.map((person) => (
            <li
              key={person.email}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#23285a] rounded-lg px-4 py-3"
            >
              <span className="text-white font-semibold">{person.name}</span>
              <a
                href={`mailto:${person.email}`}
                className="text-indigo-300 hover:underline mt-1 sm:mt-0"
              >
                {person.email}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}