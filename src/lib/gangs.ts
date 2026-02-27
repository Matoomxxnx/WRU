import data from "../app/data/gangs.json";

export type GangMember = {
  name: string;
};

export type Gang = {
  slug: string;
  name: string;
  description: string;
  members: GangMember[];
};

// gangs.json เป็น array อยู่แล้ว → ใช้ as unknown as Gang[] แก้ type error
export const gangs = data as unknown as Gang[];

export const getGang = (slug: string) =>
  gangs.find((g) => g.slug.toLowerCase() === slug.toLowerCase());