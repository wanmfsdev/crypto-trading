import { ReactNode } from 'react'
import { BookOpenIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline'
import GithubIcon from '/public/icons/github.svg'
import DiscordIcon from '/public/icons/discord.svg'

interface Menu {
  link: string
  title: string
  isVisible?: boolean
  dataCy?: string
  shallow?: boolean
  target?: string
}

export const navigation: Menu[] = [
  {
    link: '/',
    title: 'Home'
  },
  {
    link: '/trade',
    title: 'Trade'
  },
  {
    link: '/deposit',
    title: 'Deposit'
  }
]

interface MoreMenuItem extends Menu {
  icon: ReactNode
}

const moreMenuItems: MoreMenuItem[] = [
  {
    link: '/faq',
    title: 'FAQ',
    icon: <QuestionMarkCircleIcon />
  },
  {
    link: '/docs',
    title: 'Developers',
    icon: <BookOpenIcon />
  },
  {
    link: 'https://discord.com/invite/TnmSNt5ZPP',
    title: 'Discord',
    target: '_blank',
    icon: <DiscordIcon />
  },
  {
    link: 'https://github.com/Dexpools',
    title: 'Github',
    target: '_blank',
    icon: <GithubIcon />
  }
]

export const moreMenuExtraItems: MoreMenuItem[] = []

export const moreMenus: MoreMenuItem[] = [
  ...moreMenuItems,
  ...moreMenuExtraItems
]
