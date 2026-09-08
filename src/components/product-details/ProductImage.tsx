interface ProductImageProps {
  image: string;
  name: string;
}

function ProductImage({
  image,
  name,
}: ProductImageProps) {
  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative overflow-hidden rounded-lg bg-white">
        <div className="flex min-h-[360px] items-center justify-center p-6 sm:min-h-[480px] sm:p-10 lg:min-h-[560px] lg:p-12">
          <img
            src={image}
            alt={name}
            loading="eager"
            className="h-full max-h-[520px] w-full max-w-[620px] object-contain object-center transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductImage;