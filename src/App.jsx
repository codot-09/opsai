import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Brain, 
  Cpu, 
  Activity, 
  MessageSquare, 
  Zap, 
  ChevronRight, 
  Check, 
  Menu, 
  X, 
  Terminal, 
  Command,
  ArrowRight,
  Shield,
  Layers,
  Globe
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for Tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        scrolled ? "bg-black/50 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <Brain className="w-6 h-6" /> OpsAI
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-white/70">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors">
          Get Started
        </button>
      </div>
    </motion.nav>
  );
};

const TerminalSimulation = () => {
  const [text, setText] = useState("");
  const fullText = "Draft a Q3 marketing strategy and sync it with CRM.";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-white/5 px-4 py-2 flex items-center gap-2 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
        <span className="text-[10px] text-white/30 font-mono ml-2 uppercase tracking-widest">OpsAI Terminal v1.0</span>
      </div>
      <div className="p-6 font-mono text-sm leading-relaxed">
        <div className="flex gap-2">
          <span className="text-white/40">admin@opsai:~$</span>
          <span className="text-white">{text}<span className="animate-pulse">_</span></span>
        </div>
        
        <AnimatePresence>
          {text === fullText && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 space-y-2"
            >
              <div className="text-blue-400 flex items-center gap-2">
                <ChevronRight className="w-3 h-3" /> Analyzing request...
              </div>
              <div className="text-emerald-400 flex items-center gap-2">
                <Check className="w-3 h-3" /> Tasks distributed to Agent Team.
              </div>
              <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-white/50">Manager Agent status</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">Executing</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="h-full bg-white/50"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const NodeOrchestration = () => {
  return (
    <div className="relative w-full h-[300px] flex items-center justify-center">
      {/* Manager Node */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="z-10 bg-white text-black p-4 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] flex flex-col items-center gap-1"
      >
        <Brain className="w-8 h-8" />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Manager</span>
      </motion.div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path 
          d="M 50% 50% L 20% 80%" 
          stroke="white" 
          strokeWidth="0.5" 
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          fill="none"
          className="opacity-20"
        />
        <motion.path 
          d="M 50% 50% L 80% 80%" 
          stroke="white" 
          strokeWidth="0.5" 
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          fill="none"
          className="opacity-20"
        />
      </svg>

      {/* Sub-Agents */}
      <div className="absolute top-[220px] left-[15%] flex flex-col items-center gap-1">
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
          <Cpu className="w-5 h-5 text-white/70" />
        </div>
        <span className="text-[8px] uppercase text-white/40">Marketing</span>
      </div>
      <div className="absolute top-[220px] right-[15%] flex flex-col items-center gap-1">
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
          <Layers className="w-5 h-5 text-white/70" />
        </div>
        <span className="text-[8px] uppercase text-white/40">CRM</span>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, type: "spring" }}
      className="group relative p-8 bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
    >
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 80%)`,
        }}
      />
      <Icon className="w-8 h-8 mb-6 text-white/80 group-hover:text-white transition-colors" />
      <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

const DashboardPreview = () => {
  return (
    <div className="relative mt-20 p-4 md:p-8 bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-4">Live Status</span>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium">9 Agents Active</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: "80%" }} className="h-full bg-white/40" />
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: "45%" }} className="h-full bg-white/20" />
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: "90%" }} className="h-full bg-white/60" />
            </div>
          </div>
        </div>

        <div className="md:col-span-3 bg-black/40 border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-sm font-semibold">Active Orchestrations</h4>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { id: "OP-492", task: "Marketing Flow Sync", status: "Running", progress: 65 },
              { id: "OP-493", task: "Customer Support L2", status: "Active", progress: 88 },
              { id: "OP-494", task: "E-comm Inventory Bot", status: "Pending", progress: 0 }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-mono text-white/30">{item.id}</span>
                <span className="flex-1 text-xs font-medium">{item.task}</span>
                <div className="hidden md:flex w-32 h-1.5 bg-white/5 rounded-full overflow-hidden mx-4">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.progress}%` }} className="h-full bg-white/40" />
                </div>
                <span className={cn(
                  "text-[9px] px-2 py-0.5 rounded-full border",
                  item.status === 'Running' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : 
                  item.status === 'Active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  "bg-white/5 text-white/40 border-white/10"
                )}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-black">
      <div className="container mx-auto px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold tracking-tighter mb-6"
        >
          Simple, transparent pricing.
        </motion.h2>
        
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={cn("text-sm", !yearly ? "text-white" : "text-white/40")}>Monthly</span>
          <button 
            onClick={() => setYearly(!yearly)}
            className="w-12 h-6 bg-white/10 rounded-full relative p-1 transition-colors hover:bg-white/20"
          >
            <motion.div 
              animate={{ x: yearly ? 24 : 0 }}
              className="w-4 h-4 bg-white rounded-full"
            />
          </button>
          <span className={cn("text-sm", yearly ? "text-white" : "text-white/40")}>Yearly <span className="text-emerald-400 text-[10px] font-bold ml-1">-20%</span></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Starter", monthly: 29, yearly: 24, features: ["1 AI Manager", "2 Agents", "Standard Support"] },
            { name: "Pro", monthly: 79, yearly: 64, features: ["2 AI Managers", "5 Agents", "Priority Support", "Team API"], featured: true },
            { name: "Business", monthly: 149, yearly: 119, features: ["Unlimited Power", "Custom Training", "Dedicated Success"] }
          ].map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-10 rounded-3xl border transition-all duration-500 relative",
                plan.featured ? "bg-white text-black border-white scale-105 z-10" : "bg-[#0a0a0a] border-white/10 text-white"
              )}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 tracking-tighter uppercase">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="text-5xl font-bold tracking-tighter">${yearly ? plan.yearly : plan.monthly}</span>
                <span className={cn("text-sm", plan.featured ? "text-black/60" : "text-white/40")}>/mo</span>
              </div>
              <ul className="text-left space-y-4 mb-10">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <Check className={cn("w-4 h-4", plan.featured ? "text-black" : "text-emerald-500")} /> 
                    <span className={plan.featured ? "text-black/80" : "text-white/70"}>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={cn(
                "w-full py-4 rounded-xl font-bold text-sm transition-transform active:scale-[0.98]",
                plan.featured ? "bg-black text-white hover:bg-black/90" : "bg-white text-black hover:bg-white/90"
              )}>
                Start with {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

export default function App() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-white/50">
              Introducing OpsAI v1.0
            </span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] max-w-4xl mx-auto">
              Hire an AI team <br className="hidden md:block" />
              <span className="text-white/40">instead of employees.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              OpsAI provides ready-to-use AI teams that handle your business operations — from marketing to customer support.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-24">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-full font-bold shadow-xl shadow-white/10 hover:bg-white/90 transition-all flex items-center justify-center gap-2 group"
              >
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-8 py-4 bg-transparent text-white border border-white/10 rounded-full font-bold hover:bg-white/5 transition-all"
              >
                See Demo
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            style={{ scale, opacity }}
            className="flex flex-col items-center gap-12"
          >
            <TerminalSimulation />
            <NodeOrchestration />
          </motion.div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="py-24 bg-black relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Designed for scale.</h2>
              <p className="text-white/50 text-lg leading-relaxed">
                Our platform automates the complex orchestration of multiple specialized AI agents, so you can focus on building.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Brain} 
              title="AI Manager" 
              description="Intelligent task orchestration and quality control for every assignment. No prompts needed."
              delay={0.1}
            />
            <FeatureCard 
              icon={Cpu} 
              title="Specialized Agents" 
              description="Proprietary models tuned for CRM, Marketing, and Support operations. Peak performance."
              delay={0.2}
            />
            <FeatureCard 
              icon={Activity} 
              title="Real-time Tracking" 
              description="Watch your team work in real-time with granular state management and feedback loops."
              delay={0.3}
            />
          </div>

          <DashboardPreview />
        </div>
      </section>

      {/* How It Works Diagram Section */}
      <section id="how" className="py-24 bg-black border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 text-emerald-200">The Operations Engine.</h2>
            <p className="text-white/50 max-w-2xl mx-auto">A mechanical visualization of how OpsAI processes your business logic from input to reality.</p>
          </div>

          <div className="relative max-w-4xl mx-auto aspect-video glass rounded-3xl p-12 flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <Terminal className="w-10 h-10 text-white/40" />
              <span className="text-[10px] uppercase font-bold text-white/30">User Task</span>
            </div>
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-32 h-32 border border-white/20 rounded-full flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-white/5 rounded-full blur-xl" />
              <div className="bg-white text-black p-4 rounded-xl relative z-10">
                <Brain className="w-8 h-8" />
              </div>
            </motion.div>

            <div className="flex flex-col gap-8">
              {[Zap, Globe, Shield].map((Icon, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <Icon className="w-6 h-6 text-white/40" />
                  </div>
                  <span className="text-[8px] uppercase font-bold text-white/20">Agent {i+1}</span>
                </div>
              ))}
            </div>

            {/* Connecting pulses */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <motion.path 
                d="M 100 50% L 350 50%" 
                stroke="white" 
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <Pricing />

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div>
              <div className="text-2xl font-bold tracking-tighter mb-4">OpsAI</div>
              <p className="text-white/40 text-sm max-w-xs">Elevating business operations with hyper-intelligent AI teams. No salaries required.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Product</h4>
                <div className="flex flex-col gap-2 text-sm text-white/50">
                  <a href="#" className="hover:text-white">Features</a>
                  <a href="#" className="hover:text-white">API</a>
                  <a href="#" className="hover:text-white">Showcase</a>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Company</h4>
                <div className="flex flex-col gap-2 text-sm text-white/50">
                  <a href="#" className="hover:text-white">About</a>
                  <a href="#" className="hover:text-white">Terms</a>
                  <a href="#" className="hover:text-white">Privacy</a>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-white/20 border-t border-white/5 pt-8">
            &copy; 2026 OpsAI TECHNOLOGIES GMBH. WORLDWIDE.
          </div>
        </div>
      </footer>
    </div>
  );
}
