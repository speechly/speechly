import React, { useCallback, useContext, useEffect, useState } from "react";
import { SpeechSegment, useSpeechContext } from "@speechly/react-client";
import classNames from "classnames";
import { IFilter, IFilterConfiguration } from "types";
import AppContext, { debugInfo, FilterConfig } from "AppContext";
import { SpeechlyUiEvents } from "@speechly/react-ui/lib/types";
import MegaMenu, { MegaMenuItem } from "./MegaMenu";
import PubSub from "pubsub-js";
import "./SmartFilters.css";
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

  useEffect(() => {
    if (showFilterOptions > 0) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [showFilterOptions])

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
        let changesMade = debugInfo.numFilterChanges.current - debugInfo.numFilterChanges.last;

        // Open a GUI menu if a "filter" entity type found, e.g. "What brands do you have"
        const filterName = segment.entities.find(e => e.type === "filter")?.value;
        if (filterName) {
          changesMade++;
          const filterIndex = FilterConfig.findIndex(f => f.key === filterName);
          setShowFilterOptions(filterIndex);
        } else {
          setShowFilterOptions(-1);
        }

        // Show feedback if the app couldn't parse the request
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
    (menuIndex: number) => {
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
      // Need == comparison to work with both string and number ids
      // eslint-disable-next-line
      let i = f.data.options.find((item) => item[0] == userSelection.value);
      return i ? i[1] : "";
    },
    [filters]
  );

  const filterClass = (hasValue: boolean) => classNames({
    SmartFilter: true,
    'SmartFilter--hasValue': hasValue
  })

  const menuClass = (isOpen: boolean) => classNames({
    Megamenu__outer: true,
    'Megamenu__outer--open': isOpen,
  })

  return (
      <div className="SmartFilters__outer">
        <div className="SmartFilters">
          <div className="SmartFilters__inner">
            {FilterConfig.map((filterConfig, index) => (
              <div key={filterConfig.key} className={filterClass(!!filters[filterConfig.key])} onClick={() => toggleMenu(index)}>
                <div className="SmartFilter__value">
                  {getOptionDisplayName(filterConfig) || filterConfig.label}
                </div>
                {filters[filterConfig.key] && (
                  <div className="SmartFilter__close">
                    <RoundButton
                      size="1rem"
                      hitArea="1.5rem"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        clearFilter(filterConfig.key);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="8" height="8" overflow="visible" stroke="currentColor" strokeWidth="5" strokeLinecap="butt">
                        <line x1="0" y1="0" x2="24" y2="24" />
                        <line x1="24" y1="0" x2="0" y2="24" />
                      </svg>
                    </RoundButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {FilterConfig.map((f, index) => (
          <div
            key={f.key}
            className={menuClass(showFilterOptions === index)}
            onClick={() => setShowFilterOptions(-1)}
          >
            <FilterMegaMenu
              filterConfig={f}
              filter={filters[f.key]}
              changeFilter={changeFilter}
            ></FilterMegaMenu>
          </div>
        ))}
      </div>
  );
};

const FilterMegaMenu: React.FC<{
  filterConfig: IFilterConfiguration;
  filter: IFilter;
  changeFilter: (filter: string, value: string) => void;
}> = (props) => {
  return (
    <MegaMenu title={props.filterConfig.label}>
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
