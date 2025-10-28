import OnboardingPage from "@/page/onboarding";

interface OnboardingPageProps {
  searchParams: Promise<{
    step: string;
  }>;
}

export default async function Onboarding({ searchParams }: OnboardingPageProps) {
  const { step } = await searchParams;

  return <OnboardingPage step={step ?? "1"} />;
}
