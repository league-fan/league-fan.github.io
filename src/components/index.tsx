import { Header } from "./header";
import { Footer, FooterContainer } from "./footer";
import dynamic from "next/dynamic";

const LazyNewAdditions = dynamic(() => import("./new-additions"), {
  ssr: false,
});

import { ReactNode } from "react";

export function Layout({ children, flat, backTo, withNew }: { children: ReactNode, flat: boolean, backTo: string, withNew: boolean }) {
  return (
    <FooterContainer>
      <div>
        <Header {...{ flat, backTo }} />
        {withNew && <LazyNewAdditions />}
        {children}
      </div>
      <Footer {...{ flat }} />
    </FooterContainer>
  );
}
