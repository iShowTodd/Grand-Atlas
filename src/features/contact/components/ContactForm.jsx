import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getApiErrorMessage } from "../../../api/client";
import { useContactMessage } from "../hooks/useContactMessage";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(1, "Enter a message."),
});

export default function ContactForm({ variant = "home" }) {
  const mutation = useContactMessage();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  async function onSubmit(values) {
    try {
      await mutation.mutateAsync(values);
      reset();
    } catch {
      return;
    }
  }

  const isPageVariant = variant === "page";

  return (
    <form
      className={`contact-form${isPageVariant ? " contact-form-page" : ""}`}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={isPageVariant ? "" : "form-row"}>
        <label>
          {isPageVariant ? "Name" : "Your name"}
          <input autoComplete="name" {...register("name")} />
          {errors.name && (
            <span className="field-error">{errors.name.message}</span>
          )}
        </label>
        <label>
          {isPageVariant ? "Email" : "Email address"}
          <input type="email" autoComplete="email" {...register("email")} />
          {errors.email && (
            <span className="field-error">{errors.email.message}</span>
          )}
        </label>
      </div>
      <label>
        {isPageVariant ? "Phone" : "Phone (optional)"}
        <input type="tel" autoComplete="tel" {...register("phone")} />
      </label>
      <label>
        {isPageVariant ? "Message" : "How can we help?"}
        <textarea rows={isPageVariant ? 6 : 3} {...register("message")} />
        {errors.message && (
          <span className="field-error">{errors.message.message}</span>
        )}
      </label>
      {mutation.isError && (
        <p className="form-feedback form-error" role="alert">
          {getApiErrorMessage(mutation.error)}
        </p>
      )}
      {mutation.isSuccess && (
        <p className="form-feedback" role="status">
          Your enquiry has been sent.
        </p>
      )}
      <button className="button" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Sending…" : "Send an enquiry"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
