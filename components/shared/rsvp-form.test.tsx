import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RsvpForm } from "@/components/shared/rsvp-form";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("RsvpForm", () => {
  const defaultProps = {
    slug: "test-slug",
    token: "test-token",
    guestName: "Budi",
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("renders the component with guest name and quick pick buttons", () => {
    render(<RsvpForm {...defaultProps} />);

    expect(screen.getByText("Halo Budi, mohon konfirmasi kehadiran Anda.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /hadir/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ragu/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tidak/i })).toBeInTheDocument();
  });

  it("triggers quick pick and opens modal on click", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<RsvpForm {...defaultProps} />);

    const hadirBtn = screen.getByRole("button", { name: /hadir/i });
    await userEvent.click(hadirBtn);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Kirim RSVP" })).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/invite/test-slug/rsvp",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "test-token",
          attendance_status: "hadir",
        }),
      })
    );
  });

  it("shows error message on failed submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Gagal menyimpan RSVP" }),
    });

    render(<RsvpForm {...defaultProps} />);

    const hadirBtn = screen.getByRole("button", { name: /hadir/i });
    await userEvent.click(hadirBtn);

    await waitFor(() => {
      expect(screen.getByText("Gagal menyimpan RSVP")).toBeInTheDocument();
    });
  });

  it("submits modal detail form successfully", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(<RsvpForm {...defaultProps} />);

    // Step 1: Click quick pick button
    const hadirBtn = screen.getByRole("button", { name: /hadir/i });
    await userEvent.click(hadirBtn);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Kirim RSVP" })).toBeInTheDocument();
    });

    // Step 2: Fill modal detail form
    const paxInput = screen.getByLabelText("Jumlah pax");
    const wishInput = screen.getByLabelText("Ucapan");

    await userEvent.type(paxInput, "3", {
      initialSelectionStart: 0,
      initialSelectionEnd: 1,
    });
    await userEvent.type(wishInput, "Selamat ya!");

    const submitModalBtn = screen.getByRole("button", { name: "Kirim RSVP" });
    await userEvent.click(submitModalBtn);

    await waitFor(() => {
      expect(screen.getByText("RSVP tersimpan")).toBeInTheDocument();
    });
  });
});