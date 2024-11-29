import { allowedLng } from "@/data/constants";
import { Common } from "@/layouts/common";
import Link from "next/link";

export type NotFoundProps = {
  lng: allowedLng;
  title: string;
  description?: string;
  back?: string;
};

export default function NotFound({
  lng,
  title,
  description,
  back,
}: NotFoundProps) {
  return (
    <Common lng={lng}>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {back && <Link href={back}>Go to Last Page</Link>}
    </Common>
  );
}
