import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../../app/auth-context";
import { useUnits } from "../hooks/useUnits";
import UnitsPage from "./UnitsPage";

jest.mock("../hooks/useUnits", () => ({
  useUnits: jest.fn(),
}));

const unit = {
  id: "unit-1",
  title: "Garden Home",
  description: "A bright home.",
  city: "New Cairo",
  price: 2500000,
  size: 130,
  bedrooms: 3,
  bathrooms: 2,
  status: "AVAILABLE",
  images: [],
  project: { name: "Palm Hills" },
  developer: { name: "Palm Hills" },
  zone: { name: "New Cairo" },
};

function renderPage(initialEntry = "/units") {
  return render(
    <HelmetProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/units" element={<UnitsPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </HelmetProvider>,
  );
}

describe("UnitsPage", () => {
  let queryResult;

  beforeEach(() => {
    queryResult = {
      data: [unit],
      isLoading: false,
      isError: false,
      isSuccess: true,
      refetch: jest.fn(),
    };
    useUnits.mockImplementation(() => queryResult);
  });

  it("submits all supported API search filters", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Search residences"), "Garden");
    await user.type(screen.getByLabelText("Minimum price"), "1000000");
    await user.type(screen.getByLabelText("Maximum price"), "3000000");
    await user.type(screen.getByLabelText("Minimum size (m²)"), "100");
    await user.type(screen.getByLabelText("Maximum size (m²)"), "180");
    await user.type(screen.getByLabelText("Bedrooms"), "3");
    await user.type(screen.getByLabelText("Bathrooms"), "2");
    await user.type(screen.getByLabelText("Developer"), "Palm Hills");
    await user.type(screen.getByLabelText("Zone"), "New Cairo");
    await user.type(screen.getByLabelText("Project"), "Palm");
    await user.selectOptions(screen.getByLabelText("Status"), "AVAILABLE");
    await user.selectOptions(screen.getByLabelText("Price order"), "desc");
    await user.click(screen.getByRole("button", { name: "Search residences" }));

    expect(useUnits).toHaveBeenLastCalledWith({
      search: "Garden",
      minPrice: "1000000",
      maxPrice: "3000000",
      minSize: "100",
      maxSize: "180",
      bedrooms: "3",
      bathrooms: "2",
      developerName: "Palm Hills",
      zoneName: "New Cairo",
      projectName: "Palm",
      status: "AVAILABLE",
      sort: "desc",
    });
  });

  it("shows loading, API errors, and empty results", () => {
    queryResult = {
      isLoading: true,
      isError: false,
      data: undefined,
    };
    const { rerender } = renderPage();
    expect(screen.getByRole("status")).toHaveTextContent("Loading residences");

    queryResult = {
      isLoading: false,
      isError: true,
      error: new Error("Service unavailable"),
      refetch: jest.fn(),
    };
    rerender(
      <HelmetProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={["/units"]}>
            <Routes>
              <Route path="/units" element={<UnitsPage />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </HelmetProvider>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Service unavailable");

    queryResult = {
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: [],
    };
    rerender(
      <HelmetProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={["/units"]}>
            <Routes>
              <Route path="/units" element={<UnitsPage />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </HelmetProvider>,
    );
    expect(screen.getByText("No residences found")).toBeInTheDocument();
  });

  it("initializes zone from a location-map link", () => {
    renderPage("/units?zoneName=New%20Cairo");
    expect(screen.getByLabelText("Zone")).toHaveValue("New Cairo");
    expect(useUnits).toHaveBeenCalledWith({ zoneName: "New Cairo" });
    expect(
      within(screen.getByRole("main")).getByRole("heading", {
        name: "Where Visionary Design Meets Daily Life",
      }),
    ).toBeInTheDocument();
  });
});
