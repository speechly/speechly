import React, { useCallback, useContext, useEffect, useState } from "react";
import { SpeechSegment, useSpeechContext } from "@speechly/react-client";
import { IFilter, IFilterConfiguration } from "types";
// import CloseIcon from "@material-ui/icons/Close";
// import { IconButton } from "@material-ui/core";
import AppContext, { debugInfo, FilterConfig } from "AppContext";
import MegaMenu, { MegaMenuItem } from "./MegaMenu";
import PubSub from "pubsub-js";
import "./SmartFilters.css";
import { SpeechlyUiEvents } from "@speechly/react-ui/lib/types";
import RoundButton from "./RoundButton";

const SmartFilter: React.FC = (props) => {
  const { segment } = useSpeechContext();
  const { filters, filterDispatch } = useContext(AppContext);
  const [showFilterOptions, setShowFilterOptions] = useState(-1);

  useEffect(() => {
    if (segment) {
      intepretSegment(segment);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]);

  const intepretSegment = useCallback(
    (segment: SpeechSegment) => {
      filterDispatch({ type: "segment", segment: segment });

      if (segment.intent.intent === "clear") {
        window.postMessage({ type: "speechhandled", success: true }, "*")
        filterDispatch({ type: "clear_all" });
        setShowFilterOptions(-1);
        return;
      }

      let appliedFilters: {[filter: string]: {value: string, optionFound: boolean}} = {}

      if (segment.intent.intent === "filter") {
        // Iterate entities in reverse order as possible later duplicate entity types should take precedence
        // Apply the changes to model
        segment.entities.slice().reverse().forEach((entity) => {
          let filterConfig = FilterConfig.find(
            (filterConfigCandidate) =>
              filterConfigCandidate.key.toLowerCase() ===
              entity.type.toLowerCase()
          );
          if (filterConfig) {
            if (!Object.keys(appliedFilters).includes(filterConfig.key)) {
              appliedFilters[filterConfig.key] = 
              {
                value: entity.value.toLowerCase(),
                optionFound: false
              };

              let option = filterConfig.data.options.find(
                (candidate) =>
                  String(candidate[0]).toLowerCase() ===
                  entity.value.toLowerCase()
              );

              if (option) {
                appliedFilters[filterConfig.key].optionFound = true;
                if (
                  !filters[filterConfig.key] ||
                  // eslint-disable-next-line eqeqeq
                  filters[filterConfig.key].value != option[0]
                ) {
                  filterDispatch({
                    type: "set",
                    filterKey: filterConfig.key,
                    value: String(option[0]),
                  });
                  PubSub.publish(SpeechlyUiEvents.DismissNotification);

                  // console.log(`Setting value ${entity.value} for `, filterConfig);
                }
              }
            }
          } else {
            console.warn(
              `WARN: Could not find a matching filter for ${entity.type}. The configured options are: `,
              filters
            );
          }
        });
      };

      if (segment.isFinal) {
        filterDispatch({ type: "segment_finalized", segment: segment });
        const changesMade = debugInfo.numFilterChanges.current - debugInfo.numFilterChanges.last;
        if (changesMade === 0) {
          // Feedback about a missing brand
          if (appliedFilters.brand?.optionFound === false) {
            PubSub.publish(SpeechlyUiEvents.Notification,
              {
                message: `Sorry, we don't have anything from ${appliedFilters.brand.value}.`,
                footnote: `Try another brand like "Diesel"`
              });
          }
          else if (appliedFilters.category?.optionFound === false) {
            PubSub.publish(SpeechlyUiEvents.Notification,
              {
                message: `Sorry, we don't have any ${appliedFilters.category.value}.`,
                footnote: `Try another product category like "dresses"`
              });
          }
          else if (debugInfo.numActiveFilters.last > 0) {
            const tips = [
              `Try: "Red" to refine the search`,
              `Try: "Clear" to restart search`,
            ];
            const tip = tips[Math.floor(Math.random() * tips.length)];
            PubSub.publish(SpeechlyUiEvents.Notification, {message: `Please say again your fashion search`, footnote: tip});
          } else {
            const tips = [
              `Try: "Blue jeans"`,
              `Try: "I need a dress"`,
              `Try: "Show me yellow rubber boots"`,
              `Try: "Clear" to restart search`,
            ];
            const tip = tips[Math.floor(Math.random() * tips.length)];
            PubSub.publish(SpeechlyUiEvents.Notification, {message: `Please say again your fashion search`, footnote: tip});
          }
        }
      }
    },
    [filters, filterDispatch]
  );

  const clearFilter = (filterKey: string) => {
    filterDispatch({ type: "clear", filterKey: filterKey });
    setShowFilterOptions(-1);
  };

  const changeFilter = (filterKey: string, value: string) => {
    filterDispatch({ type: "set", filterKey: filterKey, value: value });
    setShowFilterOptions(-1);
  };

  const toggleMenu = useCallback(
    (menuIndex) => {
      if (menuIndex !== showFilterOptions) {
        setShowFilterOptions(menuIndex);
      } else {
        setShowFilterOptions(-1);
      }
    },
    [showFilterOptions]
  );

  const getOptionDisplayName = useCallback(
    (f: IFilterConfiguration) => {
      let userSelection = filters[f.key];
      if (!userSelection) return "";
      let i = f.data.options.find((item) => item[0] == userSelection.value);
      return i ? i[1] : "";
    },
    [filters]
  );

  return (
    <>
      <div className="SmartFilters">
        {FilterConfig.map((filterConfig, index) => (
          <div key={filterConfig.key} className={`SmartFilter`}>
            <div className="filterWidget" onClick={() => toggleMenu(index)}>
              <div className="filterLabel">{filterConfig.label}</div>
              <div className="filterValue">
                <div className="filterValue1">
                  {getOptionDisplayName(filterConfig)}
                </div>
                {filters[filterConfig.key] && (
                  <div className="filterValue2">
                    <RoundButton
                      size="1rem"
                      hitArea="1.5rem"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        clearFilter(filterConfig.key);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" style={{width: "0.60rem", height: "0.60rem"}} overflow="visible" stroke="currentColor" strokeWidth="10" strokeLinecap="round">
                        <line x1="0" y1="0" x2="50" y2="50" />
                        <line x1="50" y1="0" x2="0" y2="50" />
                      </svg>
                    </RoundButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {FilterConfig.map((f, index) => (
        <div
          key={f.key}
          style={{
            position: "relative",
            display: showFilterOptions === index ? "block" : "none",
          }}
        >
          <FilterMegaMenu
            filterConfig={f}
            filter={filters[f.key]}
            onClose={() => setShowFilterOptions(-1)}
            changeFilter={changeFilter}
          ></FilterMegaMenu>
        </div>
      ))}
    </>
  );
};

const FilterMegaMenu: React.FC<{
  filterConfig: IFilterConfiguration;
  filter: IFilter;
  onClose: () => void;
  changeFilter: (filter: string, value: string) => void;
}> = (props) => {
  return (
    <MegaMenu title={props.filterConfig.label} onClose={props.onClose}>
      {props.filterConfig.data.options.map((item) => (
        <MegaMenuItem
          key={String(item[0])}
          onChange={() =>
            props.changeFilter(props.filterConfig.key, String(item[0]))
          }
        >
          {item[1]}
        </MegaMenuItem>
      ))}
    </MegaMenu>
  );
};

export default SmartFilter;
