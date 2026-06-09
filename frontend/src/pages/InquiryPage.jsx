import { useState } from 'react';
import { inquiryAPI } from '../api/client';
import './InquiryPage.css';

export default function InquiryPage() {
  const [form, setForm] = useState({ name: '', business_name: '', email: '', phone: '', quantity: '', bottle_size: '500ml', requirements: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inquiryAPI.create({ ...form, quantity: parseInt(form.quantity) || null });
      setSubmitted(true);
    } catch (err) { console.error(err); }
  };

  if (submitted) {
    return (
      <div className="inquiry-page container">
        <div className="success-card glass">
          <div className="success-icon">✅</div>
          <h2>Quote Request Sent!</h2>
          <p>We'll get back to you within 24 hours with a custom quote.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inquiry-page container">
      <div className="inquiry-header">
        <h1>Get a <span className="gradient-text">Custom Quote</span></h1>
        <p>Need a large order or custom requirements? Fill out the form and we'll prepare a personalized quote for you.</p>
      </div>
      <form className="inquiry-form card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group"><label>Your Name *</label><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="input-group"><label>Business Name</label><input className="input" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></div>
          <div className="input-group"><label>Email *</label><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="input-group"><label>Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="input-group"><label>Quantity</label><input className="input" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
          <div className="input-group"><label>Bottle Size</label><select className="input" value={form.bottle_size} onChange={(e) => setForm({ ...form, bottle_size: e.target.value })}><option value="250ml">250ml</option><option value="500ml">500ml</option><option value="1000ml">1000ml</option></select></div>
        </div>
        <div className="input-group"><label>Requirements / Special Notes</label><textarea className="input" rows="4" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></div>
        <button className="btn btn-primary btn-lg" type="submit">📩 Submit Quote Request</button>
      </form>
    </div>
  );
}
