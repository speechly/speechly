import { createContext, useEffect, useState, ReactNode, useContext } from 'react';

type ResultObject = {
  kind: string;
  title: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
}

type SearchInfo = {
  correctedQuery: string,
  formattedSearchTime: string,
  formattedTotalResults: string
}

type QueryValue = {
  query: string;
  setQuery: (string: string) => void;
  results: ResultObject[] | undefined;
  getResults: (string: string) => void;
  searchInfo: SearchInfo | undefined;
};

type Props = {
  children: ReactNode;
};

export const SearchContext = createContext<QueryValue | undefined>(undefined);

export const SearchContextProvider = ({ children }: Props) => {
  const [query, setQuery] = useState("");
  const [searchInfo, setSearchInfo] = useState<SearchInfo>();
  const [results, setResults] = useState<ResultObject[]>();
  const apiKey = process.env.REACT_APP_VOICE_SEARCH_API_KEY || ""
  const engineId = process.env.REACT_APP_VOICE_SEARCH_ENGINE_ID || ""

  const getResults = (string: string) => {
    const searchUrl = new URL("https://customsearch.googleapis.com/customsearch/v1")
    searchUrl.searchParams.append("key", apiKey)
    searchUrl.searchParams.append("cx", engineId)
    searchUrl.searchParams.append("q", string)
    fetch(searchUrl.toString())
      .then(res => res.json())
      .then(res => {
        setSearchInfo({
          correctedQuery: res.spelling?.correctedQuery,
          formattedSearchTime: res.searchInformation?.formattedSearchTime,
          formattedTotalResults: res.searchInformation?.formattedTotalResults
        })
        setResults(res.items)
      })
      .catch(e => console.warn(e));
  }

  useEffect(() => {
    if (query) setQuery(query);
  }, [query]);

  return (
    <SearchContext.Provider value={{ query, setQuery, results, getResults, searchInfo }}>
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
