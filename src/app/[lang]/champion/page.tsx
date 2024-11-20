import { Layout } from "@/components"
import Index from "./Index"

export default async function Page({
    params,
}: {
    params: Promise<{ champName: string }>
}) {
    return <Layout withNew>
        <Index />
    </Layout>
}