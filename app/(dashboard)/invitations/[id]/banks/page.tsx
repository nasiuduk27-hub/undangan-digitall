"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, PlusCircle, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react";
import { BankCard } from "@/components/shared/bank-card";

interface Bank {
  id: string;
  code: string;
  name: string;
  logo_url: string;
}

interface BankAccount {
  id: string;
  bank_code: string;
  account_number: string;
  account_holder: string;
  bank: Bank;
}

export default function BankAccountsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [banksRes, accountsRes] = await Promise.all([
        fetch("/api/banks"),
        fetch(`/api/invitations/${resolvedParams.id}/bank-accounts`),
      ]);

      if (banksRes.ok) {
        const data = await banksRes.json();
        setBanks(data.banks || []);
        if (data.banks?.length > 0 && !selectedBankCode) {
          setSelectedBankCode(data.banks[0].code);
        }
      }

      if (accountsRes.ok) {
        const data = await accountsRes.json();
        setAccounts(data.bankAccounts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch(
        `/api/invitations/${resolvedParams.id}/bank-accounts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bank_code: selectedBankCode,
            account_number: accountNumber.trim(),
            account_holder: accountHolder.trim(),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menambahkan rekening");
      }

      setSuccess("Rekening berhasil ditambahkan");
      setAccountNumber("");
      setAccountHolder("");
      setTimeout(() => setSuccess(null), 3000);
      fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm("Hapus rekening ini dari undangan?")) return;

    try {
      const res = await fetch(
        `/api/invitations/${resolvedParams.id}/bank-accounts/${accountId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedBank = banks.find((b) => b.code === selectedBankCode);

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
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2b2420]">
          Info Rekening & Hadiah Digital
        </h1>
        <p className="text-sm text-[#7a6f63] mt-1">
          Tambahkan rekening bank atau dompet digital untuk mempermudah tamu mengirimkan kado/angpau.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* FORM TAMBAH REKENING */}
        <div className="md:col-span-1">
          <div className="bg-white border border-[#e7ddd0] rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-base font-bold text-[#2b2420] mb-4 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-[#a9724f]" />
              Tambah Rekening
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2b2420] mb-1.5">
                  Pilih Bank / E-Wallet *
                </label>
                <select
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a9724f]"
                >
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBank && (
                <div className="flex items-center gap-3 p-2 bg-[#faf7f2] rounded-xl border border-[#e7ddd0]">
                  <div className="w-10 h-7 bg-white rounded border border-[#e7ddd0] flex items-center justify-center p-1">
                    <img
                      src={selectedBank.logo_url}
                      alt={selectedBank.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[#2b2420]">
                    Logo {selectedBank.name} otomatis aktif
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#2b2420] mb-1.5">
                  Nomor Rekening / No. HP *
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Contoh: 1234567890"
                  className="w-full px-3.5 py-2.5 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a9724f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2b2420] mb-1.5">
                  Atas Nama Pemilik *
                </label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="w-full px-3.5 py-2.5 bg-[#faf7f2] border border-[#e7ddd0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a9724f]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-[#a9724f] hover:bg-[#8f5f40] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : "Simpan Rekening"}
              </button>
            </form>
          </div>
        </div>

        {/* DAFTAR REKENING AKTIF */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-[#2b2420] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#a9724f]" />
              Rekening Aktif ({accounts.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-[#7a6f63]">
              Memuat data rekening...
            </div>
          ) : accounts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#e7ddd0] rounded-2xl p-8 text-center text-sm text-[#7a6f63]">
              Belum ada rekening yang ditambahkan. Isi form di samping untuk menambahkan rekening pertama.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accounts.map((acc) => (
                <BankCard
                  key={acc.id}
                  bankName={acc.bank.name}
                  bankCode={acc.bank_code}
                  accountNumber={acc.account_number}
                  accountHolder={acc.account_holder}
                  logoUrl={acc.bank.logo_url}
                  onDelete={() => handleDelete(acc.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
