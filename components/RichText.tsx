import React, { ReactElement } from "react";
import {
  BlockTypes,
  MarkTypes,
  TextTypes,
  StoryblokRichTextNode,
  StoryblokRichTextProps,
  StoryblokServerRichText,
} from "@storyblok/react/rsc";
import Link from "next/link";
import Image from "next/image";
import { getStoryblokRoot } from "@/constants/storyblok";
import { getOriginalWidthHeightImg } from "@/lib/utils";

type RichTextProps = Pick<StoryblokRichTextProps, "doc"> & {
  className?: {
    div?: string;
    p?: string;
    a?: string;
  };
};

const RichText = (props: RichTextProps) => {
  const resolvers = {
    [MarkTypes.LINK]: (node: StoryblokRichTextNode<ReactElement>) =>
      node.attrs?.linktype === "story" ? (
        <Link
          href={node?.attrs?.href.replace(`/${getStoryblokRoot()}`, "").replace(/^\/[a-z]{2}\//, "/")}
          target={node.attrs?.target}
          key={node?.attrs?.uuid}
          className={props.className?.a}
        >
          {node.text}
        </Link>
      ) : (
        <a href={node.attrs?.href} target="_blank" key={node?.attrs?.href} className={props.className?.a}>
          {node.text}
        </a>
      ),

    [BlockTypes.IMAGE]: (node: StoryblokRichTextNode<ReactElement>) => {
      const { width, height } = getOriginalWidthHeightImg(node?.attrs?.src);
      return (
        <Image
          key={node?.attrs?.id}
          src={node?.attrs?.src}
          alt={node?.attrs?.alt}
          width={width}
          height={height}         
        />
      );
    },

    [BlockTypes.BR]: () => <br key={Math.random()} />,

    [BlockTypes.PARAGRAPH]: (node: StoryblokRichTextNode<ReactElement>) => (
      <p
        key={node?.attrs?.id ?? Math.random()}
        className={props.className?.p}
        dir={node.attrs?.dir}
      >
        {node.children}
      </p>
    ),
  };

  return (
    <div className={props.className?.div}>
      <StoryblokServerRichText
        doc={{
          type: props.doc.type,
          content: props.doc.content,
        }}
        resolvers={resolvers}
      />
    </div>
  );
};

export default RichText;
