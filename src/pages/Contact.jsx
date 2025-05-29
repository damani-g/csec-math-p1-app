import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! (Simulated)");
    // Here you could integrate with Firebase, EmailJS, etc.
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="content">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Message:</label>
        <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}
