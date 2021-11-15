export type IProduct = {
  id: number | string;
  name: string;
  colors: string[];
  sizes: string[];
  sex: string;
  brand: {
    id: string;
    name: string;
  };
  category: string[];
  image_url: string;
  image_file: string;
  popularity: number;
  price: number;
};

export type IFilter = {
  value: string;
};

export type IFilters = {[key: string]: IFilter};

export type IFilterConfiguration = {
  label: string;
  key: string;
  data: IFilterData;
};

export type IFilterData = {
  options: (string | number)[][]; // [0] key [1] displayName
};
