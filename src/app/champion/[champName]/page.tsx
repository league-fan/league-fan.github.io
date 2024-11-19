export default async function Page({
    params,
}: {
    params: Promise<{ champName: string }>
}) {
    const slug = (await params).champName
    return <div>My Post: {slug}</div>
}