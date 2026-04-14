import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, Sparkles, RefreshCcw } from 'lucide-react';
import { useWorkspaceContext } from '../contexts/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import PricingCard from '../components/ui/PricingCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import { supabase } from '../lib/supabase.js';

const CARD_NUMBER = '4413 5976 0102 3524';

const plans = [
  {
    id: 'monthly',
    title: 'Monthly',
    price: '$59',
    priceLabel: 'per month',
    description: 'Flexible monthly access with AI-powered lead workflows.',
    features: ['Token usage limit included', 'Priority updates', 'Email support'],
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: '$499',
    priceLabel: 'per year',
    description: 'Best value for fast-growing teams with predictable billing.',
    features: ['Token usage limit included', 'Best savings', 'Priority support'],
    recommended: true,
  },
];

export default function Subscription() {
  const navigate = useNavigate();
  const { workspace, workspaceLoading, isSubscribed, refreshWorkspace } = useWorkspaceContext();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [paymentState, setPaymentState] = useState('idle');
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!workspaceLoading && workspace && workspace.subscribed) {
      navigate('/dashboard', { replace: true });
    }
  }, [workspace, workspaceLoading, navigate]);

  useEffect(() => {
    if (paymentState === 'pending' && refreshWorkspace) {
      const timer = setInterval(async () => {
        await refreshWorkspace();
      }, 5000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [paymentState, refreshWorkspace]);

  const selectedPlanData = useMemo(
    () => plans.find((plan) => plan.id === selectedPlan) || plans[0],
    [selectedPlan]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CARD_NUMBER);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    } catch (err) {
      setError('Failed to copy card number.');
      console.error(err);
    }
  };

  const handlePaymentClick = async () => {
    if (!workspace?.id) {
      setError('Workspace not loaded yet.');
      return;
    }

    setError('');
    setPaymentState('pending');

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        setError('Unable to validate your session. Please sign in again.');
        setPaymentState('idle');
        return;
      }
    } catch (err) {
      console.error(err);
      setError('Unable to submit payment confirmation. Please try again.');
      setPaymentState('idle');
    }
  };

  if (workspaceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
        <Loader label="Checking workspace status..." />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.34em] text-gray-500">Subscription required</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black">Activate OpsAI for your team</h1>
            <p className="mt-4 text-gray-600">Choose the plan that fits your business and complete payment to unlock the dashboard, leads, chat, and automation features.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                title={plan.title}
                price={plan.price}
                priceLabel={plan.priceLabel}
                description={plan.description}
                features={plan.features}
                recommended={plan.recommended}
                selected={plan.id === selectedPlan}
                onSelect={() => setSelectedPlan(plan.id)}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-gray-500">
              <CreditCard className="h-4 w-4 text-blue-600" /> Payment details
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
                <p className="text-sm text-gray-500">Card number</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xl font-semibold tracking-[0.13em] text-black">{CARD_NUMBER}</span>
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    {copySuccess ? 'Copied' : 'Copy card'}
                  </Button>
                </div>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
                <p className="text-sm text-gray-500">Instructions</p>
                <p className="mt-3 text-gray-700 leading-relaxed">Please send a screenshot of the payment receipt to our Telegram account after payment.</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
                <p className="text-sm text-gray-500">Telegram</p>
                <a href="https://t.me/otabek_nabiyev1" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-blue-700 hover:text-blue-900">
                  https://t.me/otabek_nabiyev1
                </a>
              </div>
            </div>

            {error && <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Selected plan</p>
                <p className="text-lg font-semibold text-black">{selectedPlanData.title} · {selectedPlanData.priceLabel}</p>
              </div>
              <Button variant="primary" size="lg" onClick={handlePaymentClick} disabled={paymentState === 'pending'}>
                {paymentState === 'pending' ? 'Awaiting confirmation…' : 'I have paid'}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-blue-200 bg-blue-50 p-8 shadow-sm">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">
                <Sparkles className="h-4 w-4" /> Why upgrade
              </div>
              <ul className="mt-6 space-y-4 text-sm text-gray-700">
                <li>• Unlock full access to dashboard, leads, chat, tasks, and settings.</li>
                <li>• Get token usage with transparent overage support.</li>
                <li>• Keep your workspace secure while approval is pending.</li>
              </ul>
            </div>

            {paymentState === 'pending' ? (
              <div className="rounded-[32px] border border-blue-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 text-blue-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-semibold text-black">Pending confirmation</p>
                </div>
                <p className="mt-4 text-sm text-gray-600">Your payment confirmation has been recorded. We will check the receipt and unlock your workspace as soon as possible.</p>
                <div className="mt-6 flex items-center gap-3">
                  <Button variant="secondary" onClick={() => refreshWorkspace?.()}>
                    <RefreshCcw className="mr-2 h-4 w-4" /> Refresh status
                  </Button>
                  <span className="text-sm text-gray-500">We'll also poll the backend automatically.</span>
                </div>
              </div>
            ) : (
              <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold text-black">Next step</p>
                <p className="mt-3 text-sm text-gray-600">After payment, click the button above. Your workspace will be unlocked once the payment is verified.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
