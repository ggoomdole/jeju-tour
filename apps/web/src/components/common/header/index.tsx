"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import ArrowLeft from "@/assets/arrow-left.svg";
import { cn } from "@/lib/utils";

const logo = "/static/logo.png";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  logoHeader?: boolean;
  rightElement?: React.ReactNode;
  sticky?: boolean;
  onClickBack?: () => void;
}

export default function Header(props: HeaderProps) {
  const { logoHeader, rightElement, onClickBack, children, className, sticky, ...restProps } =
    props;

  const router = useRouter();

  const onClickBackButton = () => {
    if (onClickBack) {
      return onClickBack();
    }
    router.back();
  };

  return (
    <header
      className={cn(
        "h-header shadow-layout z-50 flex items-center justify-between gap-2.5 bg-white px-5",
        sticky && "sticky top-0",
        className
      )}
      {...restProps}
    >
      {logoHeader ? (
        <Link href="/home">
          <Image src={logo} alt="순례해유 로고" width={100} height={24} />
        </Link>
      ) : (
        <button onClick={onClickBackButton}>
          <ArrowLeft />
        </button>
      )}
      {!logoHeader && <div className="typo-semibold flex-1 text-center">{children}</div>}
      <div className="flex min-w-6 items-center">{rightElement}</div>
    </header>
  );
}
