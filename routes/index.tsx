import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import Avatars from "../islands/Avatars.tsx";
import Header from "../islands/Header.tsx";
import MainPage from "../islands/MainPage.tsx";

export default function Home() {
  const count = useSignal(3);

  return (
    <div class="w-full">
      <Header />
      <MainPage />
      </div>
    );
}
