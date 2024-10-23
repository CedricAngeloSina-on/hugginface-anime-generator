"use client";

import Image from "next/image";
import { useImageStore } from "~/store/image-store";

export function GeneratedImage() {
  const imageURL = useImageStore((state) => state.imageURL);

  return (
    <div className="relative size-[36rem] rounded-xl bg-muted/50 md:size-[36rem] lg:size-[40rem]">
      {imageURL && (
        <Image
          src={imageURL}
          alt="Picture of the author"
          fill
          style={{
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
}
