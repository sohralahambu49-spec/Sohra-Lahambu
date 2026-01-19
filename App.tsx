
import React, { useState, useEffect, useCallback } from 'react';
import { SCHOOL_NAME, GRADUATION_YEAR, ICONS, CLASS_NAME } from './constants';
import { findStudentByNISN } from './data/mockData';
import { GraduationStatus, Student } from './types';
import { generatePersonalizedMessage } from './services/geminiService';

const App: React.FC = () => {
  const [nisn, setNisn] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ student: Student; aiMessage: string } | null>(null);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date('2026-05-15T10:00:00'); // Example graduation date
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nisn.length < 10) {
      setError('NISN harus 10 digit.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    // Simulate network delay
    setTimeout(async () => {
      const student = findStudentByNISN(nisn);
      if (student) {
        const aiMessage = await generatePersonalizedMessage(student);
        setResult({ student, aiMessage });
      } else {
        setError('NISN tidak ditemukan dalam database. Pastikan input benar.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full -z-10 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Header */}
      <nav className="p-6 md:px-12 flex justify-between items-center sticky top-0 z-50 glass-dark">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <ICONS.School />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight hidden sm:block">
            {SCHOOL_NAME} <span className="text-blue-400">2026</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Portal</a>
          <a href="#" className="hover:text-white transition-colors">Alumni</a>
          <a href="#" className="hover:text-white transition-colors">Bantuan</a>
        </div>
        <button className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full text-sm font-semibold transition-all border border-white/10">
          Kontak Admin
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
            Pengumuman Kelulusan Resmi
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 leading-tight">
            Rayakan <span className="gradient-text">Keberhasilan</span> <br />
            Angkatan {GRADUATION_YEAR}
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light mb-8">
            Portal resmi SMAN 1 TOJO untuk melihat hasil perjuangan belajar Anda selama 3 tahun terakhir. Masukkan NISN Anda untuk memulai.
          </p>

          {/* Countdown Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto mb-12">
            {[
              { label: 'Hari', value: countdown.days },
              { label: 'Jam', value: countdown.hours },
              { label: 'Menit', value: countdown.mins },
              { label: 'Detik', value: countdown.secs },
            ].map((item, idx) => (
              <div key={idx} className="glass p-3 rounded-2xl flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-heading font-bold">{String(item.value).padStart(2, '0')}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto group">
            <form onSubmit={handleSearch} className="relative z-10">
              <input 
                type="text" 
                maxLength={10}
                placeholder="Masukkan NISN Anda (Contoh: 0012345678)" 
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 pr-40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all text-lg"
                value={nisn}
                onChange={(e) => setNisn(e.target.value.replace(/\D/g, ''))}
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 bg-gradient-to-tr from-blue-600 to-purple-600 px-8 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ICONS.Search />
                    Cek Status
                  </>
                )}
              </button>
            </form>
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          </div>
          {error && <p className="text-red-400 text-sm mt-4 font-medium">{error}</p>}
        </div>

        {/* Floating Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
          <FeatureCard 
            title="Akses Digital" 
            desc="Sertifikat kelulusan digital tersedia langsung setelah status diumumkan." 
            icon={<ICONS.GraduationCap />}
          />
          <FeatureCard 
            title="Keamanan Data" 
            desc="Sistem enkripsi 2026 memastikan data pribadi Anda tetap aman dan privat." 
            icon={<ICONS.Search />}
          />
          <FeatureCard 
            title="AI Support" 
            desc="Pesan motivasi dipersonalisasi oleh asisten AI SMAN 1 TOJO." 
            icon={<ICONS.Info />}
          />
        </div>
      </main>

      {/* Modal Result */}
      {result && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setResult(null)}></div>
          <div className="glass-dark max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className={`h-2 w-full ${result.student.status === GraduationStatus.LULUS ? 'bg-green-500' : 'bg-amber-500'}`}></div>
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Hasil Kelulusan Resmi</h2>
                  <p className="text-3xl font-heading font-bold">{result.student.name}</p>
                </div>
                <button 
                  onClick={() => setResult(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="glass p-4 rounded-2xl">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      {result.student.status === GraduationStatus.LULUS ? (
                        <>
                          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-2xl font-heading font-extrabold text-green-400">LULUS</span>
                        </>
                      ) : (
                        <>
                          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
                          <span className="text-2xl font-heading font-extrabold text-amber-400">TERTUNDA</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="glass p-4 rounded-2xl">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Kelas / Jurusan</p>
                    <p className="text-lg font-bold">{result.student.className} - {result.student.major}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center p-6 glass rounded-2xl border-blue-500/20 bg-blue-500/5">
                  <p className="text-xs text-blue-400 font-bold uppercase mb-2">Pesan AI SMAN 1 TOJO</p>
                  <p className="text-center italic text-slate-300 leading-relaxed font-light">
                    "{result.aiMessage}"
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-grow bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Unduh SKL Digital
                </button>
                <button className="sm:w-32 bg-white/5 hover:bg-white/10 h-12 rounded-xl font-bold transition-all border border-white/10 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="p-12 border-t border-white/5 glass-dark mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="font-heading font-bold text-lg mb-2">{SCHOOL_NAME}</p>
            <p className="text-slate-500 text-sm max-w-sm">Membangun Masa Depan Berbasis Karakter dan Inovasi. Tojo, Sulawesi Tengah.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="p-2 glass rounded-lg hover:text-blue-400 transition-all"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
            <a href="#" className="p-2 glass rounded-lg hover:text-pink-400 transition-all"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
          &copy; {GRADUATION_YEAR} {SCHOOL_NAME} Technical Team. Seluruh Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, desc, icon }) => {
  return (
    <div className="glass p-8 rounded-3xl hover:bg-white/10 transition-all border-white/5 group">
      <div className="mb-6 p-3 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-heading font-bold text-xl mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

export default App;
