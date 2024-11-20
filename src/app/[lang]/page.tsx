import Patch from '@/data/patch';
import ClientPage from './clientPage';
import { getAddedSkins } from '@/data/helpers';
import { PropsContextType } from './props';

export default async function Page({
    params,
}: {
    params: Promise<{ lang: string }>
}) {

    return <ClientPage />;
}