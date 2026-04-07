import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase.js';
import { Sparkles, ArrowRight, CheckCircle, Users, Workflow, Zap, MessageSquare, BarChart3, Shield, Clock } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/dashboard', { replace: true });
      }
    };
    checkSession();

    // Auto-rotate demo steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  const workflowSteps = [
    {
      title: "AI Command Processing",
      description: "Natural language commands trigger automated workflows",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Task Execution",
      description: "Multiple AI agents work in parallel to complete tasks",
      icon: Workflow,
      color: "text-green-600"
    },
    {
      title: "Real-time Monitoring",
      description: "Track progress, review results, and intervene when needed",
      icon: BarChart3,
      color: "text-purple-600"
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Coordinate AI agents and human operators in unified workspaces",
      color: "text-blue-600"
    },
    {
      icon: Workflow,
      title: "Visual Workflows",
      description: "Kanban boards and timeline views for complete task visibility",
      color: "text-green-600"
    },
    {
      icon: Zap,
      title: "Instant Automation",
      description: "Deploy AI workflows with natural language commands",
      color: "text-yellow-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Role-based access and audit trails for compliance",
      color: "text-red-600"
    },
    {
      icon: Clock,
      title: "24/7 Operations",
      description: "Round-the-clock AI operations with human oversight",
      color: "text-purple-600"
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Built-in validation and error handling for reliable results",
      color: "text-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-blue-600 text-lg font-semibold text-white">O</div>
            <span className="text-xl font-semibold tracking-tight">OpsAI</span>
          </motion.div>
          <motion.button
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-blue-500 hover:bg-blue-50"
          >
            Sign In
          </motion.button>
        </div>
      </motion.header>

      <main className="relative pt-28">
        {/* Hero Section */}
        <section className="pb-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl space-y-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700"
              >
                <Sparkles className="h-4 w-4 text-blue-600" />
                AI operations in one workspace
              </motion.div>
              <div className="space-y-6">
                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-5xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-6xl"
                >
                  Minimal AI operations.
                  <span className="text-blue-600"> Maximum control.</span>
                </motion.h1>
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="max-w-xl text-lg leading-8 text-gray-600"
                >
                  Run your workflows, manage automation, and inspect task progress from a clean command center.
                  Experience the future of AI operations today.
                </motion.p>
              </div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
                >
                  Start now
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/chat')}
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-4 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-blue-500 hover:bg-blue-50"
                >
                  Open command stream
                </button>
              </motion.div>
            </motion.div>

            {/* Interactive Demo */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Live System Demo</span>
                  <div className="flex gap-2">
                    {workflowSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full transition ${
                          index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-50 ${workflowSteps[currentStep].color}`}>
                      {(() => {
                        const IconComponent = workflowSteps[currentStep].icon;
                        return <IconComponent className="h-5 w-5" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{workflowSteps[currentStep].title}</h3>
                      <p className="text-sm text-gray-600">{workflowSteps[currentStep].description}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 space-y-3">
                    {currentStep === 0 && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">User: "Send welcome messages to all new leads from last week"</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">AI: Processing 47 leads...</span>
                        </div>
                      </>
                    )}
                    {currentStep === 1 && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">Lead enrichment agent: Completed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">Message personalization: Completed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-gray-700">Telegram delivery: In progress...</span>
                        </div>
                      </>
                    )}
                    {currentStep === 2 && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <BarChart3 className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-700">47/47 messages delivered</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-700">23 responses received (48.9% engagement)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">Campaign completed successfully</span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Everything you need for AI operations
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From natural language commands to enterprise-grade automation,
                OpsAI provides the complete toolkit for modern AI operations.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className={`inline-flex p-3 rounded-2xl bg-gray-50 mb-4 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Demo Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                See the system in action
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Watch how natural language commands transform into automated workflows
                with real-time monitoring and control.
              </p>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Natural Language Commands</h3>
                      <p className="text-gray-600">Simply type what you want to accomplish. No complex interfaces or configurations.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold text-sm">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Execution</h3>
                      <p className="text-gray-600">Multiple specialized agents work together to complete your tasks efficiently.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold text-sm">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Real-Time Monitoring</h3>
                      <p className="text-gray-600">Track progress, review results, and intervene when needed through an intuitive dashboard.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Command Center</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Live</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">User Command</span>
                      </div>
                      <p className="text-sm text-blue-800">"Send personalized welcome messages to all leads from the last 7 days"</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Lead Analysis Agent</p>
                          <p className="text-xs text-gray-600">Analyzed 156 leads, categorized by engagement level</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Message Personalization Agent</p>
                          <p className="text-xs text-gray-600">Generating personalized content for each lead...</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Telegram Delivery Agent</p>
                          <p className="text-xs text-gray-600">Queued for delivery</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">System Status</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-green-900">156</p>
                          <p className="text-xs text-green-700">Leads Processed</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-green-900">98%</p>
                          <p className="text-xs text-green-700">Success Rate</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-green-900">2.3s</p>
                          <p className="text-xs text-green-700">Avg Response</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-semibold text-white">
                Ready to transform your AI operations?
              </h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Join thousands of teams using OpsAI to streamline their AI workflows,
                reduce manual work, and achieve better results.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-blue-600 shadow-lg transition hover:bg-blue-50 hover:shadow-xl"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/chat')}
                  className="inline-flex items-center justify-center rounded-full border border-blue-300 bg-blue-500/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-blue-500/20"
                >
                  Try the demo
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="border-t border-gray-200 py-12 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white">O</div>
              <span className="text-sm font-medium text-gray-900">OpsAI</span>
            </div>
            <p className="text-sm text-gray-500 text-center md:text-right">
              &copy; 2024 OpsAI. Built for simplicity and reliability.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}