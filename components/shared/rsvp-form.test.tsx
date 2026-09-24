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

  it("renders the form with guest name", () => {
    render(<RsvpForm {...defaultProps} />);

    expect(screen.getByText("Halo Budi, mohon konfirmasi kehadiran Anda.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kirim RSVP" })).toBeInTheDocument();
  });

  it("shows success message after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<RsvpForm {...defaultProps} />);

    const submitBtn = screen.getByRole("button", { name: "Kirim RSVP" });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("RSVP tersimpan")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/invite/test-slug/rsvp",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "test-token",
          attendance_status: "hadir",
          pax_count: 1,
          wish_message: "",
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

    const submitBtn = screen.getByRole("button", { name: "Kirim RSVP" });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Gagal menyimpan RSVP")).toBeInTheDocument();
    });
  });

  it("allows selecting different attendance status", async () => {
    render(<RsvpForm {...defaultProps} />);

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(3);

    // Click "tidak" radio
    await userEvent.click(radioButtons[2]);
    expect(radioButtons[2]).toBeChecked();
    expect(radioButtons[0]).not.toBeChecked();
  });

  it("allows typing pax count and wish message", async () => {
    render(<RsvpForm {...defaultProps} />);

    const paxInput = screen.getByLabelText("Jumlah pax");
    const wishInput = screen.getByLabelText("Ucapan");

    await userEvent.type(paxInput, "3", {
      initialSelectionStart: 0,
      initialSelectionEnd: 1,
    });
    await userEvent.type(wishInput, "Selamat ya!");

    expect(paxInput).toHaveValue(3);
    expect(wishInput).toHaveValue("Selamat ya!");
  });
});