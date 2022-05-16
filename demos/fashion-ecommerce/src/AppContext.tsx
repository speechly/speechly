import React, { useReducer } from "react";
import { IFilters, IFilterConfiguration } from "types";
import Filters from "generated/filters.json";
import { SpeechSegment } from "@speechly/react-client";

export const FilterConfig: IFilterConfiguration[] = [
  {
    label: "Department",
    key: "sex",
    data: Filters.sex,
  },
  {
    label: "Product",
    key: "category",
    data: Filters.category,
  },
  {
    label: "Brand",
    key: "brand",
    data: Filters.brand,
  },
  {
    label: "Color",
    key: "colors",
    data: Filters.colors,
  },
  {
    label: "Size",
    key: "sizes",
    data: Filters.sizes,
  },
  {
    label: "Sort by",
    key: "sort",
    data: {
      options: [
        ["popularity_desc", "Most popular"],
        ["price_asc", "Cheapest"],
        ["price_desc", "Most exclusive"],
      ],
    },
  },
];

export const FilterDefaultState: IFilters = {};

const AppContextDefaultState = {
  filters: FilterDefaultState,
  filterDispatch: (action: any) => {},
};

const AppContext = React.createContext(AppContextDefaultState);

export const debugInfo = {
  numFilterChanges: {current: 0, last: 0},
  numActiveFilters: {last: 0},
  lastSegmentId: ""
}


const filterReducer = (filters: IFilters, action: any) => {
  switch (action.type) {
    case "set": {
      const { filterKey, value }: { filterKey: string; value: string, segmentId: string } = action;
      debugInfo.numFilterChanges.current++;
      return {
        ...filters,
        [filterKey]: {
          ...filters[filterKey],
          value: value,
        },
      };
    }
    case "clear_all": {
      return FilterDefaultState;
    }
    case "clear": {
      const { filterKey }: { filterKey: string } = action;
      const { [filterKey]: removedProp, ...filterCopy } = filters;
      return filterCopy;
    }
    case "segment": {
      const { segment }: { segment: SpeechSegment } = action;
      const segmentId = `${segment.contextId}/${segment.id}`;
      if (segmentId !== debugInfo.lastSegmentId) {
        // Track start of new segment
        debugInfo.lastSegmentId = segmentId;
        debugInfo.numFilterChanges.last = debugInfo.numFilterChanges.current;
        debugInfo.numActiveFilters.last = Object.keys(filters).length;
      }
      return filters;
    }
    case "segment_finalized": {
      const { segment }: { segment: SpeechSegment } = action;
      if (segment.intent.intent === "filter") {

        if (debugInfo.numFilterChanges.current-debugInfo.numFilterChanges.last > 0) {
          window.postMessage({ type: "speechhandled", success: true }, "*")
        }

      }
      return filters;
    }
    default:
      throw new Error();
  }
};

export const AppContextProvider: React.FC<{children?: React.ReactNode}> = (props) => {
  const [filters, filterDispatch] = useReducer(
    filterReducer,
    AppContextDefaultState.filters
  );

  return (
    <AppContext.Provider value={{ filters, filterDispatch }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
