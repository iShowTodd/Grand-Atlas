import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { getApiErrorMessage } from "../../../api/client";
import { useAuth } from "../../../app/auth-context";
import { useLogin } from "../hooks/useAuthMutations";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export default function LoginPage() {
  const mutation = useLogin();
  const { user, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  if (user)
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/"} replace />;

  async function onSubmit(credentials) {
    try {
      const session = await mutation.mutateAsync(credentials);
      signIn(session);
      navigate(session.user.role === "ADMIN" ? "/admin" : "/", {
        replace: true,
      });
    } catch {
      return;
    }
  }

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>Sign in</title>
        <meta
          name="description"
          content="Sign in to your Grand Atlas account to continue your property journey."
        />
      </Helmet>
      <main className="auth-page">
        <section className="auth-card">
          <span className="eyebrow">Welcome back</span>
          <h1>Sign in</h1>
          {location.state?.message && (
            <p className="form-feedback" role="status">
              {location.state.message}
            </p>
          )}
          <p>Access your Grand Atlas account.</p>
          <form
            className="contact-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
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
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <span className="field-error">{errors.password.message}</span>
              )}
            </label>
            {mutation.isError && (
              <p className="form-feedback form-error" role="alert">
                {getApiErrorMessage(mutation.error)}
              </p>
            )}
            <button
              className="button"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="auth-switch">
            New to Grand Atlas? <Link to="/register">Create an account</Link>
          </p>
        </section>
      </main>
    </>
  );
}
