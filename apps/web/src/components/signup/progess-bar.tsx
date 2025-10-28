interface ProgessBarProps {
  step: string;
}

export default function ProgessBar({ step }: ProgessBarProps) {
  const progress = +step * 25;

  return (
    <div className="bg-main-100 h-1 w-full">
      <div
        className="bg-main-500 h-1 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
