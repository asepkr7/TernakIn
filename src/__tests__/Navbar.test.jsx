import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUserRole } from "@/utils/getUserRole";

// Mock `getUserRole` function
vi.mock("@/utils/getUserRole", () => ({
  getUserRole: vi.fn(),
}));

describe("Navbar", () => {
  it("should render Navbar component", () => {
    const renderNavbar = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(renderNavbar).toBeDefined();
  });

  it("should render proper elements", async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logo = await screen.findByAltText("logo TernakIn");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute(
      "src",
      expect.stringContaining("logo_full.png")
    );
  });

  it("should toggle mobile menu when button is clicked", async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const toggleButton = screen.getByLabelText("Toggle navigation");
    expect(toggleButton).toBeInTheDocument();

    const menu = screen.getByRole("menubar");
    expect(menu).toHaveClass("invisible");

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(menu).toHaveClass("visible");
    });

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(menu).toHaveClass("invisible");
    });
  });

  it("should render CartBadge if user role is buyer", async () => {
    getUserRole.mockReturnValue("buyer");

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const cartBadge = await screen.findByTestId("cart-badge");
    expect(cartBadge).toBeInTheDocument();
  });

  it("should not render CartBadge if user role is not buyer", async () => {
    getUserRole.mockReturnValue("seller");

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("cart-badge")).not.toBeInTheDocument();
  });
});
