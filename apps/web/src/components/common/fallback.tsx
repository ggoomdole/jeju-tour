import { Loader2 } from "lucide-react";

interface FallbackProps {
  text: string;
}

export default function Fallback({ text }: FallbackProps) {
  return (
    <main className="flex flex-col items-center justify-center">
      <Loader2 className="size-8 animate-spin text-gray-500" />
      <p className="typo-medium mt-4 text-gray-500">{text}</p>
    </main>
  );
}
