import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Changelog for the project",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
