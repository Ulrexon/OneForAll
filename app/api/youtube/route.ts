import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "A valid YouTube URL is required." },
      { status: 400 }
    );
  }

  try {
    const isValid = ytdl.validateURL(url);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid YouTube URL provided." },
        { status: 400 }
      );
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    // Filter formats: get mp4 formats that have both video and audio, or just audio formats
    const formats = info.formats
      .filter(
        (f) =>
          (f.container === "mp4" && f.hasVideo && f.hasAudio) ||
          (!f.hasVideo && f.hasAudio)
      )
      .map((f) => ({
        url: f.url,
        qualityLabel: f.qualityLabel || null,
        container: f.container,
        hasVideo: f.hasVideo,
        hasAudio: f.hasAudio,
      }));

    return NextResponse.json({
      title,
      formats,
    });
  } catch (error: any) {
    console.error("YTDL Error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to process video. YouTube may be blocking the request or the video is restricted.",
      },
      { status: 500 }
    );
  }
}
