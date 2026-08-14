import React from "react";
import { ITwoColumnText } from "@/models/widgets/ITwoColumnText";
import RichText from "@/components/RichText";
import Link from "next/link";

const TwoColumnText = ({ title, subtitle, bgColor, fontColor, titleFontSize, mobilePaddingY, bottomPadding, cta }: ITwoColumnText) => {
  if (!title && !subtitle) return null;

  const mobilePyStyle = mobilePaddingY ? { paddingTop: mobilePaddingY, paddingBottom: mobilePaddingY } : undefined;

  return (
    <section
      style={{ backgroundColor: bgColor, color: fontColor }}
      data-tc-bp={bottomPadding !== undefined ? "" : undefined}
    >
      {bottomPadding !== undefined && (
        <style>{`
          @media (min-width: 768px) {
            section[data-tc-bp] > div {
              padding-bottom: ${bottomPadding} !important;
            }
          }
        `}</style>
      )}
      <div
        className={`!font-matter-regular flex flex-col gap-4 px-6 ${mobilePaddingY ? (bottomPadding !== undefined ? "md:!pt-20" : "md:!py-20") : "py-10 md:py-20"} md:flex-row md:justify-between md:px-20`}
        style={mobilePyStyle}
      >
        <div className="md:flex-1">
          {title && (
            <p className={`${titleFontSize || "text-[30px]"} leading-[1.25]`}>
              {typeof title === "string" &&
                 title.split("\n").map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
            </p>
          )}
        </div>

        <div className="md:flex-1">
          {subtitle?.doc && (
            <RichText
              doc={{
                type: subtitle.doc.type,
                content: subtitle.doc.content,
              }}
              className={{
                p: "text-base leading-[1.5]",
              }}
            />
          )}

          {cta?.href && (
            <Link
              href={cta.href}
              style={{ border: `1px solid ${fontColor}` }}
              className={`mt-8 inline-block px-4 py-2 text-center text-lg leading-normal md:w-auto`}
            >
              {cta.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default TwoColumnText;
