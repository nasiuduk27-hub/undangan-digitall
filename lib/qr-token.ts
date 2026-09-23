import crypto from "crypto";

const secret = process.env.NEXTAUTH_SECRET || "development-secret";

export function createQrToken(guestSlugToken: string) {
  const payload = Buffer.from(JSON.stringify({ t: guestSlugToken })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyQrToken(qrToken: string) {
  const [payload, signature] = qrToken.split(".");
  if (!payload || !signature) return null;

  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof parsed.t === "string" ? parsed.t : null;
  } catch {
    return null;
  }
}
