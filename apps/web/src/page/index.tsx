import Image from "next/image";

import StartButton from "@/components/main/start-button";

const miniGgoomdole = "/static/onboarding/harbang.webp";
const logo = "/static/logo.webp";

export default function MainPage() {
  return (
    <main>
      <section className="flex flex-1 flex-col items-center justify-center">
        <Image
          src={miniGgoomdole}
          alt="미니 할방이"
          width={100}
          height={132}
          className="translate-y-5"
        />
        <Image src={logo} alt="순례합서 로고" width={246} height={60} className="z-10" />
        <p className="typo-regular mt-2.5">나만의 순례길을 만들어봐요!!</p>
      </section>
      <StartButton />
    </main>
  );
}
