
import React, { useCallback } from 'react';
import type { Scene } from '../types';
import { SceneCard } from './SceneCard';
import { DownloadIcon, CopyIcon, ImageIcon } from './icons';

interface ResultsPanelProps {
  scenes: Scene[];
  isLoading: boolean;
  onGenerateImage: (sceneId: number) => void;
  onGenerateAllImages: () => void;
}

declare const XLSX: any;

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  scenes,
  isLoading,
  onGenerateImage,
  onGenerateAllImages,
}) => {

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${type} copied to clipboard!`);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, []);

  const handleCopyAll = (type: 'image' | 'video') => {
    const textToCopy = scenes.map(scene => type === 'image' ? scene.imagePrompt : scene.videoPrompt).join('\n\n');
    copyToClipboard(textToCopy, `All ${type} prompts`);
  };
  
  const handleDownloadAllImages = () => {
    scenes.forEach((scene, index) => {
      if (scene.image) {
        const link = document.createElement('a');
        link.href = scene.image;
        link.download = `scene_${index + 1}.png`;
        document.body.appendChild(link);
        setTimeout(() => {
            link.click();
            document.body.removeChild(link);
        }, index * 200); // Stagger downloads to avoid browser blocking
      }
    });
  };

  const handleDownloadXLSX = () => {
    const worksheetData = scenes.map(scene => [
      `Scene ${scene.id}`,
      scene.imagePrompt,
      scene.videoPrompt,
    ]);
    worksheetData.unshift(['Scene', 'Image Prompt', 'Video Prompt']); // Add header

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const colWidths = [{ wch: 10 }, { wch: 80 }, { wch: 80 }];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Prompts');
    XLSX.writeFile(wb, 'Generated_Prompts.xlsx');
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#131a2b] rounded-lg border border-gray-700 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        <p className="mt-4 text-gray-400">Generating prompts...</p>
      </div>
    );
  }

  if (scenes.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#131a2b] rounded-lg border border-gray-700 p-8 min-h-[500px]">
        <h3 className="text-xl font-semibold text-gray-300">Prompts will appear here</h3>
        <p className="text-gray-500 mt-2">Complete the setup on the left to generate prompts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#131a2b] p-4 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold text-cyan-400 mb-4">2. Generated Prompts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <button onClick={onGenerateAllImages} className="flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-xs font-medium transition-colors">
            <ImageIcon /> Generate All Images
          </button>
          <button onClick={handleDownloadAllImages} className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs font-medium transition-colors">
            <DownloadIcon /> Download All Images
          </button>
          <button onClick={() => handleCopyAll('image')} className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs font-medium transition-colors">
            <CopyIcon /> Copy All Image Prompts
          </button>
          <button onClick={() => handleCopyAll('video')} className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs font-medium transition-colors">
            <CopyIcon /> Copy All Video Prompts
          </button>
           <button onClick={handleDownloadXLSX} className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs font-medium transition-colors">
            <DownloadIcon /> Download All Prompts (XLSX)
          </button>
        </div>
      </div>
      <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
        {scenes.map((scene) => (
          <SceneCard key={scene.id} scene={scene} onGenerateImage={onGenerateImage} />
        ))}
      </div>
    </div>
  );
};
