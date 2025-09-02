
'use client';

import React, { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useLanguage } from './language-context';

const INTERACTION_THRESHOLD = 2;

interface InterstitialAdContextType {
  triggerInteraction: () => void;
}

const InterstitialAdContext = createContext<InterstitialAdContextType | undefined>(undefined);

/**
 * Componente do modal de anúncio.
 * Exibe um placeholder de anúncio em um diálogo de alerta que o usuário pode fechar.
 * @param {object} props
 * @param {boolean} props.isOpen - Controla a visibilidade do modal.
 * @param {() => void} props.onClose - Função chamada quando o modal é fechado.
 */
function InterstitialAd({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('advertisement')}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="py-4">
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-3866356690472317"
            data-ad-slot="1879087987"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


/**
 * Provedor de contexto para o anúncio intersticial.
 * Gerencia a contagem de interações do usuário e exibe o modal de anúncio
 * quando o limite de interações é atingido.
 * @param {object} props
 * @param {React.ReactNode} props.children - Os componentes filhos que terão acesso ao contexto.
 */
export function InterstitialAdProvider({ children }: { children: ReactNode }) {
  const [interactionCount, setInteractionCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Incrementa o contador de interações e exibe o modal se o limite for atingido.
   * O contador é resetado após o modal ser exibido.
   */
  const triggerInteraction = useCallback(() => {
    const newCount = interactionCount + 1;
    if (newCount > INTERACTION_THRESHOLD) {
      setIsModalOpen(true);
      setInteractionCount(0); // Reseta o contador
    } else {
      setInteractionCount(newCount);
    }
  }, [interactionCount]);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const value = { triggerInteraction };

  return (
    <InterstitialAdContext.Provider value={value}>
      {children}
      <InterstitialAd isOpen={isModalOpen} onClose={closeModal} />
    </InterstitialAdContext.Provider>
  );
}

/**
 * Hook customizado para acionar uma interação.
 * @returns {{ triggerInteraction: () => void }}
 */
export function useInterstitialAd() {
  const context = useContext(InterstitialAdContext);
  if (context === undefined) {
    throw new Error('useInterstitialAd must be used within an InterstitialAdProvider');
  }
  return context;
}
