import { useState } from 'react';
import { LuSearch, LuHeart, LuUser, LuGraduationCap, LuMapPin, LuBookOpen } from 'react-icons/lu';

interface ProposalSearchFilterBarProps {
  onSearch: (filters: {
    lookingFor: string;
    minAge: number;
    maxAge: number;
    religion: string;
    district: string;
    university: string;
    keyword: string;
  }) => void;
}

const ProposalSearchFilterBar = ({ onSearch }: ProposalSearchFilterBarProps) => {
  const [lookingFor, setLookingFor] = useState('Any');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(45);
  const [religion, setReligion] = useState('Any');
  const [district, setDistrict] = useState('Any');
  const [university, setUniversity] = useState('Any');
  const [keyword, setKeyword] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      lookingFor,
      minAge,
      maxAge,
      religion,
      district,
      university,
      keyword
    });
  };

  return (
    <div id="proposal-search-widget" className="relative max-w-6xl mx-auto mb-16 z-30">
      
      {/* Curved Capsule Glass Search Bar */}
      <div className="p-3 sm:p-4 rounded-[2.5rem] bg-white/90 dark:bg-slate-900/90 border border-rose-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-2xl transition-all duration-300">
        
        {/* Top Header Pill */}
        <div className="flex items-center justify-between px-4 pb-3 mb-2 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase tracking-widest">
            <LuHeart className="animate-pulse" size={16} /> Find Your Perfect Campus Match
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
            Smart Matching Filters
          </span>
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* 1. Looking For */}
          <div className="lg:col-span-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <label className="text-[9px] font-black text-rose-500 uppercase tracking-widest block mb-0.5 flex items-center gap-1">
              <LuUser size={12} /> Looking For
            </label>
            <select
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="Any" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Any Gender</option>
              <option value="Female" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Bride / Female</option>
              <option value="Male" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Groom / Male</option>
            </select>
          </div>

          {/* 2. Age Range */}
          <div className="lg:col-span-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <label className="text-[9px] font-black text-rose-500 uppercase tracking-widest block mb-0.5">
              Age Range
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={18}
                max={60}
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="w-1/2 bg-transparent text-xs font-bold text-slate-900 dark:text-white text-center outline-none"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                min={18}
                max={60}
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-1/2 bg-transparent text-xs font-bold text-slate-900 dark:text-white text-center outline-none"
              />
            </div>
          </div>

          {/* 3. Religion */}
          <div className="lg:col-span-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <label className="text-[9px] font-black text-rose-500 uppercase tracking-widest block mb-0.5 flex items-center gap-1">
              <LuBookOpen size={12} /> Religion
            </label>
            <select
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="Any" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Any Religion</option>
              <option value="Buddhism" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Buddhism</option>
              <option value="Christianity" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Christianity</option>
              <option value="Hinduism" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Hinduism</option>
              <option value="Islam" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Islam</option>
            </select>
          </div>

          {/* 4. District */}
          <div className="lg:col-span-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <label className="text-[9px] font-black text-rose-500 uppercase tracking-widest block mb-0.5 flex items-center gap-1">
              <LuMapPin size={12} /> District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="Any" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Any District</option>
              <option value="Colombo" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Colombo</option>
              <option value="Kandy" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Kandy</option>
              <option value="Gampaha" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Gampaha</option>
              <option value="Galle" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Galle</option>
            </select>
          </div>

          {/* 5. University */}
          <div className="lg:col-span-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <label className="text-[9px] font-black text-rose-500 uppercase tracking-widest block mb-0.5 flex items-center gap-1">
              <LuGraduationCap size={12} /> University
            </label>
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="Any" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">All Unis</option>
              <option value="Moratuwa" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Moratuwa</option>
              <option value="Peradeniya" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Peradeniya</option>
              <option value="Jayewardenepura" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">USJ / Japura</option>
              <option value="SLIIT" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">SLIIT</option>
            </select>
          </div>

          {/* 6. Keyword Search Input */}
          <div className="sm:col-span-2 lg:col-span-2">
            <input
              type="text"
              placeholder="Keyword (Doctor, Eng)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none"
            />
          </div>

          {/* 7. Search Button */}
          <div className="sm:col-span-2 lg:col-span-12">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/30 hover:scale-[1.01] active:scale-95 transition-all border-none cursor-pointer flex items-center justify-center gap-2"
            >
              <LuSearch size={16} /> Search Matches Now
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ProposalSearchFilterBar;
