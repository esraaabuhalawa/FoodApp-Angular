export interface Category {
  id: number;
  name: string;
  creationDate: string;
  modificationDate: string;
}

export interface categoryParams {
  name?: string;
  pageSize: number;
  pageNumber: number;
}
