"use client";

import { use, useEffect, useRef, useState, useCallback } from "react";
import { Camera, CameraOff, RefreshCw } from "lucide-react";

type VerifyResult = {
  status: "valid" | "sudah-dipakai" | "tidak-valid";
  guest_name?: string;
};

// Declare BarcodeDetector for TypeScript compatibility with native Web API
interface BarcodeDetectorInstance {
  detect: (image: HTMLVideoElement | HTMLCanvasElement | ImageBitmap) => Promise<Array<{ rawValue: string }>>;
}

interface BarcodeDetectorConstructor {
  new (options?: { formats: string[] }): BarcodeDetectorInstance;
  getSupportedFormats?: () => Promise<string[]>;
}

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

export default function ScanPage({
  params,
}: {
  params: Promise<{ invitationId: string }>;
}) {
  const { invitationId } = use(params);
  const [qrToken, setQrToken] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedInCount, setCheckedInCount] = useState(0);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const verifyToken = useCallback(
    async (tokenToVerify: string) => {
      const cleanToken = tokenToVerify.trim();
      if (!cleanToken) return;
      setLoading(true);

      try {
        const res = await fetch("/api/checkin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            qr_token: cleanToken,
            invitation_id: invitationId,
            checked_in_by: `scanner:${invitationId}`,
          }),
        });
        const data = await res.json();
        setResult(data);
        if (data.status === "valid") {
          setCheckedInCount((count) => count + 1);
        }
      } catch {
        setResult({ status: "tidak-valid" });
      } finally {
        setQrToken("");
        setLoading(false);
      }
    },
    [invitationId]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    verifyToken(qrToken);
  };

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);

      // Check if native BarcodeDetector API is supported
      if (typeof window !== "undefined" && "BarcodeDetector" in window && window.BarcodeDetector) {
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const scanLoop = async () => {
          if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const detectedQr = barcodes[0].rawValue;
                if (detectedQr) {
                  verifyToken(detectedQr);
                }
              }
            } catch (e) {
              console.warn("Barcode detection error:", e);
            }
          }
          animFrameRef.current = requestAnimationFrame(scanLoop);
        };
        scanLoop();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Kamera tidak dapat diakses. Pastikan izin kamera telah diberikan.");
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const resultClass =
    result?.status === "valid"
      ? "bg-green-500 text-white"
      : result?.status === "sudah-dipakai"
        ? "bg-yellow-400 text-black"
        : result
          ? "bg-red-600 text-white"
          : "bg-white text-black";

  return (
    <main className="min-h-screen bg-black p-4 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-xl flex-col justify-between rounded-3xl border border-white/15 bg-[#111] p-5">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">Scanner Resepsionis</p>
              <h1 className="mt-1 text-2xl font-black uppercase">QR Check-in</h1>
            </div>
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 font-mono text-xs font-bold uppercase transition-colors hover:bg-white/20"
            >
              {cameraActive ? (
                <>
                  <CameraOff className="h-4 w-4 text-red-400" /> Matikan Kamera
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 text-green-400" /> Buka Kamera
                </>
              )}
            </button>
          </div>

          {/* Camera Viewfinder */}
          {cameraActive && (
            <div className="relative mt-4 overflow-hidden rounded-2xl border-2 border-dashed border-white/30 bg-black aspect-video flex items-center justify-center">
              <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-44 w-44 rounded-xl border-2 border-green-400/80 bg-green-400/10 shadow-[0_0_20px_rgba(74,222,128,0.3)]" />
              </div>
            </div>
          )}

          {cameraError && (
            <p className="mt-3 font-mono text-xs text-red-400 bg-red-950/50 p-3 rounded-xl border border-red-800/50">
              {cameraError}
            </p>
          )}

          {/* Result Banner */}
          <div className={`mt-5 rounded-2xl p-5 text-center transition-all ${resultClass}`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Status Kehadiran</p>
            <p className="mt-1 text-3xl font-black uppercase">
              {result?.status === "valid"
                ? "VALID — SILAKAN MASUK"
                : result?.status === "sudah-dipakai"
                  ? "SUDAH DIPAKAI (DUPLIKAT)"
                  : result?.status === "tidak-valid"
                    ? "TIDAK VALID"
                    : "MENUNGGU SCAN"}
            </p>
            {result?.guest_name && (
              <p className="mt-2 text-xl font-bold underline underline-offset-4">{result.guest_name}</p>
            )}
          </div>
        </div>

        {/* Manual Fallback & Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <label className="block">
            <span className="font-mono text-xs font-bold uppercase text-white/60">
              Paste QR Token / Hasil Scan manual
            </span>
            <textarea
              value={qrToken}
              onChange={(event) => setQrToken(event.target.value)}
              rows={3}
              placeholder="Paste QR token dari barcode scanner / kamera di sini..."
              className="mt-1 w-full rounded-2xl border border-white/15 bg-black p-3.5 font-mono text-xs text-white outline-none focus:border-white"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !qrToken.trim()}
            className="min-h-11 w-full rounded-2xl bg-white px-4 py-3 font-mono text-xs font-black uppercase text-black transition-opacity disabled:opacity-40"
          >
            {loading ? "Memverifikasi..." : "Verifikasi Manual"}
          </button>
          <div className="flex items-center justify-between font-mono text-[11px] uppercase text-white/50 pt-1">
            <span>Check-in Sesi Ini: {checkedInCount}</span>
            {result && (
              <button
                type="button"
                onClick={() => setResult(null)}
                className="inline-flex items-center gap-1 hover:text-white"
              >
                <RefreshCw className="h-3 w-3" /> Reset Status
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
