'use client';
import { Header } from "./header";
import { Footer, FooterContainer } from "./footer";
import dynamic from "next/dynamic";

const LazyNewAdditions = dynamic(() => import("./new-additions"), {
  ssr: false,
});

interface LayoutProps {
  children?: ReactNode;
  flat?: boolean;
  backTo?: string;
  withNew?: boolean;
}

import { ReactNode } from "react";

export function Layout({ children, flat, backTo, withNew }: LayoutProps) {
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
