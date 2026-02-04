import { useScript } from '../contexts/ScriptContext';

export default function ScriptToggle() {
  const { script, toggleScript } = useScript();

  return (
    <button
      onClick={toggleScript}
      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors border border-gray-300 rounded-lg hover:border-blue-600"
      title={script === 'sr-Latn' ? 'Пребаци на ћирилицу' : 'Prebaci na latinicu'}
    >
      {script === 'sr-Latn' ? 'Ћир' : 'Lat'}
    </button>
  );
}
