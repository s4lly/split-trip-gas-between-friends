import Image from "next/image";
import QRCode from "qrcode";
import { CopyToClipBoard } from "@/components/copy-to-clipboard";
import { getJoinUrl } from "@/utils/url";

const generateQR = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, { type: "image/webp", width: 340 });
  } catch (err) {
    throw new Error(`Error when generating qrcode : ${err}`);
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
    <div className="flex h-full flex-col items-center justify-center">
      <Image alt="qr code" width="340" height="340" src={dataURL} />
      <CopyToClipBoard text={shareUrl} />
    </div>
  );
};

export default SharePage;
