
"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * Define um cookie no navegador.
 * @param {string} name - O nome do cookie.
 * @param {string} value - O valor do cookie.
 * @param {number} days - O número de dias até o cookie expirar.
 */
function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Obtém o valor de um cookie do navegador.
 * @param {string} name - O nome do cookie.
 * @returns {string|null} O valor do cookie ou null se não for encontrado.
 */
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Um hook customizado do React que cria um estado que persiste nos cookies do navegador.
 * Funciona de forma semelhante ao `useState`, mas salva o valor em um cookie
 * sempre que ele é alterado. Ao carregar, ele tenta recuperar o valor do cookie.
 *
 * @template T - O tipo do valor do estado.
 * @param {string} key - A chave única usada para salvar o estado no cookie.
 * @param {T} initialState - O estado inicial, usado se nenhum valor for encontrado no cookie.
 * @returns {[T, (value: T | ((prevState: T) => T)) => void, boolean]} Uma tupla contendo:
 * - O valor do estado atual.
 * - Uma função para atualizar o estado (semelhante ao `setState`).
 * - Um booleano `isMounted` que indica se o componente foi montado e o estado inicial foi carregado do cookie.
 */
function usePersistentState<T>(
  key: string,
  initialState: T
): [T, (value: T | ((prevState: T) => T)) => void, boolean] {
  const [isMounted, setIsMounted] = useState(false);
  const [state, setState] = useState<T>(initialState);

  // Efeito para carregar o estado do cookie na montagem do componente.
  useEffect(() => {
    setIsMounted(true);
    try {
      const storedValue = getCookie(key);
      if (storedValue) {
        setState(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error(`Error reading cookie key "${key}":`, error);
    }
  }, [key]);

  // Função para definir o estado, que também salva o novo valor no cookie.
  const setPersistentState = useCallback(
    (newValue: T | ((prevState: T) => T)) => {
      const valueToStore = newValue instanceof Function ? newValue(state) : newValue;
      setState(valueToStore);
      if (isMounted) {
        try {
          setCookie(key, JSON.stringify(valueToStore), 365); // Salva o cookie por 1 ano
        } catch (error) {
          console.error(`Error setting cookie key "${key}":`, error);
        }
      }
    },
    [key, isMounted, state]
  );

  return [state, setPersistentState, isMounted];
}

export default usePersistentState;
