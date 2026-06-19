import React, { useState } from 'react';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does the AI Skin Finder quiz determine my skin type?',
      a: 'Our rule-based engine scores answers regarding afternoon oil production, skin tightness, and sensitivities. It then matches results (Dry, Oily, Combo, Sensitive, Normal) against product suitability tags.'
    },
    {
      q: 'What is the refund policy on luxury formulations?',
      a: 'We offer full returns within 30 days of purchase if formulas cause sensitivities. Returns are complimentary, and return labels can be generated from your purchase logs.'
    },
    {
      q: 'Are your botanical formulas organic and clean?',
      a: 'Aurelia is 100% cruelty-free and formulated without synthetic parabens, petrolatum, or endocrine-disrupting chemicals. All cosmetic ingredients are sourced under strict eco-responsible standards.'
    },
    {
      q: 'How do I redeem my reward points?',
      a: 'Reward points accumulated from past purchases are displayed at checkout. You can apply them to deduct balances (e.g. 100 points = $10 discount) or exchange them for sample items.'
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setSubmitted(true);
      toast.success('Your message has been received by our Atelier team.');
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-16 pb-16">
      
      {/* Title */}
      <div className="text-center py-6 border-b border-plum/5">
        <h1 className="text-4xl font-serif text-plum dark:text-ivory">Atelier Support & FAQ</h1>
        <p className="text-xs uppercase tracking-widest text-plum/50 dark:text-ivory/50 mt-2 font-semibold">
          Get in touch with Aurelia skin experts or search our knowledge database
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Contact Form */}
        <div className="glass-card p-8 border border-plum/10 space-y-6">
          <h3 className="font-serif font-semibold text-lg border-b border-plum/5 pb-2">Send a Message</h3>
          
          {submitted ? (
            <div className="space-y-4 text-center py-6">
              <CheckCircle className="w-12 h-12 text-gold mx-auto" />
              <p className="font-serif text-sm font-semibold">Message Sent Successfully</p>
              <p className="text-xs text-plum/60 dark:text-ivory/60 leading-relaxed font-light">
                An Aurelia esthetician will review your concerns and contact you within 24 business hours.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-outline text-xs px-6 py-2">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="ELENA ROSTOVA"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="YOU@EMAIL.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60 font-semibold">Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="DESCRIBE YOUR INQUIRY OR INGREDIENTS CONCERN"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent border border-plum/20 focus:border-gold p-3 text-xs text-plum dark:text-ivory"
                />
              </div>

              <button type="submit" className="w-full btn-plum flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* FAQs Accordion & Coordinates */}
        <div className="space-y-8">
          
          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg border-b border-plum/5 pb-2">Common Inquiries</h3>
            <div className="space-y-2.5">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-plum/5 pb-3 text-xs">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left font-bold text-plum dark:text-ivory hover:text-gold uppercase tracking-wider py-1.5 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-gold" />}
                  </button>
                  {openFaq === idx && (
                    <p className="mt-2 text-plum/70 dark:text-ivory/70 leading-relaxed font-light pl-2">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Coordinates */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg border-b border-plum/5 pb-2">Our Atelier Locations</h3>
            <div className="space-y-3 text-xs text-plum/70 dark:text-ivory/70">
              <div className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-plum dark:text-ivory">Aurelia Flagship Maison</p>
                  <p className="font-light">740 Madison Avenue, New York, NY 10021</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-plum dark:text-ivory">Direct Email</p>
                  <p className="font-light">atelier@aurelia.com</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-plum dark:text-ivory">Concierge Line</p>
                  <p className="font-light">+1 (800) AURELIA (287-3542)</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ContactPage;
