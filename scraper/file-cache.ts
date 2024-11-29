import { promises as fs } from "fs";
import path from "path";

export interface Cache {
  get(key: string, initial?: any): Promise<any>;
  set(key: string, value: any): Promise<void>;
  mset(values: { [key: string]: any }): Promise<void>;
  destroy(): void;
}

function chunkString(str: string, len: number): string[] {
  const size = Math.ceil(str.length / len);
  const r: string[] = Array(size);
  let offset = 0;

  for (let i = 0; i < size; i++) {
    r[i] = str.substr(offset, len);
    offset += len;
  }

  return r;
}

const CHUNK_SIZE = 120000;
const DATA_DIR = "./.cache";

export class FileCache implements Cache {
  private dataDir: string;

  constructor(dataDir: string = DATA_DIR) {
    this.dataDir = dataDir;
    fs.mkdir(dataDir, { recursive: true });
  }

  private getFilePath(key: string): string {
    return path.join(this.dataDir, `${key}.json`);
  }

  async get(key: string, initial: any = null): Promise<any> {
    const filePath = this.getFilePath(key);
    try {
      let str = await fs.readFile(filePath, "utf-8");
      let data: any;
      while (true) {
        try {
          data = JSON.parse(str);
          break;
        } catch (e) {
          if (e instanceof SyntaxError) {
            str += await fs.readFile(filePath, "utf-8");
          } else {
            throw e;
          }
        }
      }
      return data;
    } catch (e) {
      if (
        e instanceof Error &&
        "code" in e &&
        (e.code === "ENOENT" || e.code === "ENOTDIR")
      ) {
        return initial;
      } else {
        throw e;
      }
    }
  }

  async set(key: string, value: any) {
    const data = JSON.stringify(value);
    const split = chunkString(data, CHUNK_SIZE);
    const filePath = this.getFilePath(key);
    try {
      await fs.access(filePath);
      await fs.truncate(filePath, 0);
    } catch (err) {}
    await fs.writeFile(filePath, split[0], "utf-8");
    for (const chunk of split.slice(1)) {
      await fs.appendFile(filePath, chunk, "utf-8");
    }
  }

  async mset(values: { [x: string]: any }) {
    await Promise.all(
      Object.keys(values).map(async (key) => {
        const data = JSON.stringify(values[key]);
        const split = chunkString(data, CHUNK_SIZE);
        const filePath = this.getFilePath(key);
        try {
          await fs.access(filePath);
          await fs.truncate(filePath, 0);
        } catch (err) {}
        await fs.writeFile(filePath, split[0], "utf-8");
        for (const chunk of split.slice(1)) {
          await fs.appendFile(filePath, chunk, "utf-8");
        }
      }),
    );
  }

  destroy() {}
}

export const cache = new FileCache();
