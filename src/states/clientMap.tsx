import { Dispatch, SetStateAction, createContext, memo, useState } from 'react';

interface ClientMapProviderProps {
  children: React.ReactNode;
}

export const ClientMapContext = createContext<[boolean, Dispatch<SetStateAction<boolean>> | null]>([
  true,
  null,
]);

export const ClientMapProvider = memo<ClientMapProviderProps>(({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ClientMapContext.Provider value={[isLoading, setIsLoading]}>
      {children}
    </ClientMapContext.Provider>
  );
});

ClientMapProvider.displayName = 'ClientMapProvider';
