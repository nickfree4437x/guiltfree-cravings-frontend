import {
  Mail,
  MessageCircle,
  Phone,
  ArrowUpRight,
} from "lucide-react";

const CONTACT_PHONE = "+91 XXXXX XXXXX";
const CONTACT_EMAIL = "hello@example.com";
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

function ContactMethods() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}`;

  const methods = [
    {
      id: "whatsapp",
      number: "01",
      href: whatsappLink,
      external: true,
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us directly",
      cta: "Start a chat",
      iconColor: "text-[#3D8B5F]",
      iconBg: "bg-[#E8F5EE]",
      accentColor: "#3D8B5F",
      ariaLabel: "Chat with us on WhatsApp",
    },
    {
      id: "phone",
      number: "02",
      href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`,
      external: false,
      icon: Phone,
      label: "Call Us",
      value: CONTACT_PHONE,
      cta: "Give us a call",
      iconColor: "text-[#B5697A]",
      iconBg: "bg-[#FBEEF1]",
      accentColor: "#B5697A",
      ariaLabel: `Call us at ${CONTACT_PHONE}`,
    },
    {
      id: "email",
      number: "03",
      href: `mailto:${CONTACT_EMAIL}`,
      external: false,
      icon: Mail,
      label: "Email Us",
      value: CONTACT_EMAIL,
      cta: "Send an email",
      iconColor: "text-[#B58A3D]",
      iconBg: "bg-[#FAF3E3]",
      accentColor: "#B58A3D",
      ariaLabel: `Email us at ${CONTACT_EMAIL}`,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white px-6 pt-8 sm:px-10 md:px-14 lg:px-20">

      <div className="relative mx-auto max-w-4xl">

        {/* ================= METHODS ROWS ================= */}
        <div className="relative space-y-4">
          {methods.map((method) => {
            const Icon = method.icon;

            return (
              <a
                key={method.id}
                href={method.href}
                target={method.external ? "_blank" : undefined}
                rel={method.external ? "noopener noreferrer" : undefined}
                aria-label={method.ariaLabel}
                className="
                  group relative flex items-center gap-4 rounded-xl
                  px-4 py-5 border border-gray-200
                  transition-all duration-300
                bg-white/70
                  sm:gap-4 sm:px-6 sm:py-6
                "
              >


                {/* ============ ICON ============ */}
                <span
                  className={`
                    flex h-12 w-12 shrink-0 items-center justify-center
                    rounded-2xl ${method.iconBg} ${method.iconColor}
                    transition-all duration-500
                    sm:h-14 sm:w-14
                  `}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.9} />
                </span>

                {/* ============ CONTENT ============ */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold leading-tight text-[#1F4A2E] sm:text-[17px]">
                      {method.label}
                    </h3>

                    <span
                      className="hidden h-1 w-1 rounded-full sm:block"
                      style={{ backgroundColor: method.accentColor }}
                    />

                    <span className="hidden text-[11px] tracking-[0.12em] text-[#8B7A6C] sm:inline">
                      {method.cta}
                    </span>
                  </div>

                  <p className="mt-1.5 break-all text-[13px] leading-[1.5] text-[#7A6A5C] sm:text-[14px]">
                    {method.value}
                  </p>
                </div>

                {/* ============ ARROW ============ */}
                <span
                  className="
                    flex h-10 w-10 shrink-0 items-center justify-center
                    rounded-full border border-[#EFE3D2] bg-white
                    sm:h-11 sm:w-11
                  "
                  style={{
                    backgroundColor: undefined,
                  }}
                >
                  <ArrowUpRight
                    className="h-4 w-4 transition-colors duration-500"
                    style={{ color: method.accentColor }}
                    strokeWidth={2.2}
                  />
                </span>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default ContactMethods;