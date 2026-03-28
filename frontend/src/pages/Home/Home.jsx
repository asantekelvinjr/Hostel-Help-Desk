import React, { useState } from "react";
import { Paperclip, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";
import { useAuth } from "../../context/AuthContext";
import { submitReport } from "../../api/api";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({ title: "", category: "", description: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (fields = formData) => {
    const errs = {};
    if (!fields.title.trim()) errs.title = "Issue title is required.";
    if (!fields.category) errs.category = "Please select a category.";
    if (!fields.description.trim()) errs.description = "Description is required.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name]) setErrors(validate(updated));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate());
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ title: true, category: true, description: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setServerError("");

    try {
      // Use FormData so the image file can be sent as multipart
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("description", formData.description);
      if (image) payload.append("image", image);

      await submitReport(payload);
      navigate("/reports");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 transition ${
      errors[field] && touched[field]
        ? "border-red-500 focus:ring-red-300"
        : "border-gray-300 focus:ring-[var(--color-primary)] focus:border-transparent"
    }`;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <UserNavbar />

      <main className="flex-1 px-4 md:px-10 py-8 flex justify-center">
        <div className="w-full max-w-2xl">

          {/* Welcome */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-text-heading)]">
              Welcome Back{" "}
              <span className="text-[var(--color-primary)]">{user?.name || "User"}</span> 👋
            </h2>
            <p className="text-[var(--color-text)] text-sm">Report a new issue below</p>
          </div>

          {/* Form Card */}
          <div className="bg-white shadow-md rounded-xl p-6 md:p-8 w-full">
            <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-6">
              Report a New Issue
            </h3>

            {serverError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
                {serverError}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>

              {/* Issue Title */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input type="text" name="title" placeholder="e.g. Water leakage in Room 12"
                  value={formData.title} onChange={handleChange} onBlur={handleBlur}
                  className={inputClass("title")} />
                {errors.title && touched.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select name="category" value={formData.category}
                  onChange={handleChange} onBlur={handleBlur} className={inputClass("category")}>
                  <option value="">Select Category</option>
                  <option>Plumbing</option>
                  <option>Electricity</option>
                  <option>Cleaning</option>
                  <option>Furniture</option>
                  <option>Internet</option>
                  <option>Other</option>
                </select>
                {errors.category && touched.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea rows={4} name="description" placeholder="Provide detailed information..."
                  value={formData.description} onChange={handleChange} onBlur={handleBlur}
                  className={`${inputClass("description")} resize-none`} />
                {errors.description && touched.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Attach Image <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <label className="flex items-center space-x-3 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[var(--color-primary)] transition">
                  <Paperclip className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-sm text-[var(--color-text)]">
                    {image ? image.name : "Click to upload or drag & drop"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview"
                    className="mt-3 w-full max-h-48 object-cover rounded-lg border border-gray-200" />
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Submitting..." : "Submit Issue"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
