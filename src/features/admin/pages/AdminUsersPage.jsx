import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getApiErrorMessage } from "../../../api/client";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/ui/PageState";
import { useCreateAdminUser, useUsers } from "../../auth";

const schema = z.object({
  name_en: z.string().trim().min(1, "Enter the English name."),
  name_ar: z.string().trim().min(1, "Enter the Arabic name."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
  phone: z.string().trim().min(1, "Enter a phone number."),
  role: z.enum(["ADMIN", "SALES_ADMIN", "MARKETING"]),
});

export default function AdminUsersPage() {
  const query = useUsers();
  const mutation = useCreateAdminUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name_en: "",
      name_ar: "",
      email: "",
      password: "",
      phone: "",
      role: "SALES_ADMIN",
    },
  });

  async function onSubmit(values) {
    try {
      await mutation.mutateAsync(values);
      reset();
    } catch {
      return;
    }
  }

  return (
    <div className="admin-resource-grid">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>Users</h2>
        </div>
        {query.isLoading ? (
          <LoadingState label="Loading users" />
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={query.refetch} />
        ) : query.data.length === 0 ? (
          <EmptyState title="No users found">
            Create a user using the form.
          </EmptyState>
        ) : (
          <div className="admin-record-list">
            {query.data.map((user, index) => (
              <article
                className="admin-record"
                key={user.id ?? user.email ?? index}
              >
                <div>
                  <h2>{user.name_en ?? user.name ?? user.email}</h2>
                  <p>{user.email}</p>
                </div>
                <span className="role-badge">{user.role ?? "USER"}</span>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>Create a user</h2>
        </div>
        <form
          className="contact-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="form-row">
            <label>
              Name (English)
              <input {...register("name_en")} />
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
            Email
            <input type="email" {...register("email")} />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </label>
          <label>
            Password
            <input type="password" {...register("password")} />
            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </label>
          <label>
            Phone
            <input type="tel" {...register("phone")} />
            {errors.phone && (
              <span className="field-error">{errors.phone.message}</span>
            )}
          </label>
          <label>
            Role
            <select {...register("role")}>
              <option value="ADMIN">ADMIN</option>
              <option value="SALES_ADMIN">SALES_ADMIN</option>
              <option value="MARKETING">MARKETING</option>
            </select>
          </label>
          {mutation.isError && (
            <p className="form-feedback form-error" role="alert">
              {getApiErrorMessage(mutation.error)}
            </p>
          )}
          {mutation.isSuccess && (
            <p className="form-feedback" role="status">
              User created successfully.
            </p>
          )}
          <button
            className="button"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating…" : "Create user"}
          </button>
        </form>
      </section>
    </div>
  );
}
