import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import { IFilters, IProduct } from "types";
import AppContext from "AppContext";
import InventoryItem from "./InventoryItem";
import "./Inventory.css";

const FASHION_API_URL = process.env.REACT_APP__FASHION_API_URL || "https://ecom-fashion-demo-api.herokuapp.com"
const USE_SERVER_SIDE_FILTERING = true;
const PRODUCT_DATA_URL = process.env.REACT_APP__PRODUCT_DATA_URL || "/data_sample/products.json"

var batchNumber = 0;
const worker: Worker = new Worker("./webworkers/webworker.js");

const updateFilter = (filters: IFilters) => {
  const { sort, ...filter } = filters;
  let sortParams = {};
  if (sort) {
    const sortParts = sort.value.split("_");
    sortParams = { [sortParts[0]]: sortParts[1] === "desc" ? -1 : 1 };
  }
  const payload = {
    filter: filter,
    sort: sortParams,
    offset: 0,
    limit: 60,
  };

  if (USE_SERVER_SIDE_FILTERING) {
    let message = {
      action: "fetch",
      url: `${FASHION_API_URL}/get-inventory`,
      payload: payload,
    };
    worker.postMessage(message);
  } else {
    let message = {
      action: "filter",
      value: batchNumber,
      payload: payload,
    };
    worker.postMessage(message);
  }
  batchNumber++;
};

const Inventory: React.FC<{children: React.ReactNode}> = (props) => {
  const { filters } = useContext(AppContext);
  const [Products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const receivedWorkerMessage = (event: MessageEvent) => {
      if (event.data.action) {
        if (event.data.action === "products") {
          setProducts(event.data.result);
          setLoading(false);
        }
        if (event.data.action === "ready") {
          // Get initial products
          updateFilter(filters);
        }
        if (event.data.action === "payload") {
          setProducts(event.data.response.payload);
          setLoading(false);
        }
      }
    };

    const workerError = (error: ErrorEvent) => {
      console.error(`Something went wrong: ${error.message}`);
    };

    worker.addEventListener("message", receivedWorkerMessage);
    worker.addEventListener("error", workerError);

    if (!USE_SERVER_SIDE_FILTERING) {
      worker.postMessage({
        action: "load",
        url: PRODUCT_DATA_URL
      });
    }

    return () => {
      worker.removeEventListener("message", receivedWorkerMessage);
      worker.removeEventListener("error", workerError);
    };
  }, [filters]);

  useEffect(() => {
    updateFilter(filters);
  }, [filters]);

  return (
    <div className="InventoryContainer">
      {props.children}
      <NoResults visible={!loading && Products.length === 0}/>
      {Products.length > 0 &&
        <ul className="Inventory">
          {(Products as IProduct[]).map((element) => (
            <InventoryItem key={String(element.id)} element={element} />
          ))}
        </ul>
      }
    </div>
  );
};

const divClass = (visible: boolean) => classNames({
  NoResults: true,
  'NoResults--hidden': !visible
})

const NoResults: React.FC<{visible: boolean}> = (props) => {
  return (
    <div className={divClass(props.visible)}>
      <h3>Sorry, we couldn't find any results for your search</h3>
      <p>Say "clear" to clear filters and search again</p>
    </div>
  );
};

export default Inventory;
