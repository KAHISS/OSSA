import { betterAuth } from "better-auth";
import { prisma } from "./prisma"
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            birth_date: {
                type: "date",
                required: true,
            },
            genre: {
                type: "string",
                required: true,

            },
            phone: {
                type: "string",
                required: true,
            },
            emergency_phone: {
                type: "string",
                required: true,

            },
            weight: {
                type: "number",
                required: true,
            },
            type: {
                type: "string",
                required: true,
            },

        }
    }
});