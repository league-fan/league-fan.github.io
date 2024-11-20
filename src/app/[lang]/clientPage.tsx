'use client';

import { useContext } from 'react';
import { PropsContext } from './props';

export default function ClientPage() {
    const { patch, lang } = useContext(PropsContext);
    return (
        <div>
            <h1>Language: {lang}</h1>
            <h2>Patch: {patch}</h2>
        </div>
    );
}