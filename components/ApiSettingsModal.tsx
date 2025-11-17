
import React, { useState } from 'react';
import type { ApiKey } from '../types';
import { TrashIcon } from './icons';

interface ApiSettingsModalProps {
  apiKeys: ApiKey[];
  setApiKeys: (keys: ApiKey[]) => void;
  activeApiKey: string | null;
  setActiveApiKey: (key: string | null) => void;
  onClose: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  apiKeys,
  setApiKeys,
  activeApiKey,
  setActiveApiKey,
  onClose,
}) => {
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  const handleAddKey = () => {
    if (newKeyName.trim() && newKeyValue.trim()) {
      const newKey = { name: newKeyName, key: newKeyValue };
      const updatedKeys = [...apiKeys, newKey];
      setApiKeys(updatedKeys);
      if (!activeApiKey) {
        setActiveApiKey(newKey.key);
      }
      setNewKeyName('');
      setNewKeyValue('');
    }
  };

  const handleDeleteKey = (keyToDelete: string) => {
    const updatedKeys = apiKeys.filter(k => k.key !== keyToDelete);
    setApiKeys(updatedKeys);
    if (activeApiKey === keyToDelete) {
      setActiveApiKey(updatedKeys.length > 0 ? updatedKeys[0].key : null);
    }
  };
  
  const handleSetActive = (keyToActivate: string) => {
    setActiveApiKey(keyToActivate);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#131a2b] w-full max-w-2xl rounded-lg border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-cyan-400">API Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>

        <div className="p-5 space-y-6">
          {/* Add New Key Form */}
          <div className="space-y-3 p-4 bg-[#0c101c] rounded-md border border-gray-700">
             <h3 className="text-lg font-medium text-gray-200">Add New Google AI API Key</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input
                type="text"
                placeholder="Key Name (e.g., My Project Key)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full bg-[#1e293b] border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
                <input
                type="password"
                placeholder="API Key"
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
                className="w-full bg-[#1e293b] border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
            </div>
             <button
              onClick={handleAddKey}
              className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 disabled:bg-gray-600 transition-colors"
              disabled={!newKeyName.trim() || !newKeyValue.trim()}
            >
              Add Key
            </button>
          </div>

          {/* Key List */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-200 mb-2">Saved Keys</h3>
            {apiKeys.length === 0 ? (
                <p className="text-gray-500 text-sm">No API keys saved yet.</p>
            ) : (
                <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                {apiKeys.map((apiKey) => (
                    <div key={apiKey.key} className="flex items-center justify-between p-3 bg-[#0c101c] rounded-md border border-gray-700">
                    <div>
                        <p className="font-semibold text-gray-200">{apiKey.name}</p>
                        <p className="text-xs text-gray-500">{`...${apiKey.key.slice(-4)}`}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleSetActive(apiKey.key)}
                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                            activeApiKey === apiKey.key
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                            }`}
                        >
                            {activeApiKey === apiKey.key ? 'Active' : 'Set Active'}
                        </button>
                        <button onClick={() => handleDeleteKey(apiKey.key)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                           <TrashIcon />
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
