import type { Product } from "../../../api/productApi";

interface ProductDetailsImageProps {
  product: Product;
  packaging: string;
}

function ProductDetailsImage({
  product,
  packaging,
}: ProductDetailsImageProps) {
  const image =
    packaging === "Glass Jar"
      ? product.glassJarImage
      : packaging === "Cardboard Box"
        ? product.cardboardBoxImage
        : product.image;

  return (
    <div
      className="
        relative flex min-h-[360px]
        items-center justify-center
        overflow-hidden
        bg-gradient-to-br
        from-[#FBF6EE]
        via-[#F9F2E8]
        to-[#FBF6EE]
        p-8

        sm:min-h-[500px]
        sm:p-12

        lg:sticky
        lg:top-[80px]
        lg:min-h-[620px]
        lg:self-start
        lg:p-14
      "
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -left-24 -top-24
          h-72 w-72
          rounded-full
          bg-[#FBEEF1]/60
          blur-[90px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -bottom-28 -right-20
          h-64 w-64
          rounded-full
          bg-[#F4E8D8]/60
          blur-[80px]
        "
      />

      {/* Packaging label */}
      {packaging && (
        <div
          className="
            absolute left-5 top-5 z-10
            rounded-full
            border border-[#EFE3D2]
            bg-white/90
            px-3.5 py-1.5
            text-[10px]
            font-medium
            uppercase
            tracking-[0.14em]
            text-[#8B6F5C]
            backdrop-blur-sm

            sm:left-7
            sm:top-7
          "
        >
          {packaging}
        </div>
      )}

      {image ? (
        <img
          src={image}
          alt={`${product.name} ${packaging}`}
          className="
            relative z-[2]
            max-h-[330px]
            w-full
            object-contain
            drop-shadow-[0_20px_25px_rgba(80,50,30,0.08)]

            sm:max-h-[430px]

            lg:max-h-[500px]
          "
        />
      ) : (
        <div className="relative z-[2] text-sm text-[#8B7A6C]">
          Image unavailable
        </div>
      )}
    </div>
  );
}

export default ProductDetailsImage;