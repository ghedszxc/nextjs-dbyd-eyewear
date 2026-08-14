import { getStoryblokRoot } from "@/constants/storyblok";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams?.get("slug")?.toString().replace(getStoryblokRoot(), "");
  const draft = await draftMode();
  draft.enable();

  redirect(`${slug}?slug=${slug}`);
}
