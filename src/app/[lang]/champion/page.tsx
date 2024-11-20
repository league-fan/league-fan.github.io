import { Layout } from "@/components"
import IndexLayout from "./IndexLayout"

export default async function Page({
    params,
}: {
    params: Promise<{ champName: string }>
}) {
    return <IndexLayout />
}