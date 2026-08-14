// Main layout sections
export const GALLERY_SECTION_CLASSES = "relative bg-secondary-light flex flex-col justify-center";
export const GALLERY_BACK_BUTTON = "flex px-6 py-4 bg-white lg:bg-transparent lg:p-0 lg:absolute lg:top-12 lg:left-12 lg:z-10";

export const INFO_SECTION_CLASSES = "bg-secondary-light flex h-full flex-col gap-10 p-6 pr-12 lg:p-12";

// Product code heading
export const PRODUCT_CODE_CLASSES = "font-gt-america-standard-light text-3xl lg:text-4xl";
export const PRODUCT_TITLE_CLASSES = "flex flex-col lg:gap-6";
export const PRODUCT_CODE_BADGES = "flex items-start justify-between";
export const PRODUCT_CODE = "font-matter-bold hidden text-sm text-black lg:block";
export const PRODUCT_BADGES = "font-matter-regular hidden gap-6 text-sm text-black lg:flex";
export const PRODUCT_TITLE = "font-matter-regular text-3xl lg:text-4xl text-black";

// Frame color section
export const PRODUCT_VARIANTS_CONTAINER_CLASSES = "flex flex-col gap-2";
export const FRAME_COLOR_LABEL_CLASSES = "font-matter-regular text-sm lg:text-base text-black";
export const FRAME_COLOR_CONTAINER_CLASSES = "flex gap-8";
export const ACTIVE_VARIANT_IMAGE_CLASSES = "relative h-20 w-20 lg:h-18 lg:w-18 border-b-1 border-black";
export const VARIANT_IMAGE_CLASSES = "relative h-20 w-20 lg:h-18 lg:w-18";
export const VARIANT_HOVER_DETAILS_CLASSES = "pointer-events-none absolute top-full left-0 mt-[5px] ml-[30px] flex gap-6 whitespace-nowrap rounded-sm border-[0.5px] border-white bg-[#3A3A2C1A] backdrop-blur-xs px-3 py-2 hidden lg:block";
export const VARIANT_HOVER_DETAIL_ITEM_CLASSES = "flex flex-col gap-0.5";
export const VARIANT_HOVER_DETAIL_LABEL_CLASSES = "font-matter-bold text-xs capitalize text-black";
export const VARIANT_HOVER_DETAIL_VALUE_CLASSES = "font-matter-regular text-xs capitalize text-black";

// Tab styling
export const TAB_LIST_CLASSES = "flex gap-10 bg-transparent p-0";
export const TAB_TRIGGER_CLASSES =
  "font-matter-regular rounded-none bg-transparent text-black p-0 text-sm cursor-pointer data-[state=active]:bg-transparent data-[state=active]:font-matter-bold data-[state=active]:underline data-[state=active]:shadow-none!";
export const TAB_CONTENT_DESCRIPTION_CLASSES = "font-matter-regular text-sm lg:text-base text-black";
export const TAB_CONTENT_DETAILS_CLASSES = "font-matter-regular text-sm text-black";
export const TAB_CONTENT_CARE_CLASSES = "font-matter-regular text-sm lg:text-base text-black pl-2";

// Product details grid
export const DETAILS_CONTAINER_CLASSES = "flex flex-col lg:gap-8";
export const DETAILS_ROW_CLASSES = "flex w-full flex-col lg:flex-row";
export const DETAILS_COLUMN_CLASSES = "flex lg:w-1/2 flex-col gap-2 py-4 lg:py-0";
export const DETAILS_COLUMN_WITH_BORDER_CLASSES =
  "flex flex-col gap-2 border-b border-[#dedede] py-4 lg:w-1/2 lg:border-b-0 lg:py-0";
export const DETAILS_LABEL_CLASSES = "font-matter-bold text-sm lg:text-xs";
export const DETAILS_VALUE_CLASSES = "font-matter-regular m-0! text-sm capitalize";

// CTA Button
export const CTA_BUTTON_CLASSES =
  "font-matter-regular h-[43px] w-full cursor-pointer rounded-none border border-black px-4 py-2 text-lg text-black hover:bg-[#F7F2EA66] lg:w-auto";

// Container and spacing
export const HEADER_CONTAINER_CLASSES = "px-6 py-4 lg:hidden";
export const MAIN_GRID_CLASSES = "grid grid-cols-1 lg:grid-cols-2 lg:h-[720px]";
export const FLEX_GAP_CLASSES = "flex flex-col gap-10";
export const FLEX_FULL_BETWEEN_CLASSES = "flex h-full flex-col justify-between gap-10 lg:gap-0";
export const TABS_CONTAINER_CLASSES = "gap-6";
