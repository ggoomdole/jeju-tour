import Image from "next/image";

import StartButton from "@/components/main/start-button";

const miniGgoomdole = "/static/onboarding/mini-ggoomdole.png";
const logo = "/static/logo.png";

export default function MainPage() {
  return (
    <main>
      <section className="flex flex-1 flex-col items-center justify-center">
        <Image
          src={miniGgoomdole}
          alt="미니 꿈돌이"
          width={100}
          height={132}
          className="translate-y-5"
        />
        <Image src={logo} alt="순례해유 로고" width={248} height={60} className="z-10" />
        <p className="typo-regular mt-2.5">나만의 순례길을 만들어봐요!!</p>
      </section>
      <StartButton />
    </main>
  );
}
