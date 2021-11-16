var busy = false;
var scheduledData = null;
var Products = null;

// Start processing a dataset and also keep the last data scheduled
onmessage = async function (event) {
  let data = event.data;

  if (!data.action) {
    postMessage({ error: "no_action", message: `Error, no action defined` });
    return;
  }

  if (data.action === "load") {
    await actionLoad(data.url);
    return;
  }

  if (data.action === "init") {
    Products = data.payload;
    postMessage({ action: "ready", message: `Data initialized` });
    return;
  }

  if (data.action === "filter") {
    scheduledData = data;

    if (busy) {
      postMessage({
        message: `Busy, scheduling task ${scheduledData.value}`,
      });
      return;
    }

    while (scheduledData !== null) {
      busy = true;
      let data = scheduledData;
      scheduledData = null;
      await actionFilter(data);
    }
    busy = false;
    return;
  }

  if (data.action === "fetch") {
    await actionFetch(data.url, data.payload);
    return;
  }

  postMessage({
    error: "unknown_action",
    message: `Error, unknown action ${data.action}`,
  });
};

const actionLoad = async (url) => {
  (async () => {
    postMessage({ message: `Loading data from ${url}` });
    const data = await fetch(url);
    Products = await data.json();
    postMessage({ action: "ready", message: `Data loaded` });
  })();
};

const actionFetch = async (url, payload) => {
  (async () => {
    postMessage({ message: `Loading data from ${url}` });
    const data = await fetch(url, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const response = await data.json();
    postMessage({
      action: "payload",
      message: `Fetch response`,
      response: response,
    });
  })();
};

const actionFilter = async (data) => {
  if (!Products) {
    postMessage({ error: "uninitialized", message: `Products not loaded yet` });
    return;
  }
  postMessage({
    message: `Starting task ${data.value}: Filter from ${Products.length} products`,
  });

  let res = await filter(data.payload);
  postMessage({
    action: "products",
    message: `Finished with task ${data.value}`,
    result: res,
  });
};

const filter = async (payload) => {
  const filter = payload.filter;
  const sort = payload.sort;
  let results = await Products.filter(
    (element) =>
      !filter.sex ||
      !filter.sex.value ||
      (element.sex && element.sex == filter.sex.value)
  )
    .filter(
      (element) =>
        !filter.category ||
        !filter.category.value ||
        (element.category &&
          element.category.includes(String(filter.category.value)))
    )
    .filter(
      (element) =>
        !filter.brand ||
        !filter.brand.value ||
        (element.brand && element.brand.id == filter.brand.value)
    )
    .filter(
      (element) =>
        !filter.colors ||
        !filter.colors.value ||
        (element.colors && element.colors.includes(String(filter.colors.value)))
    )
    .filter(
      (element) =>
        !filter.sizes ||
        !filter.sizes.value ||
        (element.sizes && element.sizes.includes(String(filter.sizes.value)))
    );

  if (sort) {
    let sortCriteria = Object.keys(sort)[0];
    let sign = sort[sortCriteria]; // 1 asc, -1 desc
    results = results.sort(
      (a, b) => sign * (a[sortCriteria] - b[sortCriteria])
    );
  }

  return results.slice(payload.offset, payload.offset + payload.limit);
};
