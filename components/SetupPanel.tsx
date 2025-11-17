
import React, { useState, useRef, useCallback } from 'react';
import type { InputMode } from '../types';
import { UploadIcon, FileIcon, TrashIcon } from './icons';

interface SetupPanelProps {
  onGenerate: (
    mode: InputMode,
    characterFiles: File[],
    scenario: string,
    duration: number,
    scriptFile: File | null
  ) => void;
  isLoading: boolean;
}

export const SetupPanel: React.FC<SetupPanelProps> = ({ onGenerate, isLoading }) => {
  const [characterFiles, setCharacterFiles] = useState<File[]>([]);
  const [scenario, setScenario] = useState<string>('A lone hunter tracking a mammoth');
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number>(15);
  const [inputMode, setInputMode] = useState<InputMode>('scenario');

  const charFileInputRef = useRef<HTMLInputElement>(null);
  const scriptFileInputRef = useRef<HTMLInputElement>(null);

  const handleCharFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      setCharacterFiles(files);
    }
  };

  const handleScriptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'text/plain') {
        setScriptFile(file);
        setInputMode('script');
      } else {
        alert('Please upload a .txt file.');
      }
    }
  };

  const handleScenarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScenario(e.target.value);
    if(e.target.value) {
        setInputMode('scenario');
        setScriptFile(null); // Clear script if user types in scenario
    }
  };
  
  const handleRemoveScript = () => {
    setScriptFile(null);
    if(scriptFileInputRef.current) {
        scriptFileInputRef.current.value = "";
    }
    // Revert to scenario mode if script is removed, unless scenario is also empty
    if(scenario) {
        setInputMode('scenario');
    }
  };

  const isGenerateDisabled = () => {
    if (isLoading) return true;
    if (characterFiles.length !== 3) return true;
    if (inputMode === 'scenario' && (!scenario.trim() || duration <= 0)) return true;
    if (inputMode === 'script' && !scriptFile) return true;
    return false;
  };

  const getTooltipText = () => {
    if (characterFiles.length !== 3) return "Please upload exactly 3 character images.";
    if (inputMode === 'scenario' && (!scenario.trim() || duration <= 0)) return "Please provide a scenario and a valid duration.";
    if (inputMode === 'script' && !scriptFile) return "Please upload a script file.";
    return "";
  };


  return (
    <div className="bg-[#131a2b] p-6 rounded-lg border border-gray-700 space-y-6">
      <h2 className="text-lg font-semibold text-cyan-400">1. Setup</h2>

      {/* Character Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          <span className="text-red-500 mr-1">*</span>Upload 3 Character Images
        </label>
        <div
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-cyan-500 transition-colors"
          onClick={() => charFileInputRef.current?.click()}
        >
          <UploadIcon />
          <p className="mt-2 text-sm text-gray-400">Click to upload files</p>
          <input
            type="file"
            ref={charFileInputRef}
            onChange={handleCharFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
        </div>
        {characterFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {characterFiles.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`character ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
            ))}
          </div>
        )}
        {characterFiles.length > 0 && characterFiles.length !== 3 && (
            <p className="text-xs text-red-500 mt-2">Please select exactly 3 images.</p>
        )}
      </div>

      {/* Scenario / Topic */}
      <div>
        <label htmlFor="scenario" className="block text-sm font-medium mb-2 text-gray-300">
        <span className="text-orange-400 mr-1">■</span> Scenario / Topic
        </label>
        <textarea
          id="scenario"
          value={scenario}
          onChange={handleScenarioChange}
          placeholder="e.g., A lone hunter tracking a mammoth"
          rows={3}
          className="w-full bg-[#0c101c] border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </div>

      <div className="flex items-center text-gray-500">
        <hr className="flex-grow border-gray-600" />
        <span className="px-2 text-xs">OR</span>
        <hr className="flex-grow border-gray-600" />
      </div>

      {/* Upload Script */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
        <span className="text-orange-400 mr-1">■</span> Upload Script (.txt)
        </label>
        {scriptFile ? (
            <div className="flex items-center justify-between p-3 bg-[#0c101c] border border-gray-600 rounded-md">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <FileIcon />
                    <span>{scriptFile.name}</span>
                </div>
                <button onClick={handleRemoveScript} className="text-gray-500 hover:text-red-500">
                    <TrashIcon />
                </button>
            </div>
        ) : (
            <div
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-cyan-500 transition-colors"
            onClick={() => scriptFileInputRef.current?.click()}
            >
            <UploadIcon />
            <p className="mt-2 text-sm text-gray-400">Click to upload a .txt file</p>
            <input
                type="file"
                ref={scriptFileInputRef}
                onChange={handleScriptFileChange}
                accept=".txt"
                className="hidden"
            />
            </div>
        )}
      </div>
      
      {/* Video Duration */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium mb-2 text-gray-300">
        <span className="text-red-500 mr-1">●</span> Video Duration (minutes)
        </label>
        <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            min="1"
            className="w-full bg-[#0c101c] border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            disabled={inputMode === 'script'}
        />
      </div>

      {/* Generate Button */}
      <div className="relative group">
        <button
          onClick={() => onGenerate(inputMode, characterFiles, scenario, duration, scriptFile)}
          disabled={isGenerateDisabled()}
          className="w-full px-4 py-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            'Generate Prompts'
          )}
        </button>
        {isGenerateDisabled() && !isLoading && (
          <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {getTooltipText()}
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        )}
      </div>
    </div>
  );
};
