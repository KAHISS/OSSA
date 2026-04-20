import { Bebas_Neue, Oswald, Anton} from "next/font/google"

const bebas = Bebas_Neue({
    subsets: ['latin'],
    weight: ['400'],
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
})

const oswald = Oswald({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

export const fonts: any = {
    bebas,
    oswald,
    anton
}