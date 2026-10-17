import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "919667760119";

const MESSAGE =
  "Hi GuiltFree Cravings! I'd like to know more about your laddoos.";

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    MESSAGE
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with GuiltFree Cravings on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-20 right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#20BA5A] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
    >
      <FaWhatsapp size={34} aria-hidden="true" />
    </a>
  );
}