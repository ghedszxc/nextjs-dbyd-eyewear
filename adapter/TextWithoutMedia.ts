// [COMMENTED OUT] - This adapter is not needed for now
// import { ITextWithoutMedia } from "@/models/widgets/ITextWithoutMedia";
// import { Nullable } from "@/adapter/model/Nullable.interface";
// import { Adapter } from "@/adapter/model/Adapter";

// export class TextWithoutMediaAdapter extends Adapter<ITextWithoutMedia, Promise<Nullable<ITextWithoutMedia>>> {
//   adapt = async (source: any, lang?: Language): Promise<Nullable<ITextWithoutMedia>> => {
//     const data = source?.contents?.[0];
//     const content = data?.content ?? {};

//     const heading = content?.teaser_title || content?.teaser_title1 || "";
//     const subtitle = content?.teaser_title2 || "";

//     return { heading, subtitle };
//   };

//   adaptReverse = (source: Nullable<any>) => {
//     return source;
//   };
// }
