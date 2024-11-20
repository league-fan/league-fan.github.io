import ClientPage from './clientPage';

export default async function Page({
    params,
}: {
    params: Promise<{ lang: string }>
}) {

    return <ClientPage />;
}