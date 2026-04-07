import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import Card from '../components/Card.jsx';
import Table from '../components/Table.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import ChatDrawer from '../components/ChatDrawer.jsx';
import NotesEditor from '../components/NotesEditor.jsx';

const PAGE_SIZE = 8;

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [interestQuery, setInterestQuery] = useState('');
  const [page, setPage] = useState(1);
  const [chatLead, setChatLead] = useState(null);

  const updateLeadStatus = async (leadId, newStatus) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);
    if (error) {
      setError(error.message);
    } else {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
    }
  };

  const updateLeadNotes = async (leadId, notes) => {
    const { error } = await supabase
      .from('leads')
      .update({ notes })
      .eq('id', leadId);
    if (error) {
      setError(error.message);
      throw error;
    } else {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, notes } : lead
        )
      );
    }
  };

  useEffect(() => {
    const loadLeads = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (fetchError) {
        setError(fetchError.message);
        setLeads([]);
      } else {
        setLeads(data || []);
      }
      setLoading(false);
    };

    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        if (search) {
          const query = search.toLowerCase();
          const name = String(lead.name || '').toLowerCase();
          const phone = String(lead.phone || '').toLowerCase();
          if (!name.includes(query) && !phone.includes(query)) return false;
        }
        if (statusQuery && !String(lead.status || '').toLowerCase().includes(statusQuery.toLowerCase())) return false;
        if (interestQuery && !String(lead.interest || '').toLowerCase().includes(interestQuery.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [leads, search, statusQuery, interestQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-white/40">Leads</p>
          <h2 className="text-3xl font-semibold tracking-tight text-black">Pipeline overview</h2>
          <p className="max-w-2xl text-gray-600">Search and review leads from your Supabase database.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card title="Total leads" value={leads.length} />
          <Card title="Open leads" value={leads.filter((lead) => lead.status !== 'Closed').length} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Search</p>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or phone"
            className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Status</p>
          <input
            value={statusQuery}
            onChange={(event) => setStatusQuery(event.target.value)}
            placeholder="e.g. Interested"
            className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Interest</p>
          <input
            value={interestQuery}
            onChange={(event) => setInterestQuery(event.target.value)}
            placeholder="e.g. Growth"
            className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <Table title="Lead list" subtitle="Sorted by newest first">
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">Loading leads...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>
        ) : paginatedLeads.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">No leads found.</div>
        ) : (
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Interest</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Notes</th>
                <th className="px-4 py-4">Source</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-200 transition hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-black">{lead.name || '—'}</td>
                  <td className="px-4 py-4">{lead.interest || '—'}</td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      status={lead.status}
                      onChange={(newStatus) => updateLeadStatus(lead.id, newStatus)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <NotesEditor
                      lead={lead}
                      onSave={updateLeadNotes}
                    />
                  </td>
                  <td className="px-4 py-4">telegram</td>
                  <td className="px-4 py-4 text-gray-500">{new Date(lead.created_at || Date.now()).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setChatLead(lead)}
                      className="p-2 rounded-full hover:bg-gray-100 transition"
                      title="Open Chat"
                    >
                      <MessageCircle className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-600">
        <span>{filteredLeads.length} total leads</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>
          <span>Page {currentPage} of {pageCount}</span>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            disabled={currentPage === pageCount}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
      {chatLead && <ChatDrawer lead={chatLead} onClose={() => setChatLead(null)} />}
    </motion.div>
  );
}
