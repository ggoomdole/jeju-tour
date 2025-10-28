import { useState } from "react";

import { useCheckNicknameDuplicate } from "@/lib/tanstack/mutation/user";
import { SignUpForm } from "@/schemas/signup";
import { errorToast, successToast } from "@/utils/toast";

import { UseFormReturn } from "react-hook-form";

import FloatingButton from "../common/button/floating-button";

interface NameStepProps {
  form: UseFormReturn<SignUpForm>;
  onNext: () => void;
}

export default function NicknameStep({ form, onNext }: NameStepProps) {
  const nickname = form.watch("nickname");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  const { mutateAsync, isPending } = useCheckNicknameDuplicate();

  const isNicknameValid = nickname.length >= 1 && nickname.length <= 10;
  const nextDisabled = !isNicknameValid || !hasChecked || isDuplicate === true || isPending;

  const onNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    form.setValue("nickname", newNickname);

    // 닉네임이 변경되면 중복체크 상태 초기화
    if (hasChecked) {
      setIsDuplicate(null);
      setHasChecked(false);
    }
  };

  const onCheckDuplicate = async () => {
    if (!isNicknameValid) return;

    setIsChecking(true);
    try {
      const response = await mutateAsync(nickname);
      if (response.data) {
        successToast("사용 가능한 닉네임이에요.");
      } else {
        errorToast("이미 존재하는 닉네임이에요.");
      }
      setIsDuplicate(!response.data);
      setHasChecked(true);
    } catch (error) {
      console.error("닉네임 중복체크 실패:", error);
      setIsDuplicate(true);
      setHasChecked(true);
    } finally {
      setIsChecking(false);
    }
  };

  const onClickNext = () => {
    if (!hasChecked) {
      alert("닉네임 중복체크를 먼저 진행해주세요.");
      return;
    }

    if (isDuplicate) {
      alert("이미 존재하는 닉네임입니다. 다른 닉네임을 입력해주세요.");
      return;
    }

    onNext();
  };

  return (
    <>
      <main className="pb-with-floating-button flex flex-col gap-10 p-5">
        <h1 className="typo-bold">
          가입을 위한 정보를
          <br />
          입력해주세요
        </h1>
        <div className="focus-within:border-main-900 space-y-4 rounded-2xl border px-4 py-2.5 transition-colors">
          <label htmlFor="nickname" className="typo-regular text-gray-700">
            닉네임을 입력해 주세요
          </label>
          <div className="flex gap-2">
            <input
              id="nickname"
              value={nickname}
              onChange={onNicknameChange}
              placeholder="입력해주세요"
              className="flex-1"
              maxLength={10}
            />
            <button
              type="button"
              onClick={onCheckDuplicate}
              disabled={!isNicknameValid || isChecking}
              className="bg-main-900 typo-regular text-nowrap rounded-full px-2 py-1 text-white transition-colors disabled:bg-gray-100 disabled:text-gray-300"
              aria-label="닉네임 중복체크"
            >
              {isChecking ? "확인중..." : "중복체크"}
            </button>
          </div>
        </div>
      </main>
      <FloatingButton onClick={onClickNext} disabled={nextDisabled}>
        다음
      </FloatingButton>
    </>
  );
}
