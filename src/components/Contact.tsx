"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiCheckboxCircleLine, 
  RiErrorWarningLine, 
  RiLoader4Line, 
  RiMailLine, 
  RiWhatsappLine, 
  RiMapPinLine,
  RiPhoneLine,
  RiArrowRightLine
} from 'react-icons/ri';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [countryCode, setCountryCode] = useState(''); 
  
  const [validationAlerts, setValidationAlerts] = useState({
    name: false,
    email: false,
    phone: false
  });

  const [phone, setPhone] = useState('');
  const [formShake, setFormShake] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const whatsappMessage = encodeURIComponent("I am contacting via your website and interested in your services");

  const socialIcons = [
    {
      href: 'https://wa.me/971527925100?text=Hello%204Biz%20International,%20I%20am%20interested%20in%20your%20services.%20Please%20share%20more%20details.',
      label: 'WhatsApp',
      path: 'M20.52 3.48A11.8 11.8 0 0 0 12.04 0C5.4 0 .02 5.38.02 12c0 2.12.56 4.19 1.62 6.02L0 24l6.15-1.61A11.97 11.97 0 0 0 12.04 24C18.66 24 24 18.62 24 12c0-3.2-1.25-6.2-3.48-8.52zM12.04 21.9c-1.8 0-3.56-.48-5.1-1.38l-.36-.21-3.65.96.98-3.56-.24-.37A9.8 9.8 0 0 1 2.24 12c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.9-9.8 9.9zm5.38-7.36c-.29-.15-1.72-.85-1.99-.95-.27-.1-.47-.15-.66.15-.19.29-.76.95-.93 1.14-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.58-.9-2.16-.24-.58-.49-.5-.66-.51h-.56c-.19 0-.51.07-.78.36-.27.29-1.02 1-.98 2.43.05 1.43 1.02 2.81 1.16 3 .15.19 2.02 3.08 4.89 4.31.68.29 1.21.46 1.62.58.68.22 1.3.19 1.79.12.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.19-.56-.34z',
      target: '_blank',
    },
    {
      href: 'https://www.facebook.com/4bizglobal',
      label: 'Facebook',
      path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
      target: '_blank',
    },
    {
      href: 'https://www.instagram.com/4biz_ae',
      label: 'Instagram',
      path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4.162 4.162 0 1 1 0-8.324A4.162 4.162 0 0 1 12 16zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
      target: '_blank',
    },
    {
      href: 'https://www.linkedin.com/company/4biz-international/',
      label: 'LinkedIn',
      path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
      target: '_blank',
    },
    {
      href: 'https://x.com/4biz123',
      label: 'X',
      path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
      target: '_blank',
    },
    {
      href: 'https://www.youtube.com/@4bizinternationalae',
      label: 'YouTube',
      path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
      target: '_blank',
    }
  ];

  useEffect(() => {
    const resolveLocation = async () => {
      try {
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
        if (zone.includes('kolkata') || zone.includes('calcutta') || zone.includes('india')) {
          setCountryCode('in');
          return;
        }
        if (zone.includes('dubai') || zone.includes('asia/dubai') || zone.includes('abudhabi')) {
          setCountryCode('ae');
          return;
        }
      } catch (_) {}

      try {
        const locale = navigator.language || (navigator.languages && navigator.languages[0]);
        if (locale && locale.includes('-')) {
          const region = locale.split('-')[1].toLowerCase();
          if (region === 'in' || region === 'ae') {
            setCountryCode(region);
            return;
          }
        }
      } catch (_) {}

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          if (data.country_code) {
            setCountryCode(data.country_code.toLowerCase()); 
            return;
          }
        }
      } catch (_) {}

      setCountryCode('ae');
    };

    resolveLocation();
  }, []);

  const handleInputChange = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    setValidationAlerts(prev => ({
      ...prev,
      name: name ? false : prev.name,
      email: email ? false : prev.email
    }));
  };

  useEffect(() => {
    if (phone.trim().length > 4) {
      setValidationAlerts(prev => ({ ...prev, phone: false }));
    }
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    const errors = {
      name: !name || !name.trim(),
      email: !email || !email.trim(),
      phone: !phone || phone.trim().length <= 4
    };

    setValidationAlerts(errors);

    if (errors.name || errors.email || errors.phone) {
      setFormShake(true);
      setTimeout(() => setFormShake(false), 500);
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    const payload = Object.fromEntries(formData.entries());
    payload.phone = phone;
    payload.countryCode = (countryCode || 'ae').toUpperCase(); 

    try {
      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let result: any = {};
      try {
        result = await response.json();
      } catch (_) {}

      const isSuccessful = response.ok && (
        result.status === 'success' || 
        result.status === 'partial_success' || 
        result.success === true
      );

      if (isSuccessful) {
        setStatus('success');
        if (formRef.current) formRef.current.reset();
        setPhone('');

        if (result.status === 'partial_success' && result.error) {
          setErrorMsg(result.error);
        }

        const safeFetch = async (url: string, options: RequestInit) => {
          try {
            await fetch(url, options);
          } catch (err) {
            console.warn(`Background dispatch error for ${url}:`, err);
          }
        };

        safeFetch("https://fourbiz-lead-crm-backend-python.onrender.com/api/leads", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            message: message || ""
          })
        });

        safeFetch("https://4biz-crm-app.vercel.app/api/contact", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            requirements: message || "",
            campaign_name: 'Official Website Direct Inquiry'
          })
        });

        setTimeout(() => {
          setStatus('idle');
          setErrorMsg('');
        }, 5000);
      } else {
        const detailedError = result?.error || result?.message || result?.details || `Server response status: ${response.status} (${response.statusText || 'Failed'})`;
        throw new Error(detailedError);
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Unable to establish connection or transmit email payload.');
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden transform-gpu backface-hidden border-t border-neutral-100 font-sans select-text w-full"
      style={{
        contentVisibility: 'auto',
        contain: 'paint layout',
        containmentIntrinsicSize: '1px 1200px',
      } as React.CSSProperties}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[90vh] items-stretch relative w-full">
        
        {/* LEFT COMPONENT: CONTACT FORM */}
        <div className="lg:col-span-6 xl:col-span-7 bg-[#fcfdfd] py-16 px-6 sm:px-12 lg:px-16 xl:px-20 flex flex-col justify-center transition-colors duration-300 w-full">
          <div className="w-full max-w-xl mx-auto space-y-8">
            <header className="text-left">
              <h2 className="text-4xl sm:text-5xl font-black text-[#0c9d7d] tracking-tight uppercase leading-none">
                CONTACT US
              </h2>
              <p className="text-sm font-semibold mt-4 text-neutral-900 tracking-wide max-w-md leading-relaxed">
                Drive digital growth with expert IT solutions. Let us scale your business.
              </p>
            </header>

            <motion.div 
              animate={formShake ? { x: [-6, 6, -4, 4, -2, 2, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="w-full will-change-transform"
            >
              <form ref={formRef} onSubmit={handleSubmit} onChange={handleInputChange} className="space-y-5" noValidate>
                
                {/* Full Name */}
                <div className="relative w-full flex flex-col">
                  <AnimatePresence initial={false}>
                    {validationAlerts.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-2 mb-1 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-[11px] font-bold text-rose-600 overflow-hidden"
                      >
                        <RiErrorWarningLine className="text-sm shrink-0" />
                        <span>Full name is required</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <label htmlFor="form-name" className="sr-only">Full Name</label>
                  <input id="form-name" required name="name" type="text" placeholder="Full Name*" autoComplete="name" className="screenshot-input" />
                </div>

                {/* Email Address */}
                <div className="relative w-full flex flex-col">
                  <AnimatePresence initial={false}>
                    {validationAlerts.email && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-2 mb-1 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-[11px] font-bold text-rose-600 overflow-hidden"
                      >
                        <RiErrorWarningLine className="text-sm shrink-0" />
                        <span>Valid email address is required</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <label htmlFor="form-email" className="sr-only">Email Address</label>
                  <input id="form-email" required name="email" type="email" placeholder="Email*" autoComplete="email" autoCapitalize="none" className="screenshot-input" />
                </div>

                {/* Phone Input Container */}
                <div className="flex flex-col w-full">
                  <AnimatePresence initial={false}>
                    {validationAlerts.phone && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-2 mb-1 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-[11px] font-bold text-rose-600 overflow-hidden"
                      >
                        <RiErrorWarningLine className="text-sm shrink-0" />
                        <span>Phone number is required</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="phone-input-container w-full">
                    {countryCode ? (
                      <PhoneInput
                        defaultCountry={countryCode}
                        value={phone}
                        className="w-full"
                        placeholder="Phone Number*"
                        onChange={(phoneStr, metaData) => {
                          setPhone(phoneStr);
                          if (metaData && metaData.country && metaData.country.iso2) {
                            const newCode = metaData.country.iso2.toLowerCase();
                            if (newCode !== countryCode) {
                              setCountryCode(newCode);
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-[54px] bg-neutral-100 animate-pulse rounded-full" />
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className="flex flex-col w-full">
                  <label htmlFor="form-message" className="sr-only">Your Message</label>
                  <textarea id="form-message" name="message" placeholder="Your Message (optional)" className="screenshot-input h-28 resize-none" />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="px-12 h-[52px] bg-black hover:bg-[#0c9d7d] text-white font-black rounded-full tracking-widest uppercase text-xs flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none w-max transform-gpu will-change-transform"
                >
                  {status === 'sending' ? (
                    <>
                      <RiLoader4Line className="animate-spin text-lg" /> SENDING...
                    </>
                  ) : (
                    <>
                      SEND <RiArrowRightLine className="text-base" />
                    </>
                  )}
                </button>

                <AnimatePresence mode="wait">
                  {status !== 'idle' && status !== 'sending' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      className={`p-4 border rounded-xl flex flex-col gap-1 text-xs font-semibold will-change-transform ${
                        status === 'success' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {status === 'success' ? (
                          <RiCheckboxCircleLine className="text-lg shrink-0 text-emerald-600" />
                        ) : (
                          <RiErrorWarningLine className="text-lg shrink-0 text-rose-600" />
                        )}
                        <span className="font-bold">
                          {status === 'success' ? 'Thank you! Your lead has been logged into CRM successfully.' : `SMTP / API Error: ${errorMsg}`}
                        </span>
                      </div>
                      {errorMsg && status === 'success' && (
                        <p className="text-[11px] opacity-80 pl-6">
                          Note: {errorMsg}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            {/* Social Icons Row */}
            <div className="pt-5 flex items-center gap-3 border-t border-neutral-200 mt-2">
              {socialIcons.map((icon, idx) => (
                <a
                  key={idx}
                  href={icon.href}
                  target={icon.target}
                  rel="noopener noreferrer"
                  aria-label={icon.label}
                  className="w-10 h-10 rounded-full border border-neutral-400 hover:border-[#0c9d7d] text-neutral-800 hover:text-[#0c9d7d] transition-all flex items-center justify-center transform hover:scale-105 will-change-transform"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={icon.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: BRAND OFFICE PANEL */}
        <div className="lg:col-span-6 xl:col-span-5 bg-slate-100 border-t lg:border-t-0 border-neutral-200/50 py-16 px-6 sm:px-12 lg:px-12 xl:px-16 flex flex-col justify-center transition-colors duration-300 w-full">
          <div className="w-full max-w-xl mx-auto space-y-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-[2px] bg-[#0c9d7d] inline-block"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Corporate Presence</span>
              </div>
              <h3 className="text-3xl font-black text-neutral-900 tracking-tight">
                Our <span className="text-[#0c9d7d]">Offices</span>
              </h3>
            </div>

            <div className="w-full space-y-12 block text-left items-start">
              
              {/* REGION SECTION 1: UAE */}
              <div className="w-full block text-left space-y-4">
                <div className="w-full pb-2 border-b border-neutral-300">
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-900 block">United Arab Emirates</span>
                </div>

                <div className="group w-full block text-left">
                  <h4 className="text-sm font-extrabold text-neutral-900 tracking-wide uppercase transition-colors duration-200 group-hover:text-[#0c9d7d] block">
                    Dubai Corporate Hub
                  </h4>
                  <p className="text-xs text-neutral-800 mt-2 leading-relaxed font-semibold block max-w-md">
                    Crystal Building - Office # 104 - 2C St - near ADCB Metro Station - Al Karama - Dubai, UAE
                  </p>
                  
                  <div className="mt-3.5 space-y-2 border-l-2 border-neutral-300 pl-3 block text-left w-full">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-950">
                      <RiPhoneLine className="text-neutral-950 text-sm shrink-0" />
                      <a href="tel:+971527925100" className="hover:text-[#0c9d7d] transition-colors tracking-wide">+971 52 792 5100</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-950">
                      <RiMailLine className="text-neutral-950 text-sm shrink-0" />
                      <a href="mailto:info@4bizinternational.com" className="hover:text-[#0c9d7d] transition-colors tracking-wide">info@4bizinternational.com</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-5 w-full justify-start">
                    <a href="https://maps.app.goo.gl/zz1z6RrXVv2vGMMt5" target="_blank" rel="noopener noreferrer" title="View Location" className="w-8 h-8 rounded-full bg-white hover:bg-neutral-950 text-neutral-900 hover:text-white transition-all flex items-center justify-center text-base shadow-sm border border-neutral-300">
                      <RiMapPinLine />
                    </a>
                    <a href={`https://wa.me/971527925100?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" title="WhatsApp Chat" className="w-8 h-8 rounded-full bg-white hover:bg-emerald-600 text-neutral-900 hover:text-white transition-all flex items-center justify-center text-base shadow-sm border border-neutral-300">
                      <RiWhatsappLine />
                    </a>
                    <a href="tel:+971527925100" title="Call Office" className="w-8 h-8 rounded-full bg-white hover:bg-blue-600 text-neutral-900 hover:text-white transition-all flex items-center justify-center text-base shadow-sm border border-neutral-300">
                      <RiPhoneLine />
                    </a>
                    <a href="mailto:info@4bizinternational.com" title="Send Email" className="w-8 h-8 rounded-full bg-white hover:bg-neutral-950 text-neutral-900 hover:text-white transition-all flex items-center justify-center text-base shadow-sm border border-neutral-300">
                      <RiMailLine />
                    </a>
                  </div>
                </div>
              </div>

              {/* REGION SECTION 2: INDIA */}
              <div className="w-full block text-left space-y-6 pt-2">
                <div className="w-full pb-2 border-b border-neutral-300">
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-900 block">India</span>
                </div>

                <div className="group w-full block text-left">
                  <h4 className="text-sm font-extrabold text-neutral-900 tracking-wide uppercase transition-colors duration-200 group-hover:text-[#0c9d7d] block">
                    India HiLite Business Park
                  </h4>
                  <p className="text-xs text-neutral-800 mt-2 leading-relaxed font-semibold block max-w-md">
                    Tower 2, HiLITE Business Park, Office 2723, 7th Floor, near HiLITE Mall, Poovangal, Pantheeramkavu, Kozhikode, Kerala 673014, India
                  </p>
                  
                  <div className="mt-3.5 space-y-2 border-l-2 border-neutral-300 pl-3 block text-left w-full">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-950">
                      <RiPhoneLine className="text-neutral-950 text-sm shrink-0" />
                      <a href="tel:+919388001524" className="hover:text-[#0c9d7d] transition-colors tracking-wide">+91 93880 01524</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-950">
                      <RiMailLine className="text-neutral-950 text-sm shrink-0" />
                      <a href="mailto:info@4bizinternational.com" className="hover:text-[#0c9d7d] transition-colors tracking-wide">info@4bizinternational.com</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-5 w-full justify-start">
                    <a href="https://maps.app.goo.gl/zkz2FKXFnjxbw2ep8" target="_blank" rel="noopener noreferrer" title="View Location" className="w-8 h-8 rounded-full bg-white hover:bg-neutral-950 text-neutral-900 hover:text-white transition-all flex items-center justify-center text-base shadow-sm border border-neutral-300">
                      <RiMapPinLine />
                    </a>
                    <a href={`https://wa.me/919388001524?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" title="WhatsApp Chat" className="w-8 h-8 rounded-full bg-white hover:bg-emerald-600 text-neutral-900 hover:text-white transition-all flex items-center justify-center text-base shadow-sm border border-neutral-300">
                      <RiWhatsappLine />
                    </a>
                    <a href="tel:+919388001524" title="Call Office" className="w-8 h-8 rounded-full bg-white hover:bg-blue-600 text-neutral-900 hover:text-white transition-all flex items-center justify-center text-base shadow-sm border border-neutral-300">
                      <RiPhoneLine />
                    </a>
                    <a href="mailto:info@4bizinternational.com" title="Send Email" className="w-8 h-8 rounded-full bg-white hover:bg-neutral-950 text-neutral-900 hover:text-white transition-all flex items-center justify-center text-base shadow-sm border border-neutral-300">
                      <RiMailLine />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .screenshot-input {
          width: 100%;
          background: #ffffff !important;
          border: 1.5px solid #000000 !important;
          padding: 0 1.5rem;
          color: #18181b !important;
          border-radius: 9999px;
          outline: none;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          font-size: 14px;
          height: 54px;
          font-weight: 500;
        }
        .screenshot-input:focus {
          border-color: #0c9d7d !important;
          box-shadow: 0 0 0 3px rgba(12, 157, 125, 0.15);
        }
        .screenshot-input::placeholder {
          color: #52525b !important;
          opacity: 1 !important;
        }
        textarea.screenshot-input {
          height: 120px !important;
          padding-top: 16px !important;
          border-radius: 24px !important;
        }

        .screenshot-input:-webkit-autofill,
        .screenshot-input:-webkit-autofill:hover, 
        .screenshot-input:-webkit-autofill:focus,
        .screenshot-input:-webkit-autofill:active {
          -webkit-text-fill-color: #18181b !important;
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          box-shadow: 0 0 0 1000px #ffffff inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        
        .phone-input-container {
          width: 100%;
          height: 54px !important;
          position: relative;
          z-index: 40 !important; 
        }
        .react-international-phone-input-container {
          width: 100% !important;
          height: 54px !important;
          background: #ffffff !important;
          border: 1.5px solid #000000 !important;
          border-radius: 9999px !important;
          display: flex !important;
          align-items: center !important;
          padding-left: 14px !important;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .react-international-phone-input-container:focus-within {
          border-color: #0c9d7d !important;
          box-shadow: 0 0 0 3px rgba(12, 157, 125, 0.15);
        }
        .react-international-phone-input {
          flex: 1 !important;
          width: 100% !important;
          background: transparent !important;
          border: none !important;
          padding: 0 1.5rem 0 0.5rem !important;
          color: #18181b !important; 
          height: 100% !important;
          font-size: 14px !important;
          outline: none !important;
          font-weight: 500 !important;
        }
        .react-international-phone-input::placeholder {
          color: #52525b !important;
          opacity: 1 !important;
        }
        
        .react-international-phone-selector-button {
          background: transparent !important;
          border: none !important;
          height: 100% !important;
          width: 45px !important;
          min-width: 45px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          padding: 0 !important;
        }
        
        .react-international-phone-country-selector-dropdown,
        ul.react-international-phone-country-selector-dropdown {
          background: #ffffff !important;
          border: 1px solid #000000 !important; 
          border-radius: 16px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          padding: 6px !important;
          max-height: 240px !important;
          width: 280px !important;
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          z-index: 99999 !important; 
          overflow-y: auto !important;
        }
        
        ul.react-international-phone-country-selector-dropdown li {
          background: transparent !important;
          padding: 8px 12px !important;
          border-radius: 8px !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
        }
        
        .react-international-phone-country-selector-list-item-name,
        .react-international-phone-country-selector-list-item-dial-code,
        li.react-international-phone-country-selector-list-item span {
          color: #18181b !important; 
          font-family: system-ui, -apple-system, sans-serif !important;
          font-size: 13px !important;
          font-weight: 600 !important;
        }
        
        li.react-international-phone-country-selector-list-item:hover {
          background-color: #f4f4f5 !important; 
        }
        
        li.react-international-phone-country-selector-list-item[aria-selected="true"] {
          background-color: #e4e4e7 !important; 
        }
      `}</style>
    </section>
  );
}