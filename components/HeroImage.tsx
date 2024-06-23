
interface HeroImageProps {
    src: string;
    alt: string;
    herf: string | undefined;
}

export default function HeroImage(props: HeroImageProps) {
    return (
        <a
            class="relative mx-auto block w-48 overflow-hidden rounded-lg bg-slate-200 shadow-xl shadow-slate-200 sm:w-64 sm:rounded-xl lg:w-auto lg:rounded-2xl"
            aria-label={props.alt}
            href={props.herf || "#"}
        >
            <img
                alt=""
                width="960"
                height="960"
                decoding="async"
                data-nimg="1"
                class="w-full"
                style="color:transparent"
                sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
                src={props.src}
            />
            <div class="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 sm:rounded-xl lg:rounded-2xl">
            </div>
        </a>
    );
}
