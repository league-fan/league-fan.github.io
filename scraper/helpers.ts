import { SUBSTITUTIONS } from "./constants";

export function parsePatch(s: string): number[] {
  return s.split(".").map((s) => parseInt(s, 10));
}

export function comparePatches(a: number[], b: number[]): number {
  for (let i = 0; i < a.length; i++) {
    if (a[i] > b[i]) return 1;
    else if (a[i] < b[i]) return -1;
  }
  return 0;
}

export function splitId(id: number) {
  return [Math.floor(id / 1000), id % 1000];
}

export function substitute(thing: string | number, sets = SUBSTITUTIONS) {
  return sets[thing] ?? thing;
}
