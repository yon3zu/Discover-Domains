"use client"; // Penanda agar file ini menjadi Client Component

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion untuk animasi

export default function Home() {
  const [domains, setDomains] = useState([]);
  const [visibleDomains, setVisibleDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const MAX_DOMAINS = 100; // Batasi jumlah domain yang ditampilkan

  useEffect(() => {
    const startPolling = () => {
      fetchDomains();
      const pollingInterval = setTimeout(startPolling, 5000); // Polling setiap 5 detik
      return () => clearTimeout(pollingInterval); // Bersihkan polling jika komponen di-unmount
    };

    startPolling();
  }, []);

  const fetchDomains = () => {
    axios
      .get('/api/fetch-domains') // Menggunakan endpoint proxy di Next.js
      .then((response) => {
        const domainData = response.data.domains.map((domain) => ({
          name: domain,
          timestamp: new Date().toLocaleString(),
        }));

        let index = 0;

        const updateDomains = () => {
          // Pengecekan jika `domainData[index]` ada dan memiliki properti `name`
          if (index < domainData.length && domainData[index] && domainData[index].name) {
            // Pastikan tidak ada duplikasi domain
            setVisibleDomains((prev) => {
              // Tambahkan pengecekan apakah domainData[index] ada dan name tidak undefined
              if (domainData[index] && domainData[index].name && !prev.some((item) => item.name === domainData[index].name)) {
                const newDomains = [domainData[index], ...prev];
                return newDomains.slice(0, MAX_DOMAINS); // Batasi jumlah domain yang ditampilkan
              }
              return prev; // Jangan tambahkan duplikat
            });
          }
          index++;
          setTimeout(updateDomains, 500); // Lanjutkan untuk domain berikutnya setiap 80ms
        };

        updateDomains(); // Mulai memperbarui domain
      })
      .catch((error) => {
        console.error('Error fetching domains:', error);
      });
  };

  const filteredDomains = visibleDomains.filter((domain) =>
    domain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Navbar */}
      <nav className="navbar flex justify-between items-center px-6 py-4 bg-gray-800 shadow-lg">
        <a className="text-2xl text-blue-400 font-bold flex items-center" href="#">
          <i className="fas fa-shield-alt mr-2"></i> Domain Discovery
        </a>
        <ul className="flex space-x-4">
          <li>
            <a className="text-white hover:text-blue-400" href="#">Home</a>
          </li>
          <li>
            <a className="text-white hover:text-blue-400" href="https://xreverselabs.org">xReverseLabs</a>
          </li>
          <li>
            <a className="text-white hover:text-blue-400" href="https://xreverselabs.docs.apiary.io/">API</a>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto mt-12 text-center flex-grow flex flex-col">
        <h1 className="search-engine text-4xl md:text-6xl font-bold text-blue-400">
          <i className="fas fa-globe mr-2"></i> Domain Discovery Engine
        </h1>
        <h3 className="header-2 text-lg mt-4 text-gray-300">
          A Powerful Project From xReverseLabs
        </h3>

        {/* Search Input */}
        <div className="mt-8">
          <input
            type="text"
            placeholder="Search domain..."
            className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:border-blue-500 text-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Domain List */}
        <div className="mt-8 flex-grow overflow-hidden">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full overflow-hidden max-h-96"> {/* Batasi tinggi dengan max-height */}
            <AnimatePresence>
              {filteredDomains.length > 0 ? (
                filteredDomains.map((domain, index) => (
                  <motion.div
                    key={domain.name}
                    initial={{ opacity: 0, y: -20 }} // Memulai dari atas
                    animate={{ opacity: 1, y: 0 }}   // Muncul ke posisi normal
                    exit={{ opacity: 0, y: 20 }}      // Animasi keluar saat dihapus
                    transition={{ duration: 0.3, delay: index * 0.05 }} // Percepat animasi dengan delay 0.05s
                    className="flex justify-between py-2 px-4 border-b border-gray-700 hover:bg-gray-700 transition-all"
                  >
                    <span className="text-blue-400"><i className="fas fa-globe mr-2"></i>{domain.name}</span>
                    <span>{domain.timestamp}</span>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="no-domains"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-3 text-gray-400"
                >
                  No domains discovered.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <br />
          <p>Real-time updates (sampled at 200ms per entry) from our ingestion pipeline</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-4 text-center text-gray-400 mt-8 w-full">
        &copy; 2024 Domain Discovery - All Rights Reserved
      </footer>
    </div>
  );
}
