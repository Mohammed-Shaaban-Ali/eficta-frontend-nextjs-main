import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BsFillMapFill } from 'react-icons/bs';
import { FaLocationDot, FaSquarePhone } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

type Props = {};
const links = [
  {
    label: 'Hotels',
    href: '/hotels',
  },
  {
    label: 'Flights',
    href: '/flights',
  },
  {
    label: 'International license',
    href: '/International-license',
  },
];
function Footer({}: Props) {
  return (
    <footer className="bg-[#0B6455]">
      <section className="py-10! container grid grid-cols-1! sm:grid-cols-4! gap-10!">
        <div className="col-span-1 sm:col-span-2 space-y-3!">
          <Link href="/" className="flex items-center gap-2 max-h-8!  ">
            <Image
              src="/logo.png"
              alt="logo"
              width={100}
              height={100}
              className="object-contain max-h-8! brightness-0 invert"
            />
          </Link>
          <p className="text-gr5 text-sm! sm:text-[15px]!  text-white/90! max-w-[480px]!">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry, Lorem Ipsum is simply dummy text of the printing and
            typesetting industry,Lorem Ipsum is simply dummy text of the
            printing and typesetting industry, Lorem Ipsum is simply dummy text
            of the printing and typesetting industry
          </p>
        </div>
        <div className="col-span-1 flex flex-col gap-7!">
          <div className="flex items-center gap-1.5">
            <FaLocationDot className="size-5!  text-white/90!" />
            <p className="text-white/90! text-base! sm:text-base!">
              Saudi Arabia , Riyadh
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <FaSquarePhone className="size-5!  text-white/90!" />
            <p className="text-white/90! text-base! sm:text-base!">
              +966 25 789 1566487
            </p>
          </div>{' '}
          <div className="flex items-center gap-1.5">
            <MdEmail className="size-5!  text-white/90!" />
            <p className="text-white/90! text-base! sm:text-base!">
              support@travila.com{' '}
            </p>
          </div>
        </div>
        <div className="col-span-1 items-end w-full ">
          <div className=" flex flex-col gap-7! w-fit ms-auto! sm:ms-0!">
            {links?.map((i) => (
              <Link
                href={i.href}
                key={i.label}
                className="text-white/90! text-base! font-bold!"
              >
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
