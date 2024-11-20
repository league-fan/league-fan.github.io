'use client';
import { Header } from "./header";
import { Footer, FooterContainer } from "./footer";

interface LayoutProps {
  children: ReactNode;
  flat?: boolean;
  backTo?: string;
  withNew?: boolean;
}

import { ReactNode } from "react";
import NewAdditions from "./new-additions";

export default function Entry({ children, flat = false, backTo, withNew = false }: LayoutProps) {
  return (
    <FooterContainer>
      <div>
        <Header {...{ flat, backTo }} />
        {withNew && <NewAdditions />}
        {children}
      </div>
      <Footer {...{ flat }} />
    </FooterContainer>
  );
}