import { NativeType } from "@/constants/user";
import { cn } from "@/lib/utils";
import { SignUpForm } from "@/schemas/signup";

import { UseFormReturn } from "react-hook-form";

import FloatingButton from "../common/button/floating-button";

interface NativeStepProps {
  form: UseFormReturn<SignUpForm>;
  onSubmit: () => void;
}

const NATIVE_OPTIONS = [
  {
    title: "1년 미만",
    description: "어서 와 대전은 처음이지? 숨겨진 매력을 알려드릴게요!",
    value: NativeType.SHORT_TERM,
  },
  {
    title: "1년 ~ 5년",
    description: "오, 대전 좀 아시는군요! 슬슬 대전 인싸의 향기가 풀풀~ 🚶‍♀️",
    value: NativeType.MID_TERM,
  },
  {
    title: "5년 ~ 10년",
    description: "이제 대전 토박이라 불러도 손색없겠어요! 찐 대전러 인정 👍",
    value: NativeType.LONG_TERM,
  },
  {
    title: "10년 이상",
    description: "대전의 산증인! 명예 대전 시민으로 모실게요 👑",
    value: NativeType.RESIDENT,
  },
];

export default function NativeStep({ form, onSubmit }: NativeStepProps) {
  const native = form.watch("native");

  const onSelectNative = (value: NativeType) => {
    form.setValue("native", value);
  };

  const onClickNext = () => {
    onSubmit();
  };

  return (
    <>
      <main className="pb-with-floating-button flex flex-col gap-10 p-5">
        <h1 className="typo-bold">
          대전에 거주하신지
          <br />
          얼마나 되셨나요?
        </h1>
        <div className="space-y-5">
          {NATIVE_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={cn(
                "w-full space-y-1 rounded-2xl border border-gray-100 px-4 py-2.5 text-start text-gray-700 transition-colors",
                native === option.value && "border-main-900"
              )}
              onClick={() => onSelectNative(option.value)}
            >
              <p className="typo-semibold">{option.title}</p>
              <p className="typo-regular">{option.description}</p>
            </button>
          ))}
        </div>
      </main>
      <FloatingButton onClick={onClickNext} disabled={form.formState.isSubmitting}>
        완료
      </FloatingButton>
    </>
  );
}
