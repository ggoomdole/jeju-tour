import { useState } from "react";

import { SignUpForm } from "@/schemas/signup";

import { UseFormReturn } from "react-hook-form";

import AgreementItem from "./agreement-item";
import Checkbox from "../../checkbox";
import FloatingButton from "../../common/button/floating-button";

interface AgreementStepProps {
  form: UseFormReturn<SignUpForm>;
  onNext: () => void;
}

const defaultAgreementItems = [
  {
    id: 1,
    essential: true,
    checked: false,
    title: "이용약관 동의",
    description: "이용약관 동의 description",
  },
  {
    id: 2,
    essential: true,
    checked: false,
    title: "개인정보 수집 및 이용동의",
    description: "개인정보 수집 및 이용동의 description",
  },
];

export default function AgreementStep({ form, onNext }: AgreementStepProps) {
  const [agreementItems, setAgreementItems] = useState(() => {
    const initialAgreement = form.getValues("agreement");
    return defaultAgreementItems.map((item) => ({
      ...item,
      checked: initialAgreement,
    }));
  });

  const isAllAgreementChecked = agreementItems.every((item) => item.checked);

  const onToggleAllAgreement = () => {
    setAgreementItems((prev) => prev.map((item) => ({ ...item, checked: !isAllAgreementChecked })));
  };

  const onToggleAgreement = (id: number) => {
    setAgreementItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const onClickNext = () => {
    form.setValue("agreement", isAllAgreementChecked);
    onNext();
  };

  return (
    <>
      <main className="pb-with-floating-button flex flex-col p-5">
        <section className="flex flex-col gap-10">
          <h1 className="typo-bold">환영해요!</h1>
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="all-agreement"
                checked={isAllAgreementChecked}
                onChange={onToggleAllAgreement}
              />
              <label htmlFor="all-agreement" className="typo-medium">
                약관 전체동의
              </label>
            </div>
            {agreementItems.map((item) => (
              <AgreementItem
                key={`agreement-item-${item.id}`}
                {...item}
                onChecked={() => onToggleAgreement(item.id)}
              />
            ))}
          </div>
        </section>
      </main>
      <FloatingButton onClick={onClickNext} disabled={!isAllAgreementChecked}>
        다음
      </FloatingButton>
    </>
  );
}
