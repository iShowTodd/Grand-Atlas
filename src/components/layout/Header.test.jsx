import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "../../app/auth-context";
import Header from "./Header";

function CurrentPath() {
  const location = useLocation();
  return <output data-testid="current-path">{location.pathname}</output>;
}

describe("Header", () => {
  it("opens and closes the mobile navigation after selecting a route", async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Header />
          <CurrentPath />
        </MemoryRouter>
      </AuthProvider>,
    );

    const menuButton = screen.getByRole("button", {
      name: "Open navigation",
    });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);
    expect(
      screen.getByRole("button", { name: "Close navigation" }),
    ).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("link", { name: "Units" }));
    expect(screen.getByTestId("current-path")).toHaveTextContent("/units");
    expect(
      screen.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});
