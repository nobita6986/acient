
import React from 'react';
import type { Scene } from '../types';
import { CopyIcon, DownloadIcon, RegenerateIcon } from './icons';

interface SceneCardProps {
  scene: Scene;
  onGenerateImage: (sceneId: number) => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, onGenerateImage }) => {

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy: ', err));
  };
  
  const handleDownload = () => {
    if(!scene.image) return;
    const link = document.createElement('a');
    link.href = scene.image;
    link.download = `scene_${scene.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="bg-[#131a2b] p-4 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-cyan-400">Scene {scene.id}</h3>
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">From {scene.source}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Section */}
        <div className="flex flex-col gap-3">
          <div className="relative w-full h-48 bg-[#0c101c] rounded-md flex items-center justify-center border border-gray-600 overflow-hidden group">
            {scene.isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            ) : scene.image ? (
              <>
                <img src={scene.image} alt={`Scene ${scene.id}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleDownload} className="p-2 bg-gray-800 rounded-full text-white hover:bg-cyan-600 transition-colors"><DownloadIcon /></button>
                    <button onClick={() => onGenerateImage(scene.id)} className="p-2 bg-gray-800 rounded-full text-white hover:bg-cyan-600 transition-colors"><RegenerateIcon /></button>
                </div>
              </>
            ) : (
                <div className="text-center text-gray-500 text-sm">Image will appear here</div>
            )}
          </div>
           {!scene.image && (
             <button
                onClick={() => onGenerateImage(scene.id)}
                disabled={scene.isLoading}
                className="w-full px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-md hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
             >
                Generate Image
            </button>
           )}
        </div>

        {/* Prompts Section */}
        <div className="space-y-3">
            {/* Image Prompt */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-300">Image Prompt</label>
                    <button onClick={() => handleCopy(scene.imagePrompt)} className="text-gray-400 hover:text-cyan-400"><CopyIcon /></button>
                </div>
                <textarea
                    readOnly
                    value={scene.imagePrompt}
                    className="w-full h-24 bg-[#0c101c] border border-gray-600 rounded-md p-2 text-xs text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-600"
                />
            </div>
             {/* Video Prompt */}
             <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-300">Video Prompt</label>
                    <button onClick={() => handleCopy(scene.videoPrompt)} className="text-gray-400 hover:text-cyan-400"><CopyIcon /></button>
                </div>
                <textarea
                    readOnly
                    value={scene.videoPrompt}
                    className="w-full h-24 bg-[#0c101c] border border-gray-600 rounded-md p-2 text-xs text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-600"
                />
            </div>
        </div>
      </div>
    </div>
  );
};
