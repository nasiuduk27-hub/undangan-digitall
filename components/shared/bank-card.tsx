"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface BankCardProps {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  logoUrl?: string;
  onDelete?: () => void;
  isCompact?: boolean;
}

export function BankCard({
  bankName,
  bankCode,
  accountNumber,
  accountHolder,
  logoUrl,
  onDelete,
  isCompact = false,
}: BankCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative bg-white border border-[#e7ddd0] rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
        isCompact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Logo Container berbackground netral */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 bg-[#faf7f2] border border-[#e7ddd0] rounded-lg flex items-center justify-center p-1.5 flex-shrink-0">
            {logoUrl && !imageError ? (
              <img
                src={logoUrl}
                alt={bankName}
                className="max-h-full max-w-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#f1e4d8] text-[#a9724f] font-bold text-xs flex items-center justify-center">
                {bankCode.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#2b2420]">{bankName}</h4>
            <span className="text-[11px] text-[#7a6f63] font-medium tracking-wide">
              {bankCode}
            </span>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={onDelete}
            className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Hapus
          </button>
        )}
      </div>

      <div className="bg-[#faf7f2] border border-[#f1e4d8] rounded-xl p-3.5 flex items-center justify-between gap-2">
        <div>
          <div className="text-[11px] text-[#7a6f63] font-medium uppercase tracking-wider">
            Nomor Rekening
          </div>
          <div className="font-mono font-bold text-base text-[#2b2420] tracking-wider mt-0.5">
            {accountNumber}
          </div>
          <div className="text-xs text-[#7a6f63] mt-0.5">
            a.n. <strong className="text-[#2b2420]">{accountHolder}</strong>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
            copied
              ? "bg-green-600 text-white"
              : "bg-white border border-[#e7ddd0] text-[#2b2420] hover:bg-[#f1e4d8]"
          }`}
          title="Salin Nomor Rekening"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Tersalin!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#a9724f]" />
              Salin
            </>
          )}
        </button>
      </div>
    </div>
  );
}
