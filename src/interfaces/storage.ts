export interface Storage<T> {
  storageId: string;
  tags: {
    [key: string]: any;
  }[];
  etag: string;
  data: T[];
}
