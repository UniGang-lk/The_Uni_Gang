import { LuGraduationCap, LuActivity, LuUsers, LuBook, LuGlobe, LuApple } from 'react-icons/lu';
import { SiGoogleplay, SiHuawei } from 'react-icons/si';
import { motion } from 'framer-motion';
// import PremiumTraceButton from '../ui/PremiumTraceButton';

const Hero = () => {
  return (
    <section id="home" className="relative w-full min-h-screen flex items-center justify-center px-4 lg:px-12 2xl:px-20 max-w-7xl 2xl:max-w-[1600px] mx-auto overflow-hidden pt-20 pb-10">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 2xl:gap-24 items-center w-full">
        {/* Left Content Column */}
        <div className="space-y-8 order-2 lg:order-1 relative z-10">
          <div className="space-y-6 animate-fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl 2xl:text-8xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight font-sans">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 text-3xl sm:text-5xl lg:text-7xl 2xl:text-8xl">Uni Gang World</span>
            </h1>
            <p className="text-xl 2xl:text-2xl text-slate-600 dark:text-slate-400 max-w-xl 2xl:max-w-2xl leading-relaxed font-light">
              Experience the future of student collaboration. Connect with elite campuses, track your academic milestones, and join a global network of innovators in an environment designed for modern excellence.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 animate-fade-up [animation-delay:200ms]">
            <AppStoreButton 
              icon={<LuApple className="text-2xl" />}
              label="Download on the"
              store="App Store"
              href="#"
            />
            <AppStoreButton 
              icon={<SiGoogleplay className="text-xl" />}
              label="Get it on"
              store="Google Play"
              href="#"
            />
            <AppStoreButton 
              icon={<SiHuawei className="text-xl" />}
              label="Explore it on"
              store="AppGallery"
              href="#"
            />
          </div>
        </div>

        {/* Right Visual Column */}
        <div className="relative order-1 lg:order-2 flex justify-center items-center animate-fade-right [animation-delay:400ms]">
          {/* Main Image Frame with Soft Frosted Glass */}
          <div className="relative w-full max-w-[14rem] sm:max-w-[18rem] lg:max-w-[22rem] 2xl:max-w-[30rem] aspect-[3/4] rounded-[3rem] overflow-hidden shadow-[0px_40px_80px_rgba(220,38,246,0.15)] border-[10px] border-white/40 dark:border-slate-800/40 backdrop-blur-xl z-10 bg-white/20 dark:bg-slate-900/20">
            <img
              alt="Modern University Architecture"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRFV7zovlhxOqNLIlMHmIV8r4A8byd5D4NvJlHk_apI8EpkWiMlGBbSFZxhO74seWe_R6-XvzvN6-XAJCX7Ys5PyPLPo6T7HSGAfid5fB02VsRMX0v9MjPy5W_YSGqOvMaEQw6usHEXlCJOOWwjczK51PTTkCtv7YJOeVWwMN6DMqZWFqW5BC2RgJXtNh8Aq9eYplzYIM_M0inQeE8cUxq-kByRJltNoMGkrZYfHY1KQtnheVXT4q7RSYp-CB4zBiMF6Q9FadmuYxl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none"></div>
          </div>

          {/* Floating Glass Status Cards */}
          <div className="absolute -top-8 -right-4 lg:-right-12 glass-card p-4 rounded-3xl shadow-xl hidden sm:flex items-center gap-4 z-20 animate-[float_4s_ease-in-out_infinite]">
            <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-blue-900/40 flex items-center justify-center">
              <LuActivity className="text-brand-600 dark:text-blue-400 text-xl" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Live Campus Pulse</p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">Active Now</p>
            </div>
          </div>

          <div className="absolute -bottom-10 -left-4 lg:-left-12 glass-card p-4 rounded-3xl shadow-xl flex items-center gap-4 z-20 animate-[float_5s_ease-in-out_infinite_reverse]">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <LuUsers className="text-indigo-600 dark:text-indigo-400 text-xl" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Student Stats</p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">12k+ Global</p>
            </div>
          </div>

          {/* Decorative Floating 3D Icons */}
          <div className="absolute top-1/4 -left-8 sm:-left-16 w-16 h-16 rounded-2xl glass-card flex items-center justify-center shadow-lg transform -rotate-12 z-20 animate-[float_6s_ease-in-out_infinite]">
            <LuBook className="text-blue-600 text-3xl" />
          </div>
          <div className="absolute bottom-1/4 -right-6 sm:-right-12 w-20 h-20 rounded-full glass-card flex items-center justify-center shadow-lg transform rotate-12 bg-white/80 dark:bg-slate-800/80 z-20 animate-[float_4.5s_ease-in-out_infinite]">
            <LuGraduationCap className="text-indigo-600 text-4xl" />
          </div>
          <div className="absolute top-10 right-4 sm:right-10 w-12 h-12 rounded-full glass-card flex items-center justify-center shadow-md z-20 animate-[float_5.5s_ease-in-out_infinite_reverse]">
            <LuGlobe className="text-blue-400 text-2xl" />
          </div>

        </div>
      </div>

      {/* Connection Dots / Background Patterns */}
      <div className="absolute top-0 right-0 p-12 sm:p-24 opacity-10 pointer-events-none hidden sm:block">
        <div className="grid grid-cols-6 gap-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-blue-600 rounded-full"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AppStoreButton = ({ icon, label, store, href }: { icon: React.ReactNode; label: string; store: string; href: string }) => (
  <motion.a
    href={href}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="group relative flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 dark:bg-slate-900/10 backdrop-blur-xl border border-white/20 dark:border-slate-800/20 shadow-lg hover:shadow-xl hover:bg-white/20 dark:hover:bg-slate-800/30 transition-all duration-300 overflow-hidden"
  >
    {/* Animated background glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative z-10 text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
      {icon}
    </div>
    
    <div className="relative z-10 flex flex-col items-start leading-none">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </span>
      <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {store}
      </span>
    </div>
  </motion.a>
);

export default Hero;
