import { Header } from "@/components/header";
import { Footer, FooterContainer } from "@/components/footer";
import { ReactNode } from "react";
import { allowedLng } from "@/data/constants";

interface LayoutProps {
  children: ReactNode;
  lng: allowedLng;
  flat?: boolean;
  backTo?: string;
  patch?: string;
  newAddidions?: ReactNode;
}
export function Common({
  children,
  lng,
  backTo,
  flat,
  patch,
  newAddidions,
}: LayoutProps) {
  return (
    <FooterContainer>
      <div>
        <Header lng={lng} flat={flat} backTo={backTo} />
        {newAddidions}
        {children}
      </div>
      <Footer patch={patch} flat={flat} />
    </FooterContainer>
  );
}
