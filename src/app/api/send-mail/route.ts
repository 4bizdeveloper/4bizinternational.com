import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    // 1. Dispatch lead payloads to CRM endpoints concurrently on the server
    const crmPromisePython = fetch("https://fourbiz-lead-crm-backend-python.onrender.com/api/leads", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        message: message || ""
      })
    }).catch(err => console.error("Python CRM dispatch error:", err));

    const crmPromiseVercel = fetch("https://4biz-crm-app.vercel.app/api/contact", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        requirements: message || "",
        campaign_name: 'Official Website Direct Inquiry'
      })
    }).catch(err => console.error("Vercel CRM dispatch error:", err));

    // Await CRM requests without blocking execution on failure
    await Promise.allSettled([crmPromisePython, crmPromiseVercel]);

    // 2. Safely attempt Nodemailer SMTP transmission
    let mailSent = false;
    let mailErrorDetail = '';

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
        subject: `New Contact Form Lead: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || 'N/A'}`
      });

      mailSent = true;
    } catch (smtpErr: any) {
      console.error("Nodemailer SMTP Error Caught:", smtpErr);
      mailErrorDetail = smtpErr?.message || "Gmail SMTP delivery failed.";
    }

    // 3. Return JSON response based on execution
    if (!mailSent) {
      // Return 200 OK with CRM success warning so the frontend shows lead saved
      return NextResponse.json(
        { 
          status: 'partial_success', 
          message: 'Lead received and recorded in CRM, but Gmail daily limit was reached.',
          error: mailErrorDetail 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: 'success', message: 'Inquiry transmitted successfully!' },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("API Route Execution Error:", err);
    return NextResponse.json(
      { status: 'error', error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}