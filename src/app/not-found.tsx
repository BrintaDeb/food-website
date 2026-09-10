import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#FFFDF9]">
      <span className="text-6xl mb-4">🍛</span>
      <h1 className="text-4xl sm:text-5xl font-outfit font-black text-[#1A1311] mb-2">
        Page Not Found
      </h1>
      <p className="text-neutral-500 max-w-md mb-8 text-sm">
        Oops! The culinary page you are looking for seems to have been savored or does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-2xl bg-[#FF5E00] hover:bg-[#e05200] text-white font-bold text-sm shadow-float transition-all"
      >
        Back to Storefront
      </Link>
    </div>
  );
}
