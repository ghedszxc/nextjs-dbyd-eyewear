import PDP from "./PDP";
import { CTAProvider } from "@/lib/CTAVisibilityContext";
import { TooltipProvider } from "./ui/tooltip";

const PDPPageBuilder = ({
  productId,
  pdpData,
  lang,
}: {
  productId: string;
  pdpData: any;
  lang: Language;
}) => {
  return (
    <>
      <TooltipProvider>
        <CTAProvider>
          <PDP productId={productId} pdpData={pdpData} lang={lang} />
        </CTAProvider>
      </TooltipProvider>
    </>
  );
};

export default PDPPageBuilder;
