import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from 'wasp/client/auth';
import i18n from '../i18n/config';

type Script = 'sr-Latn' | 'sr-Cyrl';

interface ScriptContextType {
  script: Script;
  setScript: (script: Script) => void;
  toggleScript: () => void;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

const SCRIPT_STORAGE_KEY = 'knjizara_script';

export function ScriptProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useAuth();
  
  const [script, setScriptState] = useState<Script>(() => {
    // First check user preference from database
    if (user?.preferredScript === 'cyrillic') {
      return 'sr-Cyrl';
    }
    if (user?.preferredScript === 'latin') {
      return 'sr-Latn';
    }
    
    // Then check localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SCRIPT_STORAGE_KEY) as Script;
      if (stored === 'sr-Latn' || stored === 'sr-Cyrl') {
        return stored;
      }
    }
    
    // Default to Latin
    return 'sr-Latn';
  });

  // Sync with user preference when user changes
  useEffect(() => {
    if (user?.preferredScript === 'cyrillic') {
      setScriptState('sr-Cyrl');
    } else if (user?.preferredScript === 'latin') {
      setScriptState('sr-Latn');
    }
  }, [user?.preferredScript]);

  const setScript = (newScript: Script) => {
    setScriptState(newScript);
    localStorage.setItem(SCRIPT_STORAGE_KEY, newScript);
    
    // Update i18n language
    i18n.changeLanguage(newScript);
  };

  const toggleScript = () => {
    const newScript = script === 'sr-Latn' ? 'sr-Cyrl' : 'sr-Latn';
    setScript(newScript);
  };

  return (
    <ScriptContext.Provider value={{ script, setScript, toggleScript }}>
      {children}
    </ScriptContext.Provider>
  );
}

export function useScript() {
  const context = useContext(ScriptContext);
  if (context === undefined) {
    throw new Error('useScript must be used within a ScriptProvider');
  }
  return context;
}
