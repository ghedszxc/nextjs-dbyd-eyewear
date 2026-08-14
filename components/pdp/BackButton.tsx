"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";

export default function BackButton() {
  const router = useRouter();
  const { current } = useBreakpoint(breakpoints);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="font-matter-regular flex h-8 cursor-pointer items-center justify-start gap-4 p-0! text-base text-black hover:bg-transparent"
    >
      <Image
        src="/icons/chevron-left.svg"
        alt="Back"
        width={current === "mobile" ? 16.31 : 32}
        height={current === "mobile" ? 30.96 : 32}
        className="h-full object-contain"
      />
      Back
    </Button>
  );
}
