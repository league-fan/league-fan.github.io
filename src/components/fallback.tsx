import { useRouter } from "next/navigation";
import { Footer, FooterContainer } from "./footer";
import { Header } from "./header";
import { Loading } from "./loading";
import { ReactNode } from "react";

export function Fallback({ children }:{ children: ReactNode }) {
  const router = useRouter();
    return (
        <FooterContainer>
          <Header />
          <Loading />
          <Footer />
        </FooterContainer>
    );
}
