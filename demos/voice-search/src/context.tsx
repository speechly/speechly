import { createContext, useEffect, useState, ReactNode, useContext } from 'react';

type QueryValue = {
  query: string;
  setQuery: (query: string) => void;
};

export const SearchContext = createContext<QueryValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const SearchContextProvider = ({ children }: Props) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query) setQuery(query);
    // const q = new URLSearchParams(query).toString()
    // fetch(`https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyBANvANOQLMa0Cia2BpvaQD3Wt8BNljhrw&cx=2a0f5abcd4b9e63a4&safe=active&q=${q}`)
    //   .then(res => {
    //     if (res.status !== 200) {
    //       return "something went wrong"
    //     }
    //     console.log(res.body);
    //     return res.json();
    //   })
    //   .catch(e => console.warn(e));
  }, [query]);

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
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