import { notFound } from "next/navigation";

import Header from "@/components/common/header";
import ProgessBar from "@/components/signup/progess-bar";
import SignupPage from "@/page/signup";

interface SignupProps {
  searchParams: Promise<{
    step: string;
  }>;
}

export default async function Signup({ searchParams }: SignupProps) {
  const { step } = await searchParams;

  if (+step < 0 || +step > 4) {
    return notFound();
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        <Header />
        <ProgessBar step={step ?? "0"} />
      </div>
      <SignupPage step={step ?? "0"} />
    </>
  );
}
