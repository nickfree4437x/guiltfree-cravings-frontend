import type { Product } from "../../api/productApi";

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
        relative flex min-h-[300px]
        items-center justify-center
        overflow-hidden
        bg-white
        p-6
        rounded-xl
        sm:min-h-[400px]
        sm:p-12

        lg:sticky
        lg:top-[80px]
        lg:min-h-[600px]
        lg:self-start
        lg:p-12
      "
    >


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