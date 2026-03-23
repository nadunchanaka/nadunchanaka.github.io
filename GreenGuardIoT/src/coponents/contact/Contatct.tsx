import React from "react";
import "./Contact.css";
export default function Contatct() {
  return (
    <>
      {/* NavBar provided by MainLayout sidebar */}
      <section className="contact">
        <div className="contact-container">
          <h2 className="contact-title">Get in Touch</h2>

          <form className="contact-form">
            <div className="contact-input-layour">
              <label htmlFor="name">Name</label>
              <input className="contact-input" placeholder="Name" />
            </div>
            <div className="contact-input-layour">
              <label htmlFor="name">Email</label>
              <input className="contact-input" placeholder="Email" />
            </div>
            {/* <input className="contact-input" placeholder="Name" /> */}
            {/* <input className="contact-input" placeholder="Email" /> */}
            <label htmlFor="Message">Message</label>
            <textarea
              className="contact-textarea"
              rows={4}
              placeholder="Message"
            />

            {/* <textarea
              className="contact-textarea"
              rows={4}
              placeholder="Message"
            /> */}
            <button className="contact-button">Send Message</button>
          </form>
        </div>
      </section>
    </>
  );
}
