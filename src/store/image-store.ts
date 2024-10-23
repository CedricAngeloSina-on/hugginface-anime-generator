import { create } from "zustand";

type ImageStore = {
  imageURL: string;
  setImageURL: (url: string) => void;
};

export const useImageStore = create<ImageStore>((set) => ({
  imageURL: "",
  setImageURL: (url: string) => {
    set(() => ({ imageURL: url }));
  },
}));
