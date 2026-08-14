import { getStoryblokRoot } from "@/constants/storyblok";
import { getStoryblokApi, refreshCacheIfStale, toStoryblokRequestError } from "@/lib/storyblok";
import { StoryblokClient } from "@storyblok/react/rsc";
import { NextResponse } from "next/server";

// Recursively extract plain text from Storyblok rich text nodes
function extractRichText(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (node.text) return node.text;
  if (Array.isArray(node.content)) {
    return node.content.map(extractRichText).join(" ");
  }
  return "";
}

// Pull every meaningful text field out of a story's content
function extractContentTexts(content: any): string[] {
  if (!content || typeof content !== "object") return [];
  const texts: string[] = [];

  // Direct text fields used across widgets
  const textFields = [
    "teaser_title",
    "teaser_title1",
    "collection_title",
    "title",
    "subtitle",
    "teaser_subtitle",
    "heading",
    "label",
    "description",
    "cta_label",
  ];

  for (const field of textFields) {
    if (content[field] && typeof content[field] === "string" && content[field].trim()) {
      texts.push(content[field].trim());
    }
  }

  // Rich text fields — extract plain text
  const richTextFields = ["teaser_text", "body", "text"];
  for (const field of richTextFields) {
    if (content[field]?.content) {
      const plain = extractRichText(content[field]).trim();
      if (plain) texts.push(plain);
    }
  }

  return texts;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim()?.toLowerCase();
  const lang = searchParams.get("lang") || "";
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("per_page") ?? 50);

  if (!query || query.length < 2) {
    return NextResponse.json({ success: true, data: [], count: 0 }, { status: 200 });
  }

  try {
    const storyblokApi: StoryblokClient = getStoryblokApi!();
    await refreshCacheIfStale();

    const mode = process.env.NEXT_PUBLIC_MODE as "preview" | "public";
    const version = process.env.NODE_ENV === "development" || mode === "preview" ? "draft" : "published";

    const { data, headers } = await storyblokApi.getStories({
      search_term: query,
      starts_with: `${getStoryblokRoot()}/`,
      language: lang,
      per_page: perPage,
      page,
      version,
    });

    const stories = data?.stories ?? [];
    const total = Number(headers?.total ?? stories.length);
    const seen = new Set<string>();
    const results: { title: string; slug: string; fullSlug: string }[] = [];

    for (const story of stories) {
      const content = story.content ?? {};
      const texts = extractContentTexts(content);

      // Find text entries that match the user's query
      for (const text of texts) {
        const lower = text.toLowerCase();
        if (lower.includes(query)) {
          const key = lower;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              title: text,
              slug: story.slug,
              fullSlug: story.full_slug,
            });
          }
        }
      }
    }

    return NextResponse.json(
      { success: true, data: results, count: total, page, perPage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Search error:", error);
    // Preserve the real upstream status (404 vs 429/5xx) so a transient
    // Storyblok failure isn't misreported as a client-error 400.
    const requestError = toStoryblokRequestError(error);
    return NextResponse.json({ success: false, error: requestError.message }, { status: requestError.statusCode });
  }
}
