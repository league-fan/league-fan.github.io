import { useTranslation } from "@/i18n";
import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ lng: string }> };
export default async function Page({ params }: PageProps) {
    const { lng } = await params;
    const { t } = await useTranslation(lng, "ui");
    redirect(`/${lng}/champions`);
}