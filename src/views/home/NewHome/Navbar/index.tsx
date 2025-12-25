'use client';
import '@/styles/header.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GrLanguage } from 'react-icons/gr';
import { IoIosArrowDown } from 'react-icons/io';

const links = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
];
const Navbar = () => {
  const pathname = usePathname();
  function normalizePathname(pathname: string): string {
    const parts = pathname.split('/').filter(Boolean);

    if (parts.length > 0 && ['en', 'ar'].includes(parts[0] as 'en' | 'ar')) {
      return '/' + parts.slice(1).join('/');
    }

    return pathname.startsWith('/') ? pathname : '/' + pathname;
  }
  const pathNameWithoutLocale = normalizePathname(pathname);

  return (
    <header
      className={`absolute top-2 left-0 right-0 w-full z-10 px-4! py-8!
         mx-auto container bg-white/25 backdrop-blur-sm rounded-[40px] h-16! flex items-center justify-between gap-2`}
    >
      <Link href="/" className="flex items-center gap-2 max-h-8!  ">
        <Image
          src="/logo.png"
          alt="logo"
          width={100}
          height={100}
          className="object-contain max-h-8! "
        />
      </Link>
      <div className="flex items-center gap-4">
        {links.map((link) => {
          const isActive = pathNameWithoutLocale === link.href;
          return (
            <Link
              href={link.href}
              key={link.label}
              className={`text-[18px]!
                hover:text-black! transition-all duration-300!
                font-bold! ${isActive ? 'text-black!' : 'text-black/40!'}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-1.5 bg-white/60 rounded-[40px] p-2! px-3! h-10!">
        <GrLanguage />
        <span>en</span>
        <IoIosArrowDown />
      </div>
    </header>
  );
};

export default Navbar;
