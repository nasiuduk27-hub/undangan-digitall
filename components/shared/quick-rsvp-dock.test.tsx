import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuickRsvpDock } from "@/components/shared/quick-rsvp-dock";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("QuickRsvpDock", () => {
  const defaultProps = {
    slug: "test-slug",
    token: "guest-token-123",
    guestName: "Budi",
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("renders Editorial Brutalism quick RSVP buttons without emojis", () => {
    render(<QuickRsvpDock {...defaultProps} themeId="editorial-brutalism" />);
    expect(screen.getByRole("button", { name: "HADIR" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "TIDAK" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "MUNGKIN" })).toBeInTheDocument();
  });

  it("renders 70s Warm Groovy quick RSVP buttons with emojis", () => {
    render(<QuickRsvpDock {...defaultProps} themeId="70s-warm-groovy" />);
    expect(screen.getByRole("button", { name: "🎉 Hadir" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "😢 Tidak" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "🤔 Mungkin" })).toBeInTheDocument();
  });

  it("submits 1-tap quick pick and opens detail modal for step 2", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rsvp: { attendance_status: "hadir" } }),
    });

    render(<QuickRsvpDock {...defaultProps} themeId="editorial-brutalism" />);

    const hadirBtn = screen.getByRole("button", { name: "HADIR" });
    await userEvent.click(hadirBtn);

    // Verify API call for 1-tap quick pick
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/invite/test-slug/rsvp",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: "guest-token-123",
            attendance_status: "hadir",
          }),
        })
      );
    });

    // Verify detail modal opens for Step 2
    await waitFor(() => {
      expect(screen.getByText(/Jumlah Pax Hadir/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Simpan Detail" })).toBeInTheDocument();
    });
  });
});
