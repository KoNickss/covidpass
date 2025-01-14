import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import React, {useEffect, useState} from "react";
import QRCode from "react-qr-code";

import Card from '../components/Card';
import Logo from "../components/Logo";

function Pass(): JSX.Element {
    const [fragment, setFragment] = useState<string>(undefined);

    function closeViewer() {
        setFragment(undefined);
        window.location.replace('/');
    }

    useEffect(() => {
        const rawFragment = window.location.hash.substring(1);
        const decodedFragment = Buffer.from(rawFragment, 'base64').toString();
        setFragment(decodedFragment);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                closeViewer();
            }
        });

        window.addEventListener('blur', closeViewer);
        window.addEventListener('beforeunload', closeViewer);
        window.addEventListener('pagehide', closeViewer);
    }, []);

    return (
        <div className="py-6 flex flex-col space-y-5 items-center">
            <Logo/>
            <div className="flex flex-row items-center">
                {
                    fragment && 
                    <Card content={
                        <div className="p-2 bg-white rounded-md">
                        <QRCode value={fragment} size={280} level="L" />
                        </div>
                    } />
                }
            </div>
        </div>
    )
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

export default Pass;
