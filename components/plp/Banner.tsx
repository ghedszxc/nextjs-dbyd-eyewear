import RichText from "../RichText";

interface Banner {
  title: string;
  title2?: string;
  description: any;
  description2?: any;
}

interface BannerProps {
  banner: Banner;
  category?: string[];
}

const Banner = ({ banner, category }: BannerProps) => {
  const { title, description } = banner;

  return (
    <div className="w-full bg-white">
      <div className="font-[rgba(0, 0, 0, 1)] flex flex-col gap-4 px-6 py-8 lg:text-center lg:px-20 lg:py-10">
        <h2 className="font-matter-regular text-2xl">{title}</h2>
        <RichText
          doc={{
            type: description?.type,
            content: description?.content,
          }}
          className={{
            p: "font-matter-regular text-sm",
          }}
        />
      </div>
    </div>
  );
};

export default Banner;
