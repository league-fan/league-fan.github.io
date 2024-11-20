import ClientPage from './clientPage';

export default async function Page({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const lang = (await params).lang;
    console.log('params', lang);
    return <ClientPage />;
}