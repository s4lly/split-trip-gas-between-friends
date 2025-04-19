import QRCode from "qrcode";
import { CopyToClipBoard } from "@/components/copy-to-clipboard";
import TripsBreadCrumb from "@/components/TripsBreadCrumb";
import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getJoinUrl } from "@/utils/url";

const generateQR = async (text: string) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error(err);
  }
};

export const SharePage = async ({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) => {
  const { tripId } = await params;

  const shareUrl = getJoinUrl(tripId);
  const dataURL = await generateQR(shareUrl);

  return (
    <>
      <TripsBreadCrumb tripId={tripId}>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Share</BreadcrumbPage>
        </BreadcrumbItem>
      </TripsBreadCrumb>

      <div className="flex h-full flex-col items-center justify-center">
        <img src={dataURL} />
        <CopyToClipBoard text={shareUrl} />
      </div>
    </>
  );
};

export default SharePage;
