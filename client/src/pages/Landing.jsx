import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import LmsImage from "../assets/images/lms.png";
import ShivKumarSharma from "../assets/images/shivKumarSharma.png";
import {
  GraduationCap,
  ArrowRight,
  ExternalLink,
  BookOpen,
  LayoutDashboard,
  Video,
  FileText,
  ClipboardList,
  Code,
  CheckSquare,
  Users,
  Compass,
  Bell,
  ShieldCheck,
  Server,
  Cpu,
  Monitor,
  Heart,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Terminal,
  Database,
  Layers,
  Unlock,
  CheckCircle,
  Lightbulb,
  Globe,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import Loading from "../components/Loading";

// Easily Configurable Project Name
const PROJECT_NAME = "PadhOS";

const techStack = [
  {
    name: "React",
    desc: "Interactive Frontend",
    icon: Code,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },

  {
    name: "Node.js",
    desc: "Scalable API Runtime",
    icon: Cpu,
    color: "text-green-400 bg-green-500/10 border-green-500/20",
  },

  {
    name: "MongoDB",
    desc: "Dynamic Submissions",
    icon: Database,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    name: "Express",
    desc: "Web Framework",
    icon: Code,
    color: "text-green-400 bg-green-500/10 border-green-500/20",
  },
];

const features = [
  {
    title: "Student Dashboard",
    desc: "Personalized progress, submissions, grading insights & learning path.",
    icon: LayoutDashboard,
  },
  {
    title: "Teacher Dashboard",
    desc: "Classroom control center, submissions list, assessments, and feedback loops.",
    icon: Users,
  },
  {
    title: "Admin Dashboard",
    desc: "Manage courses, subjects, users, app settings, and institute hierarchies.",
    icon: Settings,
  },
  {
    title: "Course Management",
    desc: "Syllabus builder to structure modules, subjects, and topics seamlessly.",
    icon: BookOpen,
  },
  {
    title: "Video Lessons",
    desc: "Rich multimedia integration for interactive visual learning.",
    icon: Video,
    badge: "Coming Soon",
  },
  {
    title: "Notes & Documents",
    desc: "Markdown-friendly notes, code snippets, and study material repository.",
    icon: FileText,
  },
  {
    title: "Assignments",
    desc: "Interactive assignments with grading systems and deadline trackers.",
    icon: ClipboardList,
  },
  {
    title: "Code Labs",
    desc: "Built-in sandbox IDE for writing, executing, and testing code live.",
    icon: Code,
  },
  {
    title: "Quiz System",
    desc: "Formative checks, multiple choices, and interactive quizzes per topic.",
    icon: CheckSquare,
  },
  {
    title: "Attendance & Logs",
    desc: "Track logs and active student interactions across lessons.",
    icon: Compass,
  },
  {
    title: "Progress Tracking",
    desc: "Granular lesson complete indicators synced back to servers.",
    icon: ShieldCheck,
  },
  // {
  //   title: "Announcements",
  //   desc: "Keep all students and classes aligned with quick broadcast messages.",
  //   icon: Bell,
  // },
  {
    title: "Role-Based Security",
    desc: "Meticulous protection and user permissions for diverse roles.",
    icon: LockIcon,
  },
  {
    title: "Multi-Institute Support",
    desc: "Deploy nested portals for several independent schools.",
    badge: "Coming Soon",
    icon: Globe,
  },
  {
    title: "AI Assistant",
    desc: "Co-pilot helper to explain syntax errors and summarize topics.",
    badge: "Coming Soon",
    icon: Sparkles,
  },
  {
    title: "Mobile Friendly",
    desc: "Fully responsive layouts designed to render on smartphones and tablets.",
    icon: Monitor,
  },
  // {
  //   title: "Self Hosted",
  //   desc: "Take absolute ownership of your school data. Spin up on any VPS.",
  //   icon: Server,
  // },
];

// Helper to render lucide lock correctly
function LockIcon(props) {
  return <ShieldCheck {...props} />;
}

const targets = [
  {
    name: "Schools",
    desc: "Equip primary and secondary schools with digital classrooms and online curricula.",
    icon: GraduationCap,
    color: "from-blue-500/10 to-indigo-500/5 border-blue-500/20",
  },
  {
    name: "Coaching Institutes",
    desc: "Provide test series, code sandboxes, and tracked submissions for tech bootcamps.",
    icon: Code,
    color: "from-purple-500/10 to-pink-500/5 border-purple-500/20",
  },
  {
    name: "Universities",
    desc: "Leverage scalable open-source deployments for department-wide learning management.",
    icon: BookOpen,
    color: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20",
  },
  {
    name: "Online Educators",
    desc: "Build courses and build your custom brand, free from heavy marketplace commissions.",
    icon: Globe,
    color: "from-amber-500/10 to-orange-500/5 border-amber-500/20",
  },
  {
    name: "Training Companies",
    desc: "Onboard new employees, scale technical tests, and host corporate modules.",
    icon: Cpu,
    color: "from-red-500/10 to-rose-500/5 border-red-500/20",
  },
  {
    name: "Organizations",
    desc: "Distribute certifications, host training manuals, and run compliance audits.",
    icon: Users,
    color: "from-zinc-500/10 to-base-300 border-zinc-500/20",
  },
];

const benefits = [
  {
    title: "No Vendor Lock-In",
    desc: "Avoid licensing price hikes. Run your platform on your terms, forever.",
    icon: Unlock,
  },
  {
    title: "Free Forever",
    desc: "Fully open source. No premium features hidden behind paywalls.",
    icon: Heart,
  },
  {
    title: "Community Driven",
    desc: "Submit pull requests, create custom plugins, and grow with worldwide educators.",
    icon: Users,
  },
  {
    title: "Extensible & Customizable",
    desc: "Tailor branding, create custom sandbox compilers, or integrate bespoke APIs.",
    icon: Settings,
  },
  {
    title: "Host Anywhere",
    desc: "Deploy with Docker on AWS, DigitalOcean, Hetzner, or a private server.",
    icon: Server,
  },
  {
    title: "Secure & Transparent",
    desc: "100% reviewable codebase. Privacy by design, keeping student records secure.",
    icon: ShieldCheck,
  },
];

const roadmap = [
  {
    phase: "Phase 1",
    title: "Core LMS Foundation",
    desc: "Dynamic syllabus manager, role-based dashboards, authentication, and core database architecture.",
  },
  {
    phase: "Phase 2",
    title: "Sandbox IDE & Labs",
    desc: "Interactive Code Labs, student grading, notebook manager, and file submission workflows.",
  },
  {
    phase: "Phase 3",
    title: "AI-Powered Tutoring",
    desc: "Automatic sandbox reviews, generative AI study guides, and automatic feedback helpers.",
  },
  {
    phase: "Phase 4",
    title: "Multi-Institute Tenants",
    desc: "SaaS-ready multi-tenant subdomains, custom logo styling per institute, and consolidated admin billing.",
  },
  {
    phase: "Phase 5",
    title: "Plugin Marketplace",
    desc: "Custom theme registers, modular grading schemes, and third-party integrations dashboard.",
  },
];

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/lms");
    }
  }, [user]);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (loading || user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans overflow-x-hidden relative selection:bg-primary selection:text-primary-content overflow-y-auto h-dvh">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[30%] bg-indigo-500/10 rounded-full blur-[80px] animate-float" />
      </div>
      {/* Floating Header */}
      <header className="sticky  top-0 z-50 py-4 px-4 max-w-6xl mx-auto w-full">
        <div className="w-full bg-primary text-primary-content rounded-full px-5 py-2.5 flex items-center justify-between shadow-xl border border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-base-100/25 flex items-center justify-center text-primary-content shadow-inner">
              <GraduationCap size={16} />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              {PROJECT_NAME}
            </span>
          </div>

          {/* Navigation Links - Center */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-white/80">
            <a href="#home" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#roadmap" className="hover:text-white transition-colors">
              Roadmap
            </a>
            <a
              href="#dedication"
              className="hover:text-white transition-colors"
            >
              Dedication
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="btn btn-outline btn-soft border-none btn-circle btn-xs "
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-primary-content" />
              ) : (
                <Moon size={16} className="text-primary-content" />
              )}
            </button>
            <a
              href="https://github.com/imksh/lms"
              target="_blank"
              rel="noreferrer"
              className="btn btn-xs btn-ghost btn-circle hover:bg-base-100/10 text-white"
              title="GitHub Repository"
            >
              <FaGithub size={14} />
            </a>
            <Link
              to="/lms"
              className="btn btn-xs rounded-full bg-white text-primary hover:bg-white/90 font-bold px-4 py-1.5 transition-all text-xs border-none"
            >
              LMS
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative pt-16 pb-24 md:pt-28 md:pb-32 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center flex flex-col items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-6 shadow-inner"
          >
            <Sparkles size={11} className="animate-pulse" />
            <span>Introducing the Next Generation of LMS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl"
          >
            Build the Future of{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-accent bg-clip-text text-transparent">
              Education
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base-content/75 text-base md:text-xl max-w-2xl mt-6 leading-relaxed"
          >
            Hamu padhab, tuhu padha
            <span className="block italic text-base">Let's learn together</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3.5 mt-8 w-full sm:w-auto"
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline border-base-300 hover:bg-base-200/50 rounded-2xl font-bold px-6 py-3 flex gap-2 items-center text-sm shadow-sm transition-all text-base-content"
            >
              <FaGithub size={16} /> View on GitHub
            </a>
            <Link
              to="/login"
              className="btn btn-primary rounded-2xl font-bold px-6 py-3 flex gap-2 items-center text-sm shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              🚀 Live Demo <ChevronRight size={14} />
            </Link>
            <a
              href="#"
              className="btn btn-primary btn-soft rounded-2xl font-bold px-6 py-3 flex gap-2 items-center text-sm text-base-content hover:text-base-content"
            >
              📖 Documentation
            </a>
          </motion.div>

          {/* Interactive UI Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.5,
              type: "spring",
              stiffness: 100,
            }}
            className="mt-16 md:mt-24 w-full max-w-5xl rounded-3xl overflow-hidden glass-panel shadow-2xl p-2 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-0 transition-opacity duration-700" />
            <img
              src={LmsImage}
              alt="Platform Dashboard"
              className="rounded-2xl border border-base-300/50 shadow-inner group-hover:scale-[1.01] transition-transform duration-700"
            />
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Showcase */}
      <section className="py-16 border-t border-b border-base-300/50 bg-base-200/10 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p className="text-center text-xs uppercase font-extrabold text-base-content/40 tracking-widest mb-10">
            Engineered with a Modern Enterprise Tech Stack
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {techStack.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`glass-panel flex flex-col items-center justify-center p-5 md:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 group ${tech.color}`}
                >
                  <Icon
                    size={24}
                    className="mb-3 group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="text-sm font-bold text-base-content">
                    {tech.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 relative z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              A Complete Platform Ecosystem
            </h2>
            <p className="text-base-content/70 text-sm md:text-lg mt-5 leading-relaxed">
              Every tool you need to run, grade, administer, and participate in
              academic classes, tech bootcamps, or vocational courses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                  className="glass-panel hover:bg-base-200/50 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 rounded-2xl group cursor-default"
                >
                  <div className="p-6 md:p-8 flex flex-col gap-5 h-full">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-content transition-all duration-300 group-hover:scale-110 shadow-sm">
                        <Icon size={20} />
                      </div>
                      {feature.badge && (
                        <span className="badge badge-accent badge-outline font-bold text-[10px] px-2.5 py-1 backdrop-blur-md">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 mt-auto">
                      <h4 className="text-lg font-extrabold text-base-content tracking-tight">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-base-content/60 leading-relaxed font-medium">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who is it for? */}
      <section className="py-20 bg-base-200/20 border-t border-b border-base-300">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Tailored for Every Workspace
            </h2>
            <p className="text-base-content/75 text-sm md:text-base mt-4 leading-relaxed">
              Designed dynamically to scale up for hundreds of students in
              academies, or keep it lightweight for independent tutors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {targets.map((target) => {
              const Icon = target.icon;
              return (
                <div
                  key={target.name}
                  className={`card border bg-gradient-to-br p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${target.color}`}
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-base-100 border border-base-300/80 flex items-center justify-center text-base-content/70">
                      <Icon size={16} />
                    </div>
                    <h4 className="text-base font-extrabold text-base-content">
                      {target.name}
                    </h4>
                  </div>
                  <p className="text-xs text-base-content/60 leading-relaxed">
                    {target.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture Diagram Section */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Modern & Clean Architecture
            </h2>
            <p className="text-base-content/75 text-sm md:text-base mt-4 leading-relaxed">
              A decoupled flow built for high security, caching layers, and
              high-speed data handling.
            </p>
          </div>

          {/* Architecture Chart */}
          <div className="card border border-base-300 bg-base-200/30 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-xl">
            <div className="flex flex-col gap-6 items-center w-full">
              {/* Row 1: Users */}
              <div className="flex flex-col items-center">
                <div className="w-36 py-3 px-4 rounded-2xl bg-base-100 border border-base-300 shadow-sm flex items-center justify-center gap-2">
                  <Users size={14} className="text-blue-500" />
                  <span className="text-xs font-extrabold">Active Users</span>
                </div>
                <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500/50 to-primary/50" />
              </div>

              {/* Row 2: Auth Gate */}
              <div className="flex flex-col items-center">
                <div className="w-48 py-3 px-4 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner flex items-center justify-center gap-2">
                  <ShieldCheck size={14} className="text-primary" />
                  <span className="text-xs font-black text-primary">
                    Authentication Gate
                  </span>
                </div>
                <div className="w-0.5 h-6 bg-primary/40" />
              </div>

              {/* Row 3: Role Routers */}
              <div className="w-full flex justify-between gap-4 max-w-md">
                <div className="flex-1 py-3 px-2 rounded-xl bg-base-100 border border-base-300 shadow-sm text-center">
                  <span className="text-[11px] font-bold block text-base-content/85">
                    Admin Portal
                  </span>
                </div>
                <div className="flex-1 py-3 px-2 rounded-xl bg-base-100 border border-base-300 shadow-sm text-center">
                  <span className="text-[11px] font-bold block text-base-content/85">
                    Teacher View
                  </span>
                </div>
                <div className="flex-1 py-3 px-2 rounded-xl bg-base-100 border border-base-300 shadow-sm text-center">
                  <span className="text-[11px] font-bold block text-base-content/85">
                    Student View
                  </span>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <div className="w-[80%] h-6 border-l-2 border-r-2 border-b-2 border-dashed border-base-300/80 rounded-b-2xl relative">
                  <div className="absolute bottom-0 left-[50%] -translate-x-[50%] translate-y-[50%] w-0.5 h-6 bg-base-300" />
                </div>
              </div>

              {/* Row 4: Core Engine */}
              <div className="flex flex-col items-center mt-3">
                <div className="w-56 py-4 px-6 rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20 flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} />
                    <span className="text-xs font-black tracking-wide uppercase">
                      {PROJECT_NAME} Core
                    </span>
                  </div>
                  <span className="text-[9px] opacity-75">
                    Express API & Middleware Layers
                  </span>
                </div>
                <div className="w-0.5 h-6 bg-gradient-to-b from-primary/50 to-emerald-500/50" />
              </div>

              {/* Row 5: Databases */}
              <div className="flex flex-col items-center">
                <div className="py-3 px-5 rounded-2xl bg-zinc-950 text-zinc-300 border border-zinc-800 shadow-inner flex items-center justify-center gap-4">
                  {/* <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-sky-400">
                      PostgreSQL
                    </span>
                  </div> */}
                  {/* <div className="w-px h-4 bg-zinc-800" /> */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      MongoDB
                    </span>
                  </div>
                  {/* <div className="w-px h-4 bg-zinc-800" /> */}
                  {/* <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-red-400">
                      Redis Cache
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Open Source */}
      <section className="py-20 bg-base-200/20 border-t border-b border-base-300 relative">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Why Choose Open Source?
            </h2>
            <p className="text-base-content/75 text-sm md:text-base mt-4 leading-relaxed">
              We believe that top-tier educational tools shouldn't be locked
              behind expensive subscription paywalls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-extrabold text-base-content">
                      {b.title}
                    </h4>
                    <p className="text-xs text-base-content/60 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 md:py-28 relative">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Project Roadmap
            </h2>
            <p className="text-base-content/75 text-sm md:text-base mt-4 leading-relaxed">
              Join us in building the most robust learning ecosystem. Our
              planned phases are structured for reliability and extensibility.
            </p>
          </div>

          {/* Roadmap Timeline */}
          <div className="relative pl-6 md:pl-8 border-l-2 border-base-300/80 space-y-12 max-w-2xl mx-auto">
            {roadmap.map((item, idx) => (
              <div key={item.phase} className="relative group">
                {/* Dot */}
                <div className="absolute left-[-32px] md:left-[-40px] top-1 w-4 h-4 rounded-full bg-base-100 border-2 border-primary group-hover:bg-primary transition-colors duration-200" />

                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    {item.phase}
                  </span>
                  <h4 className="text-lg font-extrabold text-base-content">
                    {item.title}
                  </h4>
                  <p className="text-xs text-base-content/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dedication Section */}
      <section
        id="dedication"
        className="py-20 bg-gradient-to-br from-primary/5 via-base-200 to-accent/5 border-t border-b border-base-300 relative"
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="card border border-base-300/80 bg-base-100/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
              <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <img
                  src={ShivKumarSharma}
                  alt="Shiv Kumar Sharma"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">
                  Shiv Kumar Sharma
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-base-content">
                  Dedicated to a Teacher
                </h3>
              </div>

              <p className="text-sm text-base-content/85 leading-relaxed italic font-serif">
                "This project is dedicated to my grandfather, a government
                school teacher who taught me that education is the greatest gift
                one can share."
              </p>

              <div className="space-y-2 py-4 px-6 bg-base-200/50 border border-base-300/40 rounded-2xl">
                <p className="text-base md:text-lg font-black text-primary tracking-wide">
                  "Hamu padhab, tuhu padha."
                </p>
                <p className="text-[11px] text-base-content/50 uppercase font-black tracking-wider">
                  (Let's learn together.)
                </p>
              </div>

              <p className="text-xs text-base-content/65 leading-relaxed max-w-xl">
                That simple belief inspired this open-source project, with the
                hope that quality education technology becomes accessible to
                every school, teacher, and student globally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contribution Section */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Contribute to the Future
          </h2>
          <p className="text-base-content/75 text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            {PROJECT_NAME} is built collaboratively. Join our developer
            community, submit issues, or help write documentation.
          </p>

          <div className="flex flex-wrap justify-center gap-3.5 mt-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary rounded-2xl font-bold px-6 py-3 flex gap-2 items-center text-sm shadow-md "
            >
              <FaGithub size={16} /> Contribute
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline border-base-300 hover:bg-base-200/50 rounded-2xl font-bold px-6 py-3 flex gap-2 items-center text-sm shadow-sm text-base-content"
            >
              Open Issues <ArrowUpRight size={14} />
            </a>
            <a
              href="#"
              className="btn btn-primary btn-soft rounded-2xl font-bold px-6 py-3 flex gap-2 items-center text-sm text-base-content"
            >
              Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-base-300 bg-base-200/40 py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-content shadow-md shadow-primary/20">
              <GraduationCap size={14} />
            </div>
            <span className="font-extrabold text-base tracking-tight text-base-content">
              {PROJECT_NAME}
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-base-content/60 font-medium justify-center">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              GitHub <ExternalLink size={10} />
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              MIT License
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Community
            </a>
          </div>

          <div className="text-xs text-base-content/40 flex items-center gap-1 font-bold">
            <span>Made with</span>
            <Heart size={10} className="text-rose-500 fill-rose-500" />
            <span>for Education</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
