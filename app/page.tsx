"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";

const styles = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes rotate {
    0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
    100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  .animate-marquee {
    animation: marquee 30s linear infinite;
  }
  .animate-rotate {
    animation: rotate 20s linear infinite;
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .grain-overlay {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E");
  }
  .reveal {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
    transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
  }
  .reveal.active {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  .scene {
    perspective: 800px;
  }
  .scroll-progress {
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #22d3ee);
    box-shadow: 0 0 12px rgba(99, 102, 241, 0.45);
    transform-origin: left;
  }
  .cube {
    transform-style: preserve-3d;
    width: 200px;
    height: 200px;
    position: relative;
  }
  .face {
    position: absolute;
    width: 200px;
    height: 200px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: white;
    background: rgba(255, 255, 255, 0.02);
  }
  .front  { transform: rotateY(0deg) translateZ(100px); }
  .right  { transform: rotateY(90deg) translateZ(100px); }
  .back   { transform: rotateY(180deg) translateZ(100px); }
  .left   { transform: rotateY(-90deg) translateZ(100px); }
  .top    { transform: rotateX(90deg) translateZ(100px); }
  .bottom { transform: rotateX(-90deg) translateZ(100px); }
`;

const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1 },
    );

    const targets = document.querySelectorAll(".reveal");
    targets.forEach((target) => observer.observe(target));

    return () => targets.forEach((target) => observer.unobserve(target));
  }, []);
};

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return mousePosition;
};

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const nextProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(nextProgress);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
};

const MouseFollower = () => {
  const { x, y } = useMousePosition();
  return (
    <div
      className="fixed pointer-events-none z-50 w-8 h-8 rounded-full bg-white mix-blend-difference opacity-0 md:opacity-100 transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    />
  );
};

type MarqueeProps = {
  items: string[];
  reverse?: boolean;
};

const Marquee = ({ items, reverse = false }: MarqueeProps) => (
  <div className="relative flex overflow-hidden border-y border-zinc-800 bg-zinc-900/30 py-6 reveal">
    <div
      className={`flex whitespace-nowrap ${reverse ? "flex-row-reverse" : ""} animate-marquee hover:[animation-play-state:paused]`}
    >
      {[...items, ...items, ...items].map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="mx-8 text-4xl md:text-6xl font-bold uppercase text-zinc-800 hover:text-white transition-colors cursor-default"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

type ProjectRowProps = {
  title: string;
  category: string;
  year: string;
  description: string;
  index: number;
};

const ProjectRow = ({
  title,
  category,
  year,
  description,
  index,
}: ProjectRowProps) => (
  <div className="group border-b border-zinc-800 transition-colors hover:bg-zinc-900/50 reveal">
    <a className="block py-12 px-4 md:px-8 flex flex-col md:flex-row md:items-baseline justify-between relative overflow-hidden cursor-none">
      <div className="flex items-baseline gap-4 md:gap-8 z-10">
        <span className="font-mono text-xs text-zinc-500">
          0{index + 1}
        </span>
        <h3 className="text-3xl md:text-5xl font-bold text-white group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-16 mt-4 md:mt-0 z-10">
        <p className="text-zinc-500 max-w-xs text-sm leading-relaxed hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
          {description}
        </p>
        <div className="flex items-center gap-8 min-w-[200px] justify-end">
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 border border-zinc-800 px-2 py-1 rounded-full">
            {category}
          </span>
          <span className="font-mono text-xs text-zinc-600">{year}</span>
          <ArrowUpRight className="text-zinc-500 group-hover:text-white group-hover:rotate-45 transition-all duration-300" />
        </div>
      </div>
    </a>
  </div>
);

type ServiceCardProps = {
  title: string;
  description: string;
  tags: string[];
  number: string;
};

const ServiceCard = ({ title, description, tags, number }: ServiceCardProps) => (
  <div className="reveal border-r border-b border-zinc-800 p-8 md:p-12 hover:bg-zinc-900/30 transition-colors min-h-[320px] flex flex-col justify-between group">
    <div>
      <div className="font-mono text-xs text-zinc-600 mb-8 flex justify-between">
        <span>(SERVICE)</span>
        <span>0{number}</span>
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:translate-x-2 transition-transform duration-300">
        {title}
      </h3>
      <p className="text-zinc-400 leading-relaxed max-w-sm">{description}</p>
    </div>
    <div className="flex flex-wrap gap-2 mt-8">
      {tags.map((tag) => (
        <span
          key={`${title}-${tag}`}
          className="text-[10px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-1"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const scrollProgress = useScrollProgress();

  useScrollReveal();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Manila",
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const marqueeItems = [
    "Creative Development",
    "WebGL",
    "Three.js",
    "AI Integration",
    "Next.js",
    "React",
    "TypeScript",
    "UI/UX Design",
  ];

  const projects = [
    {
      title: "Ink AI",
      category: "Generative AI",
      year: "2024",
      description: "Vector ink smoothing & handwriting beautification engine.",
    },
    {
      title: "Fanatics",
      category: "Computer Vision",
      year: "2024",
      description: "Automated sports card grading and highlight detection.",
    },
    {
      title: "CodeSwipe",
      category: "Dev Tools",
      year: "2023",
      description: "Tinder-style interface for rapid Pull Request reviews.",
    },
    {
      title: "MicroView",
      category: "Edge IoT",
      year: "2023",
      description: "Real-time inference running on low-power Raspberry Pi devices.",
    },
    {
      title: "Kippap",
      category: "EdTech Platform",
      year: "2023",
      description: "Secure learning portal serving thousands of students.",
    },
    {
      title: "Prepfolio",
      category: "SaaS",
      year: "2022",
      description: "Analytics-driven review center preparation tool.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-white selection:text-black overflow-x-hidden cursor-default">
      <style>{styles}</style>

      <MouseFollower />

      <div
        className="fixed top-0 left-0 right-0 z-50 scroll-progress"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] grain-overlay z-50 mix-blend-overlay" />

      <header className="fixed top-0 left-0 w-full z-40 mix-blend-difference px-4 py-6 md:px-8 flex justify-between items-start">
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tighter text-white">
            studio.main
          </span>
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
            Manila, PH — {time}
          </span>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="group flex items-center gap-3 text-white mix-blend-difference"
        >
          <span className="hidden md:block font-mono text-xs uppercase tracking-widest group-hover:line-through">
            Menu
          </span>
          <div className="w-8 h-2 bg-white flex flex-col justify-between group-hover:h-4 transition-all duration-300">
            <span className="w-full h-[1px] bg-black" />
            <span className="w-full h-[1px] bg-black" />
          </div>
        </button>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col justify-center items-center">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-8 text-white p-2 hover:rotate-90 transition-transform duration-300"
          >
            <X size={32} />
          </button>
          <nav className="flex flex-col gap-6 text-center">
            {["Services", "Work", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-5xl md:text-7xl font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-tight hover:italic"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      )}

      <main className="relative z-10 pt-32 md:pt-48">
        <section className="px-4 md:px-8 mb-32 relative">
          <div className="absolute top-0 right-0 md:right-32 w-full md:w-auto h-[400px] pointer-events-none flex items-center justify-center opacity-30 z-0">
            <div className="scene animate-float">
              <div className="cube animate-rotate">
                <div className="face front">.main</div>
                <div className="face back">AI</div>
                <div className="face right">WEB</div>
                <div className="face left">3D</div>
                <div className="face top" />
                <div className="face bottom" />
              </div>
            </div>
          </div>

          <div className="max-w-[90vw] mx-auto border-l border-zinc-800 pl-4 md:pl-12 py-12 relative z-10">
            <div className="overflow-hidden">
              <h1 className="text-[clamp(2.5rem,8vw,5.75rem)] md:text-[clamp(3rem,7vw,6.75rem)] leading-[0.9] font-bold tracking-tighter uppercase text-white mix-blend-difference reveal">
                Digital <br />
                <span className="text-zinc-800">Product</span> <br />
                Studio
              </h1>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between mt-12 md:mt-24 gap-8 reveal">
              <p className="max-w-md text-sm md:text-base text-zinc-400 font-mono">
                // We design & build AI-powered apps, motion-rich interfaces, and
                secure platforms. Led by Adrian, Avril, & Mc.
              </p>

              <div className="flex flex-col gap-4">
                <a href="#contact" className="group flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    <ArrowRight
                      size={20}
                      className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                    />
                  </div>
                  <span className="uppercase tracking-widest text-xs font-bold">
                    Start Project
                  </span>
                </a>
                <a
                  href="#services"
                  className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                  Scroll to services
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-[#0a0a0a]">
          <Marquee items={marqueeItems} />
        </section>

        <section id="about" className="py-32 px-4 md:px-8 border-b border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4 reveal">
              <span className="font-mono text-xs text-indigo-500 uppercase tracking-widest mb-4 block">
                ( About )
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Not just another <br /> dev shop.
              </h2>
            </div>
            <div className="md:col-span-8 reveal">
              <p className="text-xl md:text-3xl text-zinc-300 leading-snug font-light">
                We bridge the gap between <span className="text-white font-medium">high-end motion design</span> and{" "}
                <span className="text-white font-medium">engineering rigor</span>. While others choose between performance and aesthetics, we deliver both.
              </p>
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="text-3xl font-bold text-white">3+</h4>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">
                    Years Exp
                  </span>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white">15+</h4>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">
                    Projects
                  </span>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white">100%</h4>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">
                    Remote
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="border-b border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            <div className="p-8 md:p-12 flex items-center justify-center bg-zinc-900 text-center md:text-left md:block reveal">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white">
                What <br /> We Do
              </h2>
            </div>
            <ServiceCard
              number="1"
              title="Product Engineering"
              description="Full-stack React/Next.js apps built for scale. Secure, SEO-optimized, and type-safe."
              tags={["Next.js", "React", "Node.js"]}
            />
            <ServiceCard
              number="2"
              title="AI & Intelligence"
              description="Chatbots, RAG systems, and computer vision tools that automate workflows."
              tags={["OpenAI", "RAG", "Python"]}
            />
            <ServiceCard
              number="3"
              title="Creative Web"
              description="Immersive 3D experiences. High-performance motion design without the jank."
              tags={["Three.js", "WebGL", "GSAP"]}
            />
          </div>
        </section>

        <section id="work" className="py-32">
          <div className="px-4 md:px-8 mb-16 flex items-end justify-between reveal">
            <h2 className="text-[6vw] leading-none font-bold text-zinc-800 uppercase">
              Selected Work
            </h2>
            <span className="hidden md:block font-mono text-xs text-zinc-500 mb-2">
              ( 2022 — 2024 )
            </span>
          </div>

          <div className="border-t border-zinc-800">
            {projects.map((project, index) => (
              <ProjectRow key={project.title} {...project} index={index} />
            ))}
          </div>

          <div className="flex justify-center mt-24 reveal">
            <button className="px-12 py-4 border border-zinc-800 hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs font-bold">
              View All Projects
            </button>
          </div>
        </section>

        <footer
          id="contact"
          className="bg-[#0a0a0a] pt-32 pb-12 px-4 md:px-8 border-t border-zinc-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 reveal">
            <div>
              <span className="font-mono text-xs text-indigo-500 uppercase tracking-widest mb-4 block">
                ( Contact )
              </span>
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
                Let&apos;s build <br /> something.
              </h2>
              <p className="text-zinc-400 max-w-md text-lg">
                Send us your goal. We’ll reply with a quick plan and timeline. No
                fluff.
              </p>
            </div>

            <div className="flex flex-col justify-end items-start md:items-end">
              <a
                href="mailto:hello@studio.main"
                className="text-2xl md:text-4xl font-bold text-white hover:text-indigo-400 transition-colors border-b border-zinc-700 pb-2 mb-8"
              >
                hello@studio.main
              </a>
              <div className="flex gap-4">
                {["Upwork", "LinkedIn", "GitHub"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="px-4 py-2 border border-zinc-800 rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end border-t border-zinc-900 pt-8 text-zinc-600 text-xs font-mono uppercase tracking-widest reveal">
            <div className="flex flex-col gap-2 mb-4 md:mb-0">
              <span>Studio.Main © 2025</span>
              <span>Based in Manila</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">
                Privacy
              </a>
              <a href="#" className="hover:text-white">
                Terms
              </a>
            </div>
            <div className="hidden md:block">
              <ArrowRight className="-rotate-45" />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
