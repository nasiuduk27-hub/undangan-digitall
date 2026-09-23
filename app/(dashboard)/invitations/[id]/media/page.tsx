"use client";

import { useCallback, useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as MusicIcon,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface MediaAsset {
  id: string;
  type: "photo" | "video" | "audio";
  url: string;
  thumbnail_url: string | null;
  order: number;
  status: string;
}

export default function MediaManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch(`/api/invitations/${resolvedParams.id}/media`);
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.mediaAssets || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photo" | "video" | "audio"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    // Validasi ukuran client-side
    const maxLimitsMB = { photo: 5, video: 100, audio: 10 };
    const limitMB = maxLimitsMB[type];
    if (file.size > limitMB * 1024 * 1024) {
      setError(`File ${file.name} melebihi batas maksimal ${limitMB} MB`);
      return;
    }

    setUploading(type);

    try {
      // 1. Request presigned URL
      const reqRes = await fetch(
        `/api/invitations/${resolvedParams.id}/media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "request-upload",
            type,
            filename: file.name,
            contentType: file.type || "application/octet-stream",
            fileSize: file.size,
          }),
        }
      );

      const reqData = await reqRes.json();
      if (!reqRes.ok) {
        throw new Error(reqData.error || "Gagal mendapatkan presigned URL");
      }

      const { uploadUrl, publicUrl } = reqData;

      // 2. Upload file ke storage (PUT ke S3 presigned URL atau fallback mock)
      try {
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });
        if (!uploadRes.ok) throw new Error("Upload storage gagal");
      } catch {
        throw new Error("Gagal mengunggah file ke storage");
      }

      // 3. Konfirmasi simpan data ke database
      const confirmRes = await fetch(
        `/api/invitations/${resolvedParams.id}/media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "confirm-upload",
            type,
            url: publicUrl,
            order: mediaList.filter((m) => m.type === type).length,
          }),
        }
      );

      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) {
        throw new Error(confirmData.error || "Gagal menyimpan data media");
      }

      setSuccess(`Berhasil mengunggah ${file.name}`);
      setTimeout(() => setSuccess(null), 3000);
      fetchMedia();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan saat upload");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Hapus file media ini?")) return;

    try {
      const res = await fetch(
        `/api/invitations/${resolvedParams.id}/media/${mediaId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const photos = mediaList.filter((m) => m.type === "photo");
  const videos = mediaList.filter((m) => m.type === "video");
  const audios = mediaList.filter((m) => m.type === "audio");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/invitations/${resolvedParams.id}/edit`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7a6f63] hover:text-[#2b2420] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Pengaturan Undangan
        </Link>
        <Link
          href={`/invitations/${resolvedParams.id}/banks`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a9724f] hover:underline"
        >
          Lanjut ke Rekening Bank →
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2b2420]">Kelola Media</h1>
        <p className="text-sm text-[#7a6f63] mt-1">
          Unggah foto galeri, video cover/opening, dan backsound musik sesuai batas spesifikasi.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="space-y-8">
        {/* SECTION FOTO GALERI */}
        <div className="bg-white border border-[#e7ddd0] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#a9724f]" />
                <h2 className="text-base font-bold text-[#2b2420]">
                  Galeri Foto & Cover
                </h2>
              </div>
              <p className="text-xs text-[#7a6f63] mt-0.5">
                Format JPG, PNG, WEBP. Maks 5MB per foto. Rasio 4:5 / 1:1.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#a9724f] hover:bg-[#8f5f40] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors w-fit">
              <Upload className="w-4 h-4" />
              {uploading === "photo" ? "Mengunggah..." : "Tambah Foto"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading !== null}
                onChange={(e) => handleFileUpload(e, "photo")}
                className="hidden"
              />
            </label>
          </div>

          {photos.length === 0 ? (
            <div className="border-2 border-dashed border-[#e7ddd0] rounded-xl p-8 text-center text-xs text-[#7a6f63]">
              Belum ada foto yang diunggah. Minimal unggah 1 foto untuk cover.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photos.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative group rounded-xl overflow-hidden border border-[#e7ddd0] aspect-[4/5] bg-[#faf7f2] flex items-center justify-center"
                >
                  <img
                    src={item.url}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x500/f1e4d8/a9724f?text=Foto";
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    #{idx + 1} {idx === 0 && "(Cover)"}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION VIDEO COVER */}
        <div className="bg-white border border-[#e7ddd0] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <VideoIcon className="w-5 h-5 text-[#a9724f]" />
                <h2 className="text-base font-bold text-[#2b2420]">
                  Video Utama (Cover/Opening)
                </h2>
              </div>
              <p className="text-xs text-[#7a6f63] mt-0.5">
                Format MP4, WebM. Maks 100MB (maksimal 60 detik).
              </p>
            </div>
            {videos.length === 0 && (
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#a9724f] hover:bg-[#8f5f40] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors w-fit">
                <Upload className="w-4 h-4" />
                {uploading === "video" ? "Mengunggah..." : "Unggah Video"}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  disabled={uploading !== null}
                  onChange={(e) => handleFileUpload(e, "video")}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {videos.length === 0 ? (
            <div className="border-2 border-dashed border-[#e7ddd0] rounded-xl p-8 text-center text-xs text-[#7a6f63]">
              Belum ada video yang diunggah (opsional).
            </div>
          ) : (
            <div className="max-w-xs relative group rounded-xl overflow-hidden border border-[#e7ddd0] bg-black">
              <video
                src={videos[0].url}
                controls
                className="w-full aspect-[9/16] object-cover"
              />
              <button
                onClick={() => handleDelete(videos[0].id)}
                className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-opacity"
                title="Hapus Video"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* SECTION AUDIO BACKSOUND */}
        <div className="bg-white border border-[#e7ddd0] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <MusicIcon className="w-5 h-5 text-[#a9724f]" />
                <h2 className="text-base font-bold text-[#2b2420]">
                  Backsound Musik
                </h2>
              </div>
              <p className="text-xs text-[#7a6f63] mt-0.5">
                Format MP3, WAV. Maks 10MB / 5 menit. Autoplay setelah klik pertama tamu.
              </p>
            </div>
            {audios.length === 0 && (
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#a9724f] hover:bg-[#8f5f40] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors w-fit">
                <Upload className="w-4 h-4" />
                {uploading === "audio" ? "Mengunggah..." : "Unggah Lagu"}
                <input
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/wav"
                  disabled={uploading !== null}
                  onChange={(e) => handleFileUpload(e, "audio")}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {audios.length === 0 ? (
            <div className="border-2 border-dashed border-[#e7ddd0] rounded-xl p-8 text-center text-xs text-[#7a6f63]">
              Belum ada backsound lagu yang diunggah (opsional).
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 p-4 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl">
              <div className="flex-1">
                <audio src={audios[0].url} controls className="w-full h-8" />
              </div>
              <button
                onClick={() => handleDelete(audios[0].id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus Audio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
