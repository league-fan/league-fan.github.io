'use client';

import { useContext } from 'react';
import { PropsContext } from './props';

export default function ClientPage() {
    const { patch, lang, addedSkins } = useContext(PropsContext);
    return (
        <div>
            <h1>Language: {lang}</h1>
            <h2>Patch: {patch}</h2>
            <h3>Champion: {JSON.stringify(addedSkins[0], null, 2)}</h3>
        </div>
    );
}