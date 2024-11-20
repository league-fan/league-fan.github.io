import Link from 'next/link';
export default function Page() {
  return <div><h1>Hello, Home page!</h1>
    <Link href="/default">Default</Link>
    <Link href="/zh_cn">zh_CN</Link>
    <Link href="/not_found">Not Found</Link>
  </div>;
}