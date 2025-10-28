import RedirectPage from "@/page/redirect";

interface RedirectProps {
  searchParams: Promise<{
    code: string;
  }>;
}

export default async function Redirect({ searchParams }: RedirectProps) {
  const { code } = await searchParams;

  return <RedirectPage code={code} />;
}
