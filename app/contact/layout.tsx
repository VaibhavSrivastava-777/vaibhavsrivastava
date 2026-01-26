import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Vaibhav Srivastava",
  description: "Get in touch with Vaibhav Srivastava for collaboration, speaking opportunities, or mentorship",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
