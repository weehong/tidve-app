import { Profile } from "@prisma/client";
import { atom } from "jotai";

export const profileAtom = atom<Profile | null>(null);
