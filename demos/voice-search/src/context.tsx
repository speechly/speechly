import { createContext, useEffect, useState, ReactNode, useContext } from 'react';

type ResultObject = {
  kind: string;
  title: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
}

type QueryValue = {
  query: string;
  setQuery: (string: string) => void;
  results: ResultObject[] | undefined;
  getResults: (string: string) => void;
};

type Props = {
  children: ReactNode;
};

export const SearchContext = createContext<QueryValue | undefined>(undefined);

export const SearchContextProvider = ({ children }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultObject[]>();
  const apiKey = process.env.REACT_APP_VOICE_SEARCH_API_KEY
  const engineId = process.env.REACT_APP_VOICE_SEARCH_ENGINE_ID

  const getResults = (string: string) => {
    if (query === string) return
    const q = new URLSearchParams(string).toString()
    fetch(`https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${engineId}&safe=active&q=${q}`)
      .then(res => res.json())
      .then(res => setResults(res.items))
      .catch(e => console.warn(e));
  }

  useEffect(() => {
    if (query) setQuery(query);
  }, [query]);

  return (
    <SearchContext.Provider value={{ query, setQuery, results, getResults }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used inside AuthContext');
  }

  return context;
};
