const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export async function fetchRandomUnsplashImage(query) {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error("Missing Unsplash access key.");
  }

  const cleanQuery = query.trim() || "craft inspiration";

  const url = new URL("https://api.unsplash.com/photos/random");
  url.searchParams.set("query", cleanQuery);
  url.searchParams.set("orientation", "squarish");
  url.searchParams.set("content_filter", "high");

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch image from Unsplash.");
  }

  const data = await response.json();

  return {
    imageUrl: `${data.urls.raw}&w=800&h=800&fit=crop`,
    imageAlt: data.alt_description || cleanQuery,
    imageCredit: data.user?.name || "Unsplash creator",
    imageSourceUrl: data.links?.html || "",
  };
}