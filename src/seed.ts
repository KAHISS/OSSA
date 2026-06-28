import { auth } from "@/lib/auth";

async function createInitialUser() {
  try {
    console.log("🚀 Iniciando criação do usuário via Better Auth...");

    const user = await auth.api.signUpEmail({
      body: {
        email: String(process.env.USER_EMAIL),
        password: String(process.env.USER_PASSWORD),
        name: String(process.env.USER_NAME),
        
        birth_date: new Date("1995-05-15"),
        genre: "M",
        phone: "(11) 99999-9999",
        emergency_phone: "(11) 88888-8888",
        weight: 85.5,
        type: "Admin", 
      },
    });

    console.log("✅ Usuário criado com sucesso pelo Better Auth!");
    console.log("ID do usuário:", user.user.id);

  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error);
  }
}

createInitialUser();