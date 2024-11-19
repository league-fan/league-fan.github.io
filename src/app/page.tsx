'use client'
import { useRouter } from 'next/navigation'
export default function Page() {
  const router = useRouter()
  return <div><h1>Hello, Home page!</h1>
    <button type="button" onClick={() => router.push('/champion/hi')}>
      Dashboard
    </button>
  </div>;
}