import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ContactUs = () => {
  const location = useLocation();
  const urlSeg = decodeURIComponent(location.pathname.split("/")[2] || "");
  const [errors, setErrors] = useState({});

  const validate = (formData) => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = Object.fromEntries(new FormData(form));

    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    formData.access_key = import.meta.env.VITE_FORM_ACCESS_KEY;

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    }).then((res) => res.json());

    if (res.success) {
      toast.success(res.message);
      form.reset();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="max-w-5xl  py-20 mx-auto text-center px-5 md:px-10 lg:px-20">
      <h2 className="text-xl md:text-2xl text-[#5CAE59] font-bold mb-6">
        {urlSeg === ""
          ? "Contact Us or Send Feedback"
          : urlSeg === "contact-us"
          ? "Contact Us"
          : urlSeg === "feedback"
          ? "Send us Feedback"
          : ""}
      </h2>
      <p className="text-sm md:text-lg text-center  mb-6 ">
        {urlSeg === ""
          ? "Have any questions or feedback ? Reach out to us — we're happy to help!"
          : urlSeg === "contact-us"
          ? "Have any questions? Drop us a message and we'll do our best to help you out."
          : urlSeg === "feedback"
          ? "Got feedback? We'd love to hear it and take it positively!"
          : ""}
      </p>
      <form onSubmit={onSubmit} className="max-w-5xl mx-auto  ">
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-2xl shadow-lg focus: outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent border  border-slate-100  placeholder:font-medium"
            autoComplete="on"
            onChange={handleChange}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name}</span>
          )}
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-2xl shadow-lg focus: outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent  border  border-slate-100 placeholder:font-medium"
            autoComplete="on"
            onChange={handleChange}
            required
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email}</span>
          )}
        </div>
        <div className="mb-4">
          <textarea
            name="message"
            placeholder="Your Message"
            rows="8"
            className="w-full px-4 py-3 rounded-2xl shadow-lg focus: outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent border  border-slate-100  placeholder:font-medium"
            onChange={handleChange}
          />
          {errors.message && (
            <span className="text-sm text-red-500">{errors.message}</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-transparent border  border-slate-100   px-6 py-2 rounded-full font-medium hover-supported: hover:bg-[#5CAE59] hover-supported:hover:text-gray-200 active: bg-[#5CAE59] shadow-lg transition-all duration-500"
        >
          {urlSeg === ""
            ? "Send"
            : urlSeg === "contact-us"
            ? "Send message"
            : urlSeg === "feedback"
            ? "Send feedback"
            : ""}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
