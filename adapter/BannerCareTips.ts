import { api } from "@/lib/api";
import { ICareTipsBanner } from "@/models/widgets/ICareTipsBanner";
import { Nullable } from "@/adapter/model/Nullable.interface";
import { Adapter } from "@/adapter/model/Adapter";

export class BannerCareTips extends Adapter<ICareTipsBanner, Promise<Nullable<ICareTipsBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ICareTipsBanner>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};
    const heading = content?.teaser_title || content?.teaser_title1 || "";
    const subtitle = content?.teaser_title2 || "";
    return { heading, subtitle };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
