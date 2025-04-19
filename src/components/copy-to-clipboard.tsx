"use client";

import { Clipboard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { writeClipboardText } from "@/utils/shared";

export const CopyToClipBoard = ({ text }: { text: string }) => {
  const handleClick = async () => {
    const success = await writeClipboardText(text);

    if (success) {
      toast.success("copied to clipboard");
    }
  };
  return (
    <div className="flex w-full gap-2">
      <Input className="grow" type="text" disabled readOnly value={text} />
      <Button variant="outline" size="icon" onClick={handleClick}>
        <Clipboard />
      </Button>
    </div>
  );
};
