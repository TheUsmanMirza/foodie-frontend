"use client";

import Image from "next/image";
import LoginImage from "@/assets/images/login_image.jpg";

export default function ImageGrid() {
  return (
    <div className="w-full lg:w-1/3 h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 z-10" />
      <Image
        src={LoginImage}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 transform scale-105 transition-transform duration-700 hover:scale-110"
        alt="Delicious food background"
        priority
      />
      <div className="absolute inset-0 bg-black/10 z-20" />
  
    </div>
  );
}