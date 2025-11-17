
import React, { useState, useCallback } from 'react';
import { SetupPanel } from './components/SetupPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { generatePromptsFromScenario, generatePromptsFromScript } from './services/promptService';
import { generateImage as generateImageFromApi } from './services/geminiService';
import { fileToBase64, readTextFile } from './utils/fileUtils';
import type { Scene, ApiKey, InputMode } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SettingsIcon } from './components/icons';

const App: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [characterImages, setCharacterImages] = useState<string[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState<boolean>(false);
  
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKey[]>('apiKeys', []);
  const [activeApiKey, setActiveApiKey] = useLocalStorage<string | null>('activeApiKey', null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleGeneratePrompts = useCallback(async (
    mode: InputMode,
    characterFiles: File[],
    scenario: string,
    duration: number,
    scriptFile: File | null
  ) => {
    setIsLoadingPrompts(true);
    setScenes([]);
    try {
      const imagePromises = characterFiles.map(file => fileToBase64(file));
      const base64Images = await Promise.all(imagePromises);
      setCharacterImages(base64Images);

      let newScenes: Scene[] = [];
      if (mode === 'scenario' && scenario && duration > 0) {
        newScenes = generatePromptsFromScenario(scenario, duration);
      } else if (mode === 'script' && scriptFile) {
        const scriptContent = await readTextFile(scriptFile);
        const scriptLines = scriptContent.split('\n').filter(line => line.trim() !== '');
        newScenes = generatePromptsFromScript(scriptLines);
      }
      setScenes(newScenes);
    } catch (error) {
      console.error("Error generating prompts:", error);
      alert("Failed to generate prompts. Please check the console for details.");
    } finally {
      setIsLoadingPrompts(false);
    }
  }, []);

  const handleGenerateImage = useCallback(async (sceneId: number) => {
    const activeKey = apiKeys.find(k => k.key === activeApiKey);
    if (!activeKey) {
      alert("Please set an active API key in settings.");
      return;
    }
    
    setScenes(prevScenes =>
      prevScenes.map(s => (s.id === sceneId ? { ...s, isLoading: true } : s))
    );

    try {
      const scene = scenes.find(s => s.id === sceneId);
      if (!scene) throw new Error("Scene not found");

      const generatedImageUrl = await generateImageFromApi(
        activeKey.key,
        characterImages,
        scene.imagePrompt
      );

      setScenes(prevScenes =>
        prevScenes.map(s =>
          s.id === sceneId
            ? { ...s, image: generatedImageUrl, isLoading: false }
            : s
        )
      );
    } catch (error) {
      console.error("Error generating image:", error);
      alert(`Failed to generate image for Scene ${sceneId}. Check console for details.`);
      setScenes(prevScenes =>
        prevScenes.map(s => (s.id === sceneId ? { ...s, isLoading: false } : s))
      );
    }
  }, [scenes, characterImages, activeApiKey, apiKeys]);

  const handleGenerateAllImages = useCallback(async () => {
    for (const scene of scenes) {
      if (!scene.image) {
        await handleGenerateImage(scene.id);
      }
    }
  }, [scenes, handleGenerateImage]);

  return (
    <div className="min-h-screen bg-[#0c101c] text-gray-200 font-sans">
      <header className="py-4 px-6 md:px-10 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
          Tool Tự Động Hóa Chủ Đề Người Tiền Sử
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
        >
          <SettingsIcon />
          API Settings
        </button>
      </header>

      <main className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <SetupPanel onGenerate={handleGeneratePrompts} isLoading={isLoadingPrompts} />
        </div>
        <div className="lg:col-span-8">
          <ResultsPanel
            scenes={scenes}
            onGenerateImage={handleGenerateImage}
            onGenerateAllImages={handleGenerateAllImages}
            isLoading={isLoadingPrompts}
          />
        </div>
      </main>

      {isModalOpen && (
        <ApiSettingsModal
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          activeApiKey={activeApiKey}
          setActiveApiKey={setActiveApiKey}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
