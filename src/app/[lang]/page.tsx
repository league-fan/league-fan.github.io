import { useContext } from 'react';
import { PropsContext } from './props';

interface PageProps {
    params: {
        lang: string;
    };
}

export default async function Page({ params }: PageProps) {
    const { lang, patch } = useContext(PropsContext);
    return <div><h1>Language: {lang}</h1>
        <h2>Patch: {patch}</h2>
    </div>;
}