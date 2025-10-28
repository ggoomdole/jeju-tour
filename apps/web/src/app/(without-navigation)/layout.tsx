export default function WithoutNavigationLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-without-navigation flex flex-col">{children}</div>;
}
