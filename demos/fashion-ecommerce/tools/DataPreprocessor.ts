import fs from "fs";
import rd from "readline";
import csv from "csvtojson";
import { IFilterData, IProduct } from "../src/types";

const VOICE_CONFIG_FOLDER = "config/"

var codexUpdated = false;

type Codex = {
  [tag: string]: { [key: string]: CodexRow };
};

type CodexRow = {
  isActive: boolean;
  key: string;
  displayName: string;
  aliases: string[];
  count: number;
  depth: number;    // Depth in product hierarchy
};

let codex: Codex = {};

// Main ------------------
(async () => {
  await loadCodexCsv("data/filter-config.csv", "\t");

  await processJsonlInventorySaveJson(
    "data/original/data.jsonl",
    "public/data_sample/products.json"
  );

  saveCodexCsv(codex, "data/filter-config.csv", "\t");
  saveLookups(codex, VOICE_CONFIG_FOLDER);
  saveFilterJson(codex, "src/generated/filters.json");

  /*
  if (!codexUpdated) {
    console.log(
      "No master config updates detected, skipped filter-config update and creation of lookups and filters."
    );
  }
  */
})();

// Ensuring all keys are string keys leverages the fact that with string keys, creation order of object keys will be maintained in practice as of ES2015
const toKey = (key: string | number) => {
  return `#${key}`;
};

const lookupAndUpdateCodex = (
  codex: Codex,
  tag: string,
  keys: string[],
  displayNames?: string[]
) => {
  if (!codex[tag]) {
    codex[tag] = {};
    codexUpdated = true;
    console.log(`Adding missing tag '${tag}'`);
  }

  keys.forEach((key, index) => {
    let validKey = toKey(key);
    if (codex[tag][validKey] === undefined) {
      console.log(`Adding missing key '${key}' to '${tag}'`);
      let defaultName = displayNames ? displayNames[index] : key;
      codex[tag][validKey] = {
        isActive: true,
        key: key,
        displayName: defaultName,
        aliases: [defaultName],
        count: 0,
        depth: index,
      };
      codexUpdated = true;
    } else {
      codex[tag][validKey].count++;
      codex[tag][validKey].depth = Math.max(codex[tag][validKey].depth, index);
    }
  });
};
/*
let rawdata = fs.readFileSync(filename, "utf8");
let entries = JSON.parse(rawdata);
console.log(entries[0]);
*/

async function processJsonlInventorySaveJson(
  filename: string,
  outFile: string
) {
  return new Promise((resolve) => {
    let products: IProduct[] = [];
    let reader = rd.createInterface(fs.createReadStream(filename));
    let line = 1;

    reader.on("line", (l: string) => {
      let product: IProduct = JSON.parse(l);
      lookupAndUpdateCodex(codex, "colors", product.colors);
      lookupAndUpdateCodex(codex, "category", product.category);
      lookupAndUpdateCodex(codex, "sizes", product.sizes);
      lookupAndUpdateCodex(codex, "sex", [product.sex]);
      lookupAndUpdateCodex(
        codex,
        "brand",
        [product.brand.id],
        [product.brand.name]
      );
      products.push(product);
      line++;
    });
    reader.on("close", () => {
      console.log(`${line} lines of data has been read.`);
      let jsonString = JSON.stringify(products, null, 2);
      fs.writeFile(outFile, jsonString, (err) => {
        if (err) throw err;
        console.log(`The file ${outFile} has been saved!`);
        resolve(true);
      });
    });
  });
}
/*

async function processCsvInventorySaveJson(csvPath: string, outFile: string) {
  let csvToJson = csv({
    colParser: {
      colors: function (item, head, resultRow, row, colIdx) {
        item = item.replace(/{(.*)}/, "$1"); // Grab content inside {}
        let items = item.split(",");
        lookupAndUpdateCodex(codex, "colors", items);
        return items.join(", ");
        //.map((i) => `"${i}"`)
        // item = `[${item}]`;
        // return JSON.parse(item);
      },
      category: function (item, head, resultRow, row, colIdx) {
        let items = item.split(" > ");
        lookupAndUpdateCodex(codex, "category", items);
        return items.join(", ");
      },
      brand: function (item, head, resultRow, row, colIdx) {
        lookupAndUpdateCodex(codex, "brand", [item]);
        return item;
      },
    },
    // noheader:true,
    // output: "csv"
    ignoreEmpty: true,
    checkType: true,
    trim: true,
    delimiter: "\t",
    ignoreColumns: /EOF/,
  });

  let csvRows;

  try {
    csvRows = await csvToJson.fromFile(csvPath);
  } catch (e) {
    throw e;
  }

  if (csvRows) {
    // console.log(csvRows);
    let jsonString = JSON.stringify(csvRows, null, 2);
    fs.writeFile(outFile, jsonString, (err) => {
      if (err) throw err;
      console.log(`The file ${outFile} has been saved!`);
    });
  }
}

*/

async function loadCodexCsv(csvPath: string, separator: string) {
  let csvToJson = csv({
    // noheader:true,
    // output: "csv"
    ignoreEmpty: true,
    checkType: true,
    trim: true,
    delimiter: separator,
    ignoreColumns: /EOF/,
    // headers: ["isActive", "tag", "key", "alias.[0]", "alias.[1]"...]
  });

  codex = {};
  try {
    let csvRows = await csvToJson.fromFile(csvPath);

    csvRows.forEach((row, index) => {
      if (!codex[row.tag]) {
        codex[row.tag] = {};
      }
      let codexRow: CodexRow = {
        isActive: row.isActive,
        key: row.key,
        displayName: row.displayName,
        aliases: row.alias || [],
        count: 0,
        depth: 0,
      };
      codex[row.tag][toKey(row.key)] = codexRow;

      if (codexRow.isActive) {
        /*        
        if (codexRow.aliases.length == 0) {
          console.warn(
            `WARN: No aliases for '${row.key}' in '${row.tag}' at line ${
              index + 1
            }`
          );
        }
*/
      }
    });
  } catch (e) {}
  //return csvRows;
}

function buildCsvString(
  rows: string[][],
  headers: string[] | null = null,
  separator: string = ","
) {
  let csvString = [
    ...(headers ? [headers.join(separator)] : []), // include optional headers
    ...rows.map((rowItems) => rowItems.join(separator)),
  ].join("\n");
  return csvString;
}

function saveCodexCsv(codex: Codex, outFile: string, separator: string) {
  let flatFilterConfig: string[][] = [];
  let maxAliases = 1;
  Object.keys(codex).forEach((tag) => {
    Object.keys(codex[tag]).forEach((itemKey) => {
      let row = codex[tag][itemKey];
      maxAliases = Math.max(maxAliases, codex[tag][itemKey].aliases.length);
      flatFilterConfig.push([
        row.isActive ? "x" : "",
        String(row.count),
        String(row.depth),
        tag,
        row.key,
        row.displayName,
        ...codex[tag][itemKey].aliases,
      ]);
    });
  });

  let headers = [
    "isActive",
    "count",
    "depth",
    "tag",
    "key",
    "displayName",
    ...Array(maxAliases)
      .fill(0)
      .map((item, index) => `alias.[${index}]`),
  ];
  let csvString = buildCsvString(flatFilterConfig, headers, separator);

  fs.writeFile(outFile, csvString, (err) => {
    if (err) throw err;
    console.log(`The file ${outFile} has been updated!`);
  });
}

function saveFilterJson(codex: Codex, outFile: string) {
  let filters: { [key: string]: IFilterData } = {};
  Object.keys(codex).forEach((key) => {
    let filter = codex[key];
    let filterConf: IFilterData = {
      options: [],
    };
    Object.keys(filter).forEach((key) => {
      let codexRow = filter[key];
      if (codexRow.isActive) {
        filterConf.options.push([codexRow.key, codexRow.displayName]);
      }
    });
    filters[key] = filterConf;
  });

  let jsonString = JSON.stringify(filters, null, 2);
  fs.writeFile(outFile, jsonString, (err) => {
    if (err) throw err;
    console.log(`The file ${outFile} has been saved!`);
  });
}

function saveLookups(codex: Codex, outPath: string) {
  Object.keys(codex).forEach((tag) => {
    let filter = codex[tag];
    let lookup: string[][] = [];
    Object.keys(filter).forEach((key) => {
      let codexRow = filter[key];
      if (codexRow.isActive) {
        if (codexRow.aliases && codexRow.aliases.length > 0) {
          codexRow.aliases.forEach((alias) =>
            lookup.push([alias, codexRow.key])
          );
        } else {
          lookup.push([codexRow.key, codexRow.key]);
        }
      }
    });
    if (outPath && !outPath.endsWith("/")) outPath += "/";
    let outFile = `${outPath}${tag}.csv`;
    let csvString = buildCsvString(lookup, null, ",");

    fs.writeFile(outFile, csvString, (err) => {
      if (err) throw err;
      console.log(`The file ${outFile} has been saved!`);
    });
  });
}
