import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "@/components/Footer";

describe("Footer", () => {
  it("should render Footer component", () => {
    const renderFooter = render(<Footer />);
    expect(renderFooter).toBeDefined();
  });
});
