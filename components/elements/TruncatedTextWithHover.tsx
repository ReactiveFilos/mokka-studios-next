import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TruncatedTextWithHoverProps {
  text: string;
  maxLength?: number;
}

export function TruncatedTextWithHover({ text, maxLength = 60 }: TruncatedTextWithHoverProps) {
  if (!text) {
    return null;
  }

  const isTruncated = text.length > maxLength;
  const truncatedText = isTruncated ? `${text.substring(0, maxLength)}...` : text;

  if (!isTruncated) {
    return <span>{text}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline-offset-4 hover:underline cursor-default">{truncatedText}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm max-w-sm break-words">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}