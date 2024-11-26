import { languages } from "@/data/constants";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
    return languages.map((lng) => ({ lng }));
}

type PageProps = { params: Promise<{ lng: string }> };
export default async function Page({ params }: PageProps) {
    const { lng } = await params;
    redirect(`/${lng}/champions`);
}