import { Bebas_Neue, Oswald } from "next/font/google"

const bebas = Bebas_Neue({
    subsets: ['latin'],
    weight: ['400'],
})

const oswald = Oswald({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

export const fonts: any = {
    bebas,
    oswald
}