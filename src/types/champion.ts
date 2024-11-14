export interface Champion {
  id: number;
  name: string;
  alias: string;
  squarePortraitPath: string;
  roles: Role[];
}

export enum Role {
  Assassin = "assassin",
  Fighter = "fighter",
  Mage = "mage",
  Marksman = "marksman",
  Support = "support",
  Tank = "tank",
}
