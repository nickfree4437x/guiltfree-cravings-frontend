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
      href: whatsappLink,
      external: true,
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us",
      cta: "Start a chat",
      iconColor: "text-[#3D8B5F]",
      iconBg: "bg-[#E8F5EE]",
      accentColor: "#3D8B5F",
      ariaLabel: "Chat with us on WhatsApp",
    },
    {
      id: "phone",
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
    <section className="relative overflow-hidden bg-white px-6 pb-4 sm:px-10 sm:pb-6 md:px-14 lg:px-20">

      {/* Decorative bg */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#F5E6D8]/50 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-[#FBEEF1]/60 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">

        {/* ================= METHODS — 1 ROW ================= */}
        <div className="grid grid-cols-1 divide-y divide-[#EFE3D2] sm:grid-cols-3 sm:divide-y-0 sm:divide-x">

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
                  group relative flex items-center gap-4
                  px-0 py-5
                  sm:flex-col sm:items-start sm:gap-3 sm:px-7 sm:py-8
                  transition-all duration-300
                "
              >
                {/* Icon */}
                <span
                  className={`
                    flex h-11 w-11 shrink-0 items-center justify-center
                    rounded-xl ${method.iconBg} ${method.iconColor}
                    transition-transform duration-500
                  `}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1 sm:w-full">

                  {/* Label + arrow */}
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[14px] font-semibold leading-tight text-[#1F4A2E] sm:text-[16px]">
                      {method.label}
                    </h3>

                    <ArrowUpRight
                      className="
                        h-3.5 w-3.5 shrink-0
                        transition-transform duration-500
                        group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                      "
                      style={{ color: method.accentColor }}
                      strokeWidth={2.4}
                    />
                  </div>

                  {/* Value */}
                  <p className="mt-1 break-all text-[12.5px] leading-[1.5] text-[#7A6A5C] sm:text-[13px]">
                    {method.value}
                  </p>

                  {/* CTA */}
                  <p
                    className="mt-2 hidden text-[11.5px] tracking-wide sm:block"
                    style={{ color: method.accentColor }}
                  >
                    {method.cta}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default ContactMethods;