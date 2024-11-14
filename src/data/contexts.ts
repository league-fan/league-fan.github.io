import { SkinWithKey } from "@/components/new-additions/helpers";
import { Champion, Skins } from "@/types";
import React from "react";

interface PropsContextType {
    skins: Skins;
    champions: Champion[];
    added: SkinWithKey[];
    patch: string;
}

export const PropsContext = React.createContext<PropsContextType | undefined>(undefined);
PropsContext.displayName = "PropsContext";

export const PropsProvider = PropsContext.Provider;
export const useProps = () => {
    const context = React.useContext(PropsContext);
    if (!context) {
        throw new Error("useProps must be used within a PropsProvider");
    }
    return context;
};
