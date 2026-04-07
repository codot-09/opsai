export default function TaskRow({ task, command, statusColor, isExpanded, onToggle }) {
  return (
    <>
      <tr onClick={onToggle} className="border-b border-gray-200 transition hover:bg-gray-50 cursor-pointer">
        <td className="px-4 py-4 font-medium text-black">{task.name}</td>
        <td className="px-4 py-4 text-gray-600">{task.agent}</td>
        <td className="px-4 py-4">
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold border ${statusColor(task.status)}`}>
            {task.status}
          </span>
        </td>
        <td className="px-4 py-4 text-gray-600">{task.order}</td>
        <td className="px-4 py-4 text-gray-600">{new Date(task.created_at).toLocaleDateString()}</td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan="5" className="px-4 py-4 bg-gray-50">
            <div className="space-y-4">
              {command && (
                <div>
                  <h4 className="font-semibold text-gray-900">Command Input</h4>
                  <pre className="text-sm text-gray-700 bg-white p-2 rounded border">{command.user_input}</pre>
                  <h4 className="font-semibold text-gray-900 mt-4">Result Summary</h4>
                  <p className="text-sm text-gray-700">{command.result_summary}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-gray-900">Task Input</h4>
                <pre className="text-sm text-gray-700 bg-white p-2 rounded border">{JSON.stringify(task.input, null, 2)}</pre>
                <h4 className="font-semibold text-gray-900 mt-4">Task Output</h4>
                <pre className="text-sm text-gray-700 bg-white p-2 rounded border">{JSON.stringify(task.output, null, 2)}</pre>
                {task.error && (
                  <>
                    <h4 className="font-semibold text-gray-900 mt-4">Error</h4>
                    <pre className="text-sm text-red-800 bg-red-50 p-2 rounded border border-red-200">{task.error}</pre>
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