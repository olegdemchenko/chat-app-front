import { Participant } from "types";

export type Results = {
  users: readonly Participant[];
  query: string;
  count: number;
};
