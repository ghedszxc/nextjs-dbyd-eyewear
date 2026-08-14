import { create } from "zustand";

type NavStore = {
  /** True while the nav is collapsed by the hide-on-scroll behavior. */
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

export const useNavStore = create<NavStore>((set) => ({
  hidden: false,
  setHidden: (hidden) => set({ hidden }),
}));
