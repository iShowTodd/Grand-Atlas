import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContactMessage } from "../hooks/useContactMessage";
import ContactForm from "./ContactForm";

jest.mock("../hooks/useContactMessage", () => ({
  useContactMessage: jest.fn(),
}));

describe("ContactForm", () => {
  let mutation;

  beforeEach(() => {
    mutation = {
      mutateAsync: jest.fn().mockResolvedValue(undefined),
      isError: false,
      isSuccess: false,
      isPending: false,
    };
    useContactMessage.mockReturnValue(mutation);
  });

  it("shows inline validation and submits valid contact details", async () => {
    const user = userEvent.setup();
    render(<ContactForm variant="page" />);

    await user.click(screen.getByRole("button", { name: /Send an enquiry/ }));
    expect(await screen.findByText("Enter your name.")).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid email address."),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter a message.")).toBeInTheDocument();
    expect(mutation.mutateAsync).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/^Name/), "Ava Morgan");
    await user.type(screen.getByLabelText(/^Email/), "ava@example.com");
    await user.type(screen.getByLabelText("Phone"), "0123456789");
    await user.type(screen.getByLabelText(/^Message/), "Please contact me.");
    await user.click(screen.getByRole("button", { name: /Send an enquiry/ }));

    await waitFor(() =>
      expect(mutation.mutateAsync).toHaveBeenCalledWith({
        name: "Ava Morgan",
        email: "ava@example.com",
        phone: "0123456789",
        message: "Please contact me.",
      }),
    );
  });

  it("disables the submit button while the request is pending", () => {
    useContactMessage.mockReturnValue({ ...mutation, isPending: true });
    render(<ContactForm />);
    expect(screen.getByRole("button", { name: /Sending/ })).toBeDisabled();
  });
});
