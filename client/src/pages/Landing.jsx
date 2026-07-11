import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
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
    name: "Next.js",
    desc: "Production SSR/SSG",
    icon: Globe,
    color: "text-zinc-200 bg-zinc-500/10 border-zinc-500/20",
  },
  {
    name: "Node.js",
    desc: "Scalable API Runtime",
    icon: Cpu,
    color: "text-green-400 bg-green-500/10 border-green-500/20",
  },
  {
    name: "PostgreSQL",
    desc: "Relational DB Core",
    icon: Database,
    color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  },
  {
    name: "MongoDB",
    desc: "Dynamic Submissions",
    icon: Database,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    name: "Redis",
    desc: "High-Speed Cache",
    icon: Server,
    color: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  {
    name: "Prisma",
    desc: "Type-Safe ORM",
    icon: Terminal,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    name: "Docker",
    desc: "Instant Containerization",
    icon: Layers,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    name: "TypeScript",
    desc: "Type-Safe Reliability",
    icon: ShieldCheck,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
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
  {
    title: "Announcements",
    desc: "Keep all students and classes aligned with quick broadcast messages.",
    icon: Bell,
  },
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
    badge: "Future",
    icon: Sparkles,
  },
  {
    title: "Mobile Friendly",
    desc: "Fully responsive layouts designed to render on smartphones and tablets.",
    icon: Monitor,
  },
  {
    title: "Self Hosted",
    desc: "Take absolute ownership of your school data. Spin up on any VPS.",
    icon: Server,
  },
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans overflow-x-hidden relative selection:bg-primary selection:text-primary-content overflow-y-auto h-dvh">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[40%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Floating Header */}
      <header className="sticky top-0 z-50 py-4 px-4 max-w-6xl mx-auto w-full">
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
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a>
            <a href="#dedication" className="hover:text-white transition-colors">Dedication</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle btn-xs hover:bg-base-100/10 text-white"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <span>☀️</span>
              ) : (
                <span>🌙</span>
              )}
            </button>
            <a
              href="https://github.com"
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
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center flex flex-col items-center">
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
            Open Source Learning Platform for Schools, Coaching Institutes &
            Educators. Fully extensible, accessible, and designed for
            self-hosting.
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
              className="btn btn-outline border-base-300 hover:bg-base-200/50 rounded-2xl font-bold px-6 py-3 flex gap-2 items-center text-sm shadow-sm transition-all"
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
              className="btn btn-ghost rounded-2xl font-bold px-6 py-3 flex gap-2 items-center text-sm text-base-content/70 hover:text-base-content"
            >
              📖 Documentation
            </a>
          </motion.div>

          {/* Interactive UI Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-14 md:mt-20 w-full max-w-5xl rounded-3xl overflow-hidden border border-base-300/80 bg-base-200/30 p-2 md:p-3 shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 pointer-events-none rounded-3xl" />
            <div className="rounded-2xl overflow-hidden border border-base-300 bg-base-100/90 shadow-lg relative aspect-video flex flex-col">
              {/* Fake Window bar */}
              <div className="px-4 py-3 bg-base-200/80 border-b border-base-300 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="text-[10px] text-base-content/40 font-mono tracking-wider truncate max-w-xs">
                  {PROJECT_NAME}.dev/classroom/react-masterclass
                </div>
                <div className="w-12" />
              </div>
              {/* Mockup Canvas */}
              <div className="flex-1 grid grid-cols-12 bg-base-100 text-left">
                {/* Sidebar mock */}
                <div className="col-span-3 border-r border-base-300 p-4 hidden md:flex flex-col gap-4 bg-base-200/20">
                  <div className="flex items-center gap-2 pb-2 border-b border-base-300/50">
                    <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                      <BookOpen size={12} className="text-primary" />
                    </div>
                    <span className="text-xs font-bold truncate">
                      React Course
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-6 rounded bg-primary/10 border border-primary/20 flex items-center px-2 text-[10px] font-bold text-primary">
                      01. Getting Started
                    </div>
                    <div className="h-6 rounded hover:bg-base-200/50 flex items-center px-2 text-[10px] font-medium text-base-content/60">
                      02. JSX Syntax
                    </div>
                    <div className="h-6 rounded hover:bg-base-200/50 flex items-center px-2 text-[10px] font-medium text-base-content/60">
                      03. Component Tree
                    </div>
                    <div className="h-6 rounded hover:bg-base-200/50 flex items-center px-2 text-[10px] font-medium text-base-content/60">
                      04. React Hooks
                    </div>
                  </div>
                </div>
                {/* Main Content mock */}
                <div className="col-span-12 md:col-span-9 p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] uppercase font-black text-primary tracking-wider">
                        Lesson 01
                      </span>
                      <h4 className="text-lg font-extrabold text-base-content">
                        Introduction to Functional Components
                      </h4>
                    </div>
                    <span className="badge badge-success badge-sm font-bold">
                      Approved
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-base-content/70">
                    <p>
                      React is built around modular, reusable components. In
                      this lesson, we will cover the structure of JSX templates
                      and inspect standard render operations.
                    </p>
                  </div>
                  {/* Fake Code block */}
                  <div className="mt-2 rounded-xl bg-zinc-950 p-4 font-mono text-[11px] text-zinc-300 border border-zinc-800 shadow-inner flex flex-col gap-1">
                    <div className="text-zinc-500">
                      // React Playground Sandbox
                    </div>
                    <div>
                      <span className="text-blue-400">const</span>{" "}
                      <span className="text-violet-400">Greeting</span> = ()
                      =&gt; &#123;
                    </div>
                    <div className="pl-4">
                      return &lt;<span className="text-pink-400">h1</span>
                      &gt;Hello World!&lt;/
                      <span className="text-pink-400">h1</span>&gt;;
                    </div>
                    <div>&#125;;</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Showcase */}
      <section className="py-12 border-t border-b border-base-300 bg-base-200/20 relative">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p className="text-center text-xs uppercase font-extrabold text-base-content/40 tracking-widest mb-8">
            Engineered with a Modern Enterprise Tech Stack
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${tech.color}`}
                >
                  <Icon size={18} className="mb-2" />
                  <span className="text-xs font-bold text-base-content">
                    {tech.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              A Complete Platform Ecosystem
            </h2>
            <p className="text-base-content/75 text-sm md:text-base mt-4 leading-relaxed">
              Every tool you need to run, grade, administer, and participate in
              academic classes, tech bootcamps, or vocational courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card border border-base-300 bg-base-200/30 hover:bg-base-200/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 rounded-2xl group"
                >
                  <div className="card-body p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-content transition-all duration-300">
                        <Icon size={18} />
                      </div>
                      {feature.badge && (
                        <span className="badge badge-accent badge-outline font-bold text-[10px] px-2.5 py-1">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-base-content">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-base-content/60 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
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
                    Student Sandbox
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
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-sky-400">
                      PostgreSQL
                    </span>
                  </div>
                  <div className="w-px h-4 bg-zinc-800" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      MongoDB
                    </span>
                  </div>
                  <div className="w-px h-4 bg-zinc-800" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-red-400">
                      Redis Cache
                    </span>
                  </div>
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
      <section className="py-20 md:py-28 relative">
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
      <section className="py-20 bg-gradient-to-br from-primary/5 via-base-200 to-accent/5 border-t border-b border-base-300 relative">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="card border border-base-300/80 bg-base-100/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Heart size={20} className="fill-primary/20" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">
                  Our Philosophy
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
              className="btn btn-primary rounded-2xl font-bold px-6 py-3 flex gap-2 items-center text-sm shadow-md"
            >
              <FaGithub size={16} /> Contribute
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline border-base-300 hover:bg-base-200/50 rounded-2xl font-bold px-6 py-3 flex gap-2 items-center text-sm shadow-sm"
            >
              Open Issues <ArrowUpRight size={14} />
            </a>
            <a
              href="#"
              className="btn btn-ghost rounded-2xl font-bold px-6 py-3 flex gap-2 items-center text-sm text-base-content/70 hover:text-base-content"
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
