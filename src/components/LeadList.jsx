import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { getCurrentWorkspaceId } from '../lib/workspace.js';

export default function LeadList({ onSelectLead, selectedLead }) {
  const [leads, setLeads] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      
      const workspaceId = await getCurrentWorkspaceId();
      if (!workspaceId) {
        console.error('No workspace found');
        setLoading(false);
        return;
      }
      
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (leadsError) {
        console.error(leadsError);
        setLeads([]);
      } else {
        setLeads(leadsData || []);
        // Fetch last messages for each lead
        const messagesPromises = leadsData.map(async (lead) => {
          const { data: msgData } = await supabase
            .from('messages')
            .select('content')
            .eq('lead_id', lead.id)
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false })
            .limit(1);
          return { leadId: lead.id, lastMessage: msgData?.[0]?.content || 'No messages' };
        });
        const messagesResults = await Promise.all(messagesPromises);
        const messagesMap = {};
        messagesResults.forEach(({ leadId, lastMessage }) => {
          messagesMap[leadId] = lastMessage;
        });
        setLastMessages(messagesMap);
      }
      setLoading(false);
    };

    fetchLeads();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-black mb-4">Leads</h2>
      {loading ? (
        <div className="text-gray-600">Loading leads...</div>
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className={`p-3 rounded-lg cursor-pointer transition ${
                selectedLead?.id === lead.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-black">{lead.name || 'Unknown'}</div>
              <div className="text-sm text-gray-600">{lead.interest || 'No interest'}</div>
              <div className="text-xs text-gray-500 truncate">{lastMessages[lead.id] || 'No messages'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}