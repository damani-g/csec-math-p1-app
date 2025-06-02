import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

export default function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      // Add to Firebase
      await addDoc(collection(db, "contact_messages"), {
        ...formData,
        userId: user?.uid || null,
        timestamp: serverTimestamp(),
      });

      setSubmitStatus({
        type: "success",
        message: "Message sent successfully! We'll get back to you soon."
      });
      setFormData({ ...formData, message: "" }); // Only clear the message
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again or email us directly at csecmathapp@gmail.com"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content">
      <div className="contact-page">
        <div className="contact-header">
          <h2>Contact Us</h2>
          <p className="lead">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="contact-container card">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label className="form-label">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message:</label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Type your message here..."
              />
            </div>

            {submitStatus.message && (
              <div className={`status-message ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="contact-info">
            <h3>Other Ways to Reach Us</h3>
            <p>
              You can also email us directly at:{" "}
              <a href="mailto:csecmathapp@gmail.com" className="link-button">
                csecmathapp@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
