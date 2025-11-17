
export interface Scene {
  id: number;
  source: 'Scenario' | 'Script';
  imagePrompt: string;
  videoPrompt: string;
  image: string | null;
  isLoading: boolean;
}

export interface ApiKey {
  name: string;
  key: string;
}

export type InputMode = 'scenario' | 'script';
