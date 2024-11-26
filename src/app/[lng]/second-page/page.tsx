import Link from "next/link";

type PageProps = { params: Promise<{ lng: string }> };
export default async function Page({ params }: PageProps) {
    const { lng } = await params;
    return (
        <>
            <h1>Hi from second page!</h1>
            <Link href={`/${lng}`}>back</Link>
        </>
    );
}