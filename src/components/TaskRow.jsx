export default function TaskRow({ task, command, statusColor, isExpanded, onToggle }) {
  return (
    <>
      <tr onClick={onToggle} className="border-b border-white/10 transition hover:bg-white/5 cursor-pointer">
        <td className="px-4 py-4 font-medium text-white">{task.name}</td>
        <td className="px-4 py-4">{task.agent}</td>
        <td className="px-4 py-4">
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold text-white ${statusColor(task.status)}`}>
            {task.status}
          </span>
        </td>
        <td className="px-4 py-4">{task.order}</td>
        <td className="px-4 py-4 text-white/50">{new Date(task.created_at).toLocaleDateString()}</td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan="5" className="px-4 py-4 bg-white/5">
            <div className="space-y-4">
              {command && (
                <div>
                  <h4 className="font-semibold text-white">Command Input</h4>
                  <pre className="text-sm text-white/80 bg-black/50 p-2 rounded">{command.user_input}</pre>
                  <h4 className="font-semibold text-white mt-4">Result Summary</h4>
                  <p className="text-sm text-white/80">{command.result_summary}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-white">Task Input</h4>
                <pre className="text-sm text-white/80 bg-black/50 p-2 rounded">{JSON.stringify(task.input, null, 2)}</pre>
                <h4 className="font-semibold text-white mt-4">Task Output</h4>
                <pre className="text-sm text-white/80 bg-black/50 p-2 rounded">{JSON.stringify(task.output, null, 2)}</pre>
                {task.error && (
                  <>
                    <h4 className="font-semibold text-white mt-4">Error</h4>
                    <pre className="text-sm text-red-200 bg-red-900/20 p-2 rounded">{task.error}</pre>
                  </>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}