export default function Headline(props: { title: string }) {
  return (
    <div class="lg:px-8">
      <div class="lg:max-w-4xl">
        <div class="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
          <h1 class="text-2xl font-bold leading-7 text-slate-900">
            {props.title}
          </h1>
        </div>
      </div>
    </div>
  );
}
