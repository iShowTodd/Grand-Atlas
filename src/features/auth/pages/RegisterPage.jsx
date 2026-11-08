import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { getApiErrorMessage } from "../../../api/client";
import { useAuth } from "../../../app/auth-context";
import { useRegister } from "../hooks/useAuthMutations";

const schema = z.object({
  name_en: z.string().trim().min(1, "Enter your name in English."),
  name_ar: z.string().trim().min(1, "Enter your name in Arabic."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
  phone: z.string().trim().min(1, "Enter your phone number."),
});

export default function RegisterPage() {
  const mutation = useRegister();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(values) {
    try {
      await mutation.mutateAsync(values);
      navigate("/login", {
        replace: true,
        state: { message: "Your account has been created. Please sign in." },
      });
    } catch {
      return;
    }
  }

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>Create account</title>
        <meta
          name="description"
          content="Create a Grand Atlas account to explore residences and developments."
        />
      </Helmet>
      <main className="auth-page">
        <section className="auth-card">
          <span className="eyebrow">Join Grand Atlas</span>
          <h1>Create an account</h1>
          <form
            className="contact-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="form-row">
              <label>
                Name (English)
                <input autoComplete="name" {...register("name_en")} />
                {errors.name_en && (
                  <span className="field-error">{errors.name_en.message}</span>
                )}
              </label>
              <label>
                Name (Arabic)
                <input dir="rtl" {...register("name_ar")} />
                {errors.name_ar && (
                  <span className="field-error">{errors.name_ar.message}</span>
                )}
              </label>
            </div>
            <label>
              Email address
              <input type="email" autoComplete="email" {...register("email")} />
              {errors.email && (
                <span className="field-error">{errors.email.message}</span>
              )}
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <span className="field-error">{errors.password.message}</span>
              )}
            </label>
            <label>
              Phone
              <input type="tel" autoComplete="tel" {...register("phone")} />
              {errors.phone && (
                <span className="field-error">{errors.phone.message}</span>
              )}
            </label>
            {mutation.isError && (
              <p className="form-feedback form-error" role="alert">
                {getApiErrorMessage(mutation.error)}
              </p>
            )}
            {mutation.isSuccess && (
              <p className="form-feedback" role="status">
                Account created. Redirecting to sign in…
              </p>
            )}
            <button
              className="button"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </section>
      </main>
    </>
  );
}
