import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getApiErrorMessage } from "../../../api/client";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/ui/PageState";

const resourceFields = {
  units: [
    { name: "title_en", label: "Title (English)", required: true },
    { name: "title_ar", label: "Title (Arabic)", dir: "rtl", required: true },
    { name: "description_en", label: "Description (English)", multiline: true },
    {
      name: "description_ar",
      label: "Description (Arabic)",
      multiline: true,
      dir: "rtl",
    },
    { name: "city_en", label: "City (English)" },
    { name: "city_ar", label: "City (Arabic)", dir: "rtl" },
    { name: "price", label: "Price", type: "number" },
    { name: "size", label: "Size (m²)", type: "number" },
    { name: "bedrooms", label: "Bedrooms", type: "number" },
    { name: "bathrooms", label: "Bathrooms", type: "number" },
    {
      name: "projectId",
      label: "Project",
      type: "select",
      relation: "projects",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["AVAILABLE", "SOLD", "RENTED"],
    },
  ],
  projects: [
    { name: "name_en", label: "Name (English)", required: true },
    { name: "name_ar", label: "Name (Arabic)", dir: "rtl", required: true },
    { name: "description_en", label: "Description (English)", multiline: true },
    {
      name: "description_ar",
      label: "Description (Arabic)",
      multiline: true,
      dir: "rtl",
    },
    {
      name: "developerId",
      label: "Developer",
      type: "select",
      relation: "developers",
    },
    { name: "zoneId", label: "Zone", type: "select", relation: "zones" },
  ],
  developers: [
    { name: "name_en", label: "Name (English)", required: true },
    { name: "name_ar", label: "Name (Arabic)", dir: "rtl", required: true },
    { name: "description_en", label: "Description (English)", multiline: true },
    {
      name: "description_ar",
      label: "Description (Arabic)",
      multiline: true,
      dir: "rtl",
    },
  ],
  zones: [
    { name: "name_en", label: "Name (English)", required: true },
    { name: "name_ar", label: "Name (Arabic)", dir: "rtl", required: true },
    { name: "description_en", label: "Description (English)", multiline: true },
    {
      name: "description_ar",
      label: "Description (Arabic)",
      multiline: true,
      dir: "rtl",
    },
    { name: "city_en", label: "City (English)" },
    { name: "city_ar", label: "City (Arabic)", dir: "rtl" },
  ],
};

function createSchema(fields) {
  const shape = {};
  for (const field of fields) {
    shape[field.name] = field.required
      ? z.string().trim().min(1, `${field.label} is required.`)
      : z.string().optional();
  }
  return z.object(shape);
}

function itemLabel(item, resource) {
  if (resource === "units") {
    return item.title ?? item.title_en ?? item.id ?? "Unit";
  }
  return item.name ?? item.name_en ?? item.id ?? resource;
}

function buildPayload(values, selected, resource, imagesToDelete) {
  const body = new FormData();
  const fields = resourceFields[resource];

  for (const field of fields) {
    const value = values[field.name];
    if (value !== undefined && String(value).trim() !== "") {
      body.append(field.name, String(value));
    }
  }

  for (const file of Array.from(values.images ?? [])) {
    body.append("images", file);
  }

  if (resource === "units" && selected?.images?.length) {
    for (const image of selected.imageRefs ?? selected.images) {
      if (!imagesToDelete.includes(image)) body.append("existingImages", image);
    }
  }
  if (resource === "projects") {
    for (const image of imagesToDelete) body.append("deletedImages", image);
  }

  return body;
}

export default function AdminResourceManager({
  resource,
  title,
  query,
  mutations,
  relatedOptions = {},
}) {
  const fields = resourceFields[resource];
  const [selected, setSelected] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const mutation = selected ? mutations.update : mutations.create;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSchema(fields)),
    defaultValues: Object.fromEntries(fields.map((field) => [field.name, ""])),
  });

  useEffect(() => {
    reset(
      Object.fromEntries(
        fields.map((field) => [
          field.name,
          selected?.[field.name] === undefined ||
          selected?.[field.name] === null
            ? ""
            : String(selected[field.name]),
        ]),
      ),
    );
  }, [fields, reset, selected]);

  function selectRecord(record) {
    setSelected(record);
    setImagesToDelete([]);
    setFormError("");
    setFormMessage("");
  }

  async function onSubmit(values) {
    const payload = buildPayload(values, selected, resource, imagesToDelete);
    try {
      if (selected) {
        await mutations.update.mutateAsync({ id: selected.id, payload });
      } else {
        await mutations.create.mutateAsync(payload);
      }
      selectRecord(null);
      setFormMessage(`${title.slice(0, -1)} saved successfully.`);
      reset(Object.fromEntries(fields.map((field) => [field.name, ""])));
    } catch (error) {
      setFormMessage("");
      setFormError(getApiErrorMessage(error));
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete ${itemLabel(item, resource)}?`)) return;
    try {
      await mutations.remove.mutateAsync(item.id);
      if (selected?.id === item.id) selectRecord(null);
      setFormError("");
      setFormMessage("Item deleted successfully.");
    } catch (error) {
      setFormMessage("");
      setFormError(getApiErrorMessage(error));
    }
  }

  return (
    <div className="admin-resource-grid">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="eyebrow">Manage records</span>
            <h2>{title}</h2>
          </div>
          <span className="admin-count">
            {query.isSuccess ? query.data.length : "—"}
          </span>
        </div>
        {query.isLoading ? (
          <LoadingState label={`Loading ${title.toLowerCase()}`} />
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={query.refetch} />
        ) : query.data.length === 0 ? (
          <EmptyState title={`No ${title.toLowerCase()} yet`}>
            Create a record using the form.
          </EmptyState>
        ) : (
          <div className="admin-record-list">
            {query.data.map((item) => (
              <article className="admin-record" key={item.id}>
                <div>
                  <h2>{itemLabel(item, resource)}</h2>
                  <p>
                    {item.city ?? item.status ?? item.description ?? item.id}
                  </p>
                </div>
                <div className="admin-record-actions">
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => selectRecord(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-button text-button-danger"
                    type="button"
                    onClick={() => remove(item)}
                    disabled={mutations.remove.isPending}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="eyebrow">{selected ? "Update" : "Create"}</span>
            <h2>
              {selected
                ? itemLabel(selected, resource)
                : `New ${title.slice(0, -1)}`}
            </h2>
          </div>
          {selected && (
            <button
              className="text-button"
              type="button"
              onClick={() => selectRecord(null)}
            >
              Cancel edit
            </button>
          )}
        </div>
        <form
          className="contact-form admin-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="admin-field-grid">
            {fields.map((field) => (
              <label key={field.name}>
                {field.label}
                {field.type === "select" ? (
                  <select {...register(field.name)}>
                    <option value="">
                      {relatedOptions[field.relation]?.isLoading
                        ? `Loading ${field.label.toLowerCase()}…`
                        : `Select ${field.label.toLowerCase()}`}
                    </option>
                    {(field.options ?? []).map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                    {(relatedOptions[field.relation]?.data ?? []).map(
                      (option) => (
                        <option value={option.id} key={option.id}>
                          {option.name}
                        </option>
                      ),
                    )}
                  </select>
                ) : field.multiline ? (
                  <textarea
                    rows="3"
                    dir={field.dir}
                    {...register(field.name)}
                  />
                ) : (
                  <input
                    type={field.type ?? "text"}
                    min={field.type === "number" ? "0" : undefined}
                    dir={field.dir}
                    {...register(field.name)}
                  />
                )}
                {errors[field.name] && (
                  <span className="field-error">
                    {errors[field.name].message}
                  </span>
                )}
              </label>
            ))}
          </div>
          <label>
            Images
            <input
              type="file"
              accept="image/*"
              multiple
              {...register("images")}
            />
          </label>
          {selected?.images?.length > 0 && (
            <div className="existing-images">
              <p className="form-note">
                Existing images are retained unless selected for removal.
              </p>
              {selected.images.map((image, index) => {
                const imageRef = selected.imageRefs?.[index] ?? image;
                return (
                  <label className="existing-image" key={imageRef}>
                    <input
                      type="checkbox"
                      checked={imagesToDelete.includes(imageRef)}
                      disabled={resource !== "projects"}
                      onChange={(event) => {
                        setImagesToDelete((current) =>
                          event.target.checked
                            ? [...current, imageRef]
                            : current.filter((entry) => entry !== imageRef),
                        );
                      }}
                    />
                    <img src={image} alt="" width="46" height="40" />
                    <span>
                      {resource === "projects"
                        ? "Remove this project image"
                        : "Image removal is not supported for this resource"}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
          {formError && (
            <p className="form-feedback form-error" role="alert">
              {formError}
            </p>
          )}
          {formMessage && (
            <p className="form-feedback" role="status">
              {formMessage}
            </p>
          )}
          <button
            className="button"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving…"
              : selected
                ? "Save changes"
                : `Create ${title.slice(0, -1)}`}
          </button>
        </form>
      </section>
    </div>
  );
}
