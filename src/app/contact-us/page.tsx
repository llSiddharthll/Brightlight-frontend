"use client";

import { useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const INTEREST_OPTIONS = [
  "Express Entry",
  "PNP",
  "ATIP/GCMS Notes",
  "LMIA Application for Employer",
  "Work Permit",
  "Spousal Sponsorship",
  "Study Visa - Outside Canada",
  "Study Visa - Inside Canada",
  "Post Graduate Work Permit (PGWP)",
  "Business Visa",
  "Visitor Visa",
  "Super Visa",
  "Family Sponsorship",
  "Open Work Permit",
  "Citizenship",
  "College Admission/College Change",
  "PR Card Renewal",
  "Other",
];

export default function ContactUsPage() {
  const [activeDiv, setActiveDiv] = useState("insideCanada");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            areaOfInterest: formData.interest,
            residencyStatus: activeDiv === "insideCanada" ? "Inside Canada" : "Outside Canada",
            subject: "New Contact Form Submission",
            message: formData.message,
          }),
        }
      );

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          interest: "",
          message: "",
        });
      } else {
        toast.error("Request rejected. Please try again later.");
      }
    } catch {
      toast.error("Request rejected. Please try again later.");
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      {/* Top Section */}
      <div className="max-w-[1440px] max-[1460px]:max-w-[95%] mx-auto text-center py-[100px] pt-[230px] max-[1000px]:pt-[180px]">
        <h1 className="text-primary text-[60px] max-[800px]:text-[40px] max-[580px]:text-[30px] mb-[20px]">
          Contact Us
        </h1>
        <h3 className="text-primary text-[24px] max-[800px]:text-[18px] max-[580px]:text-[16px] mb-[15px] font-normal">
          Got a Question? We&apos;re here to answer! Reach out using the form
          below, and we&apos;ll get back to you pronto.
        </h3>
        <p className="text-gray-text text-[18px] max-[800px]:text-[16px] max-[580px]:text-[14px] leading-[1.8]">
          While booking a free assessment or scheduling an appointment with our
          Registered Canadian Immigration Consultant (RCIC) is the preferred
          method to contact us, rest assured that we will promptly reach out to
          you. Please feel free to share your detailed query below.
        </p>
      </div>

      {/* Form + Map Section */}
      <div className="max-w-[1440px] max-[1460px]:max-w-[95%] mx-auto pb-[60px]">
        <div className="bg-white rounded-[20px] shadow-[0_3px_20px_rgba(0,0,0,0.1)] p-[40px] max-[800px]:p-[20px]">
          <form onSubmit={handleSubmit}>
            {/* Name + Email row */}
            <div className="flex max-[800px]:flex-col gap-[20px] mb-[20px]">
              <div className="flex-1 flex items-center border border-[#ccc] rounded-[10px] p-[12px_15px]">
                <input
                  type="text"
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="flex-1 border-none outline-none text-[16px]"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="flex-1 flex items-center border border-[#ccc] rounded-[10px] p-[12px_15px]">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="flex-1 border-none outline-none text-[16px]"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
            </div>

            {/* Phone + Interest row */}
            <div className="flex max-[800px]:flex-col gap-[20px] mb-[20px]">
              <div className="flex-1 flex items-center border border-[#ccc] rounded-[10px] p-[12px_15px]">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="flex-1 border-none outline-none text-[16px]"
                />
                <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="flex-1 flex items-center border border-[#ccc] rounded-[10px] p-[12px_15px]">
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  required
                  className="flex-1 border-none outline-none text-[16px] bg-transparent"
                >
                  <option value="">Select Area of Interest</option>
                  {INTEREST_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span className="text-red-500 ml-1">*</span>
              </div>
            </div>

            {/* Inside/Outside Canada toggle */}
            <div className="flex gap-0 mb-[20px]">
              <div
                onClick={() => setActiveDiv("insideCanada")}
                className={`flex-1 text-center py-[15px] cursor-pointer rounded-l-[10px] border border-[#ccc] transition-colors duration-300 ${
                  activeDiv === "insideCanada"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary"
                }`}
              >
                <p className="font-semibold">Inside Canada</p>
              </div>
              <div
                onClick={() => setActiveDiv("outsideCanada")}
                className={`flex-1 text-center py-[15px] cursor-pointer rounded-r-[10px] border border-[#ccc] transition-colors duration-300 ${
                  activeDiv === "outsideCanada"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary"
                }`}
              >
                <p className="font-semibold">Outside Canada</p>
              </div>
            </div>

            {/* Message textarea */}
            <div className="flex items-start border border-[#ccc] rounded-[10px] p-[12px_15px] mb-[20px]">
              <textarea
                placeholder="How can we help?"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="flex-1 border-none outline-none text-[16px] min-h-[150px] resize-y"
              />
              <span className="text-red-500 ml-1">*</span>
            </div>

            {/* SMS Consent */}
            <div className="text-[16px] antialiased mb-4 flex items-start justify-center gap-2">
              <input
                className="h-5 w-5 mt-1"
                type="checkbox"
                name="agree"
                id="agree"
                required
              />
              <span>
                I Consent to Receive SMS Notifications, Alerts &amp; Occasional
                Marketing Communication from Brightlight Immigration. You can
                reply STOP to unsubscribe at any time.
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="block mx-auto bg-primary text-white py-[15px] px-[40px] rounded-[10px] text-[18px] font-semibold cursor-pointer hover:opacity-90 transition-opacity duration-300 border-none"
            >
              Send Your Message
            </button>
          </form>

          {/* Terms */}
          <div className="flex items-center justify-center gap-2 mt-[20px] text-[14px] text-gray-text">
            <span>By clicking, you agree to our</span>
            <Link
              href="/terms-and-conditions"
              className="text-primary underline"
            >
              Terms &amp; Conditions
            </Link>
            ,
            <Link href="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Office Details + Map */}
      <div className="max-w-[1440px] max-[1460px]:max-w-[95%] mx-auto flex max-[800px]:flex-col gap-[30px] pb-[80px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2611.079363084726!2d-122.8000042230304!3d49.12312788203902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5485d9bc1ae6becd%3A0xaf29d4bfe0aceaae!2sBrightlight%20Immigration!5e0!3m2!1sen!2sin!4v1724923112723!5m2!1sen!2sin"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          className="flex-1 min-h-[400px] rounded-[20px] border-none"
          title="Brightlight Immigration Office Location"
        />
        <div className="flex-1 flex max-[800px]:flex-col gap-[30px]">
          <div className="flex-1 bg-white rounded-[20px] shadow-[0_3px_20px_rgba(0,0,0,0.1)] p-[30px]">
            <h5 className="text-primary font-bold mb-[10px] text-[16px]">
              OUR WORKING HOURS
            </h5>
            <p className="font-bold text-[15px]">Monday To Friday:</p>
            <p className="text-[15px]">(10:00 AM - 6:00 PM)</p>
            <br />
            <p className="font-bold text-[15px]">Saturday:</p>
            <p className="text-[15px]">(By Appointment Only)</p>
            <br />
            <p className="text-[15px]">
              <span className="font-bold">Sunday:</span> Closed
            </p>
          </div>
          <div className="flex-1 bg-white rounded-[20px] shadow-[0_3px_20px_rgba(0,0,0,0.1)] p-[30px]">
            <div className="mb-[20px]">
              <h5 className="text-primary font-bold mb-[10px] text-[16px]">
                OUR OFFICE LOCATION
              </h5>
              <p className="text-[15px]">
                15315 66 Ave unit 327, Surrey, BC V3S 2A1
              </p>
            </div>
            <div>
              <h5 className="text-primary font-bold mb-[10px] text-[16px]">
                GET IN TOUCH
              </h5>
              <p className="text-[15px]">(604) 503-3734</p>
              <p className="text-[15px]">info<span>@</span>brightlightimmigration.ca</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
