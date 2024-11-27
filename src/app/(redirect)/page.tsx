import { fallbackLng } from "@/data/constants";
import { redirect } from "next/navigation";

export default async function Page() {
    redirect(`/${fallbackLng}/champions`);
}