import { useState } from "react";
import { getApiErrorMessage } from "../../../api/client";
import { useUploadImages } from "../../images";

export default function AdminImagesPage() {
  const [files, setFiles] = useState([]);
  const mutation = useUploadImages();

  async function onSubmit(event) {
    event.preventDefault();
    if (!files.length) return;
    try {
      await mutation.mutateAsync(files);
      setFiles([]);
      event.currentTarget.reset();
    } catch {
      return;
    }
  }

  return (
    <section className="admin-panel image-admin-panel">
      <div className="admin-panel-heading">
        <div>
          <span className="eyebrow">Media</span>
          <h2>Image library</h2>
        </div>
      </div>
      <form className="contact-form" onSubmit={onSubmit}>
        <label>
          Select images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
        </label>
        {files.length > 0 && (
          <p className="form-note">{files.length} image(s) selected.</p>
        )}
        {mutation.isError && (
          <p className="form-feedback form-error" role="alert">
            {getApiErrorMessage(mutation.error)}
          </p>
        )}
        {mutation.isSuccess && (
          <div className="uploaded-images" role="status">
            <p>Uploaded images:</p>
            {mutation.data.map((image) => (
              <a href={image} key={image} target="_blank" rel="noreferrer">
                {image}
              </a>
            ))}
          </div>
        )}
        <button
          className="button"
          type="submit"
          disabled={!files.length || mutation.isPending}
        >
          {mutation.isPending ? "Uploading…" : "Upload images"}
        </button>
      </form>
    </section>
  );
}
