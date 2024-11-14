export interface CDragonJson {
  name: string;
  type: Type;
  mtime: string;
  size?: number;
}

export enum Type {
  Directory = "directory",
  File = "file",
}
