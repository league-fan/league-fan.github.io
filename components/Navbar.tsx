export type NavProps = {
    title: string;
    url: string;
};

interface NavbarProps {
    links: NavProps[];
}

export function Navbar(props: NavbarProps) {
    const links = props.links;

    return (
        <div class="hidden lg:sticky lg:top-0 lg:flex lg:w-16 lg:flex-none lg:items-center lg:whitespace-nowrap lg:py-12 lg:text-sm lg:leading-7 lg:[writing-mode:vertical-rl]">
            <span class="flex gap-6 font-bold text-slate-900">
                {links.map((item, index) => (
                    <>
                        {item.title}
                        {index < links.length - 1 && (
                            <span aria-hidden="true" class="text-slate-400">
                                /
                            </span>
                        )}
                    </>
                ))}
            </span>
            <span class="mt-6 font-mono text-slate-500 align-bottom">
                Hosted by Magicwenli
            </span>
        </div>
    );
}
