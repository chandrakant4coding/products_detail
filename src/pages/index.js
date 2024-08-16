import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/product/1'); // Redirect to the first product
  }, []);

  return null; // Return nothing, as we are redirecting
}
