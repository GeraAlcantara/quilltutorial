import Link from 'next/link'
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight } from 'lucide-react'

import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'

const Navbar = () => {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper className="flex h-14 items-center justify-between border-b border-zinc-200">
        <Link className="flex z-40 font-semibold" href="/">
          Quill.
        </Link>
        {/* TODO: add mobile navbar */}
        <div className="hidden items-center space-x-4 sm:flex">
          <>
            <Link
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm'
              })}
              href="/pricing"
            >
              Pricing
            </Link>
            <LoginLink
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm'
              })}
            >
              Sing in
            </LoginLink>
            <RegisterLink
              className={buttonVariants({
                size: 'sm'
              })}
            >
              Get started <ArrowRight className="h-5 w-5 ml-1.5" />
            </RegisterLink>
          </>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
