import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProjectsSection, UnitsPreview, ZonesSection } from "./HomeSections";

jest.mock("../../map", () => ({
  MapPreview: () => null,
}));

describe("HomeSections", () => {
  it.each([
    ["residences", UnitsPreview],
    ["locations", ZonesSection],
    ["projects", ProjectsSection],
  ])(
    "shows an error instead of crashing when %s data is missing",
    (_, Section) => {
      render(
        <MemoryRouter>
          <Section
            query={{
              data: undefined,
              error: undefined,
              isError: false,
              isLoading: false,
              isPending: false,
              refetch: jest.fn(),
            }}
          />
        </MemoryRouter>,
      );

      expect(screen.getByRole("alert")).toHaveTextContent(
        "The API returned an invalid collection.",
      );
    },
  );
});
