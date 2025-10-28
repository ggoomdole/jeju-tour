import Header from "@/components/common/header";
import FirstStep from "@/components/onboarding/first-step";
import SecondStep from "@/components/onboarding/second-step";
import ThirdStep from "@/components/onboarding/third-step";

interface OnboardingPageProps {
  step: string;
}

const renderStep = (step: string) => {
  switch (step) {
    case "1":
      return <FirstStep />;
    case "2":
      return <SecondStep />;
    case "3":
      return <ThirdStep />;
  }
};

export default function OnboardingPage({ step }: OnboardingPageProps) {
  return (
    <>
      <Header />
      <main>{renderStep(step)}</main>
    </>
  );
}
