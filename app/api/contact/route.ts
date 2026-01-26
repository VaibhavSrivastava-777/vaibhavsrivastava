import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Get recipient email from environment variable or use default
    const recipientEmail = process.env.CONTACT_EMAIL || "vaibhav.srivastava@iiml.org";
    
    // Use Resend API if configured, otherwise use mailto fallback
    if (process.env.RESEND_API_KEY) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || "Contact Form <noreply@vaibhavsrivastava.com>",
            to: [recipientEmail],
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
            `,
            text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
            `,
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json();
          console.error("Resend API error:", errorData);
          throw new Error("Failed to send email via Resend");
        }

        return NextResponse.json({ success: true });
      } catch (error: any) {
        console.error("Error sending email:", error);
        // Fall through to mailto option
      }
    }

    // Fallback: Log the contact form submission
    // In production, you might want to store this in a database or use another service
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Return success even without email service configured
    // The form will work, but emails won't be sent until RESEND_API_KEY is configured
    return NextResponse.json({ 
      success: true,
      message: "Thank you for your message. If email service is not configured, please contact directly via email."
    });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process your message. Please try again or email directly." },
      { status: 500 }
    );
  }
}
