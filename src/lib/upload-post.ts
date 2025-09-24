export type UploadPostOptions = {
  title?: string;
  user?: string;
  platforms: string[];
};

export class UploadPost {
  private readonly apiKey: string;
  private readonly endpoint: string;

  constructor(apiKey: string, endpoint?: string) {
    this.apiKey = apiKey;
    this.endpoint =
      endpoint ||
      process.env.UPLOAD_POST_ENDPOINT ||
      "https://app.upload-post.com/api/upload";
  }

  async upload(videoUrl: string, options: UploadPostOptions): Promise<unknown> {
    if (!videoUrl) throw new Error("videoUrl is required");
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        videoUrl,
        title: options.title,
        user: options.user,
        platforms: options.platforms,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`upload-post request failed: ${res.status} ${text}`);
    }
    return res.json().catch(() => ({}));
  }
}

export default UploadPost;
