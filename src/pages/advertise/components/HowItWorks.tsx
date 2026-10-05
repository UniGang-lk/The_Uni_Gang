import { motion } from 'framer-motion';
import { LuSend, LuShieldCheck, LuTrendingUp } from 'react-icons/lu';

const STEPS = [
  {
    icon: LuSend,
    title: 'Submit Your Campaign',
    desc: 'Fill a 2-minute form with your artwork and details. No account needed.',
  },
  {
    icon: LuShieldCheck,
    title: 'Quick Review',
    desc: 'Our ad desk checks your artwork and confirms pricing via WhatsApp or email within 2–4 hours.',
  },
  {
    icon: LuTrendingUp,
    title: 'Go Live & Track',
    desc: 'Your ad goes live on the selected placements and we share view & click reports.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="space-y-12 scroll-mt-24">
      <div className="text-center space-y-3">
        <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">How It Works</span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Live in 3 Simple Steps
        </h2>
      </div>

      <div className="relative grid md:grid-cols-3 gap-10 md:gap-6">
        {/* Connector line (desktop) */}
        <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-0.5 bg-slate-200 dark:bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </div>

        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.25 }}
            className="relative text-center space-y-4"
          >
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/30 z-10">
              <step.icon className="w-7 h-7" />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-600 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center justify-center">
                {i + 1}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">{step.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
