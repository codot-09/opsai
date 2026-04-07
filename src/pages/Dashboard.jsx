import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import Card from '../components/Card.jsx';
import Chart from '../components/Chart.jsx';
import Table from '../components/Table.jsx';
import { supabase } from '../lib/supabase.js';

const formatLabel = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [leadsRes, messagesRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*')
      ]);

      if (leadsRes.error) {
        setError(leadsRes.error.message);
        setLeads([]);
      } else {
        setLeads(leadsRes.data || []);
      }

      if (messagesRes.error) {
        // Don't set error for messages, just empty
        setMessages([]);
      } else {
        setMessages(messagesRes.data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const totalLeads = leads.length;
  const leadsToday = leads.filter((lead) => new Date(lead.created_at).toDateString() === new Date().toDateString()).length;

  // Group messages by lead_id
  const messageCounts = useMemo(() => {
    const counts = {};
    messages.forEach((msg) => {
      counts[msg.lead_id] = (counts[msg.lead_id] || 0) + 1;
    });
    return counts;
  }, [messages]);

  // Active conversations: leads with messages in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeConversations = leads.filter((lead) => {
    const leadMessages = messages.filter((msg) => msg.lead_id === lead.id);
    return leadMessages.some((msg) => new Date(msg.created_at) > sevenDaysAgo);
  }).length;

  // Engaged: >3 messages
  const engagedLeads = Object.values(messageCounts).filter((count) => count > 3).length;

  // Cold: exactly 1 message
  const coldLeads = Object.values(messageCounts).filter((count) => count === 1).length;

  const conversationPotential = engagedLeads;
  const engagementRate = totalLeads > 0 ? Math.round((engagedLeads / totalLeads) * 100) : 0;

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return { label: formatLabel(date), count: 0, key: date.toDateString() };
    });

    leads.forEach((lead) => {
      const created = new Date(lead.created_at);
      const match = days.find((day) => day.key === created.toDateString());
      if (match) {
        match.count += 1;
      }
    });

    return days;
  }, [leads]);

  const recentLeads = leads.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Total leads" value={totalLeads} />
        <Card title="Leads today" value={leadsToday} />
        <Card title="Active conversations" value={activeConversations} />
        <Card title="Engagement Rate" value={`${engagementRate}%`} />
      </div>

      <Chart title="Leads per day" subtitle="Last 7 days">
        {loading ? (
          <div className="flex h-[320px] items-center justify-center text-white/50">Loading chart...</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#ffffff1a" vertical={false} />
              <XAxis dataKey="label" stroke="#fff" tick={{ fill: '#fff', fontSize: 12 }} />
              <YAxis stroke="#fff" tick={{ fill: '#fff', fontSize: 12 }} />
              <Tooltip cursor={{ stroke: '#ffffff22', strokeWidth: 1 }} contentStyle={{ background: '#000', border: '1px solid rgba(255,255,255,0.12)' }} />
              <Line type="monotone" dataKey="count" stroke="#fff" strokeWidth={3} dot={{ r: 4, fill: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Chart>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Conversation Potential" value={conversationPotential} subtitle="Leads with >3 messages" />
        <Card title="Cold Leads" value={coldLeads} subtitle="Leads with 1 message" />
      </div>

      <Table title="Recent leads" subtitle="Latest lead activity">
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/60">Loading recent leads...</div>
        ) : recentLeads.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/60">No recent leads yet.</div>
        ) : (
          <table className="min-w-full text-left text-sm text-white/70">
            <thead>
              <tr className="border-b border-white/10 text-white/60">
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Phone</th>
                <th className="px-4 py-4">Interest</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-white/10 transition hover:bg-white/5">
                  <td className="px-4 py-4 font-medium text-white">{lead.name || '—'}</td>
                  <td className="px-4 py-4">{lead.phone || '—'}</td>
                  <td className="px-4 py-4">{lead.interest || '—'}</td>
                  <td className="px-4 py-4">{lead.status || 'Unknown'}</td>
                  <td className="px-4 py-4 text-white/50">{new Date(lead.created_at || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Table>
    </motion.div>
  );
}
