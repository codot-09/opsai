import { useState } from 'react';
import LeadList from '../components/LeadList.jsx';
import ChatPanel from '../components/ChatPanel.jsx';

export default function ChatLayout() {
  const [selectedLead, setSelectedLead] = useState(null);

  return (
    <div className="flex h-full">
      <div className="w-80 border-r border-white/10 bg-black">
        <LeadList onSelectLead={setSelectedLead} selectedLead={selectedLead} />
      </div>
      <div className="flex-1 bg-black">
        <ChatPanel lead={selectedLead} />
      </div>
    </div>
  );
}