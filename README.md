# 🥋 OSSA!

O **OSSA!** é um sistema de gerenciamento e controle para academias de **Jiu-Jitsu**.

Seu principal objetivo é melhorar a administração da academia, permitindo que o proprietário tenha controle total sobre:

- Cadastro de alunos e instrutores  
- Gestão de turmas e matrículas  
- Controle financeiro (mensalidades e graduações)  
- Comunicação interna entre alunos e instrutores  

Além disso, o sistema conta com uma área de **publicações e observações**, facilitando o fluxo de informações dentro da academia.

---

## 🚀 Tecnologias Utilizadas

O projeto utiliza um stack moderno, focado em **performance**, **escalabilidade** e **produtividade**:

- **Linguagem:** TypeScript `^5+`  
- **Framework Web:** Next.js `^16.2+`  
- **Gerenciador de Pacotes:** NPM  
- **Banco de Dados:** PostgreSQL  
- **ORM:** Prisma `^7.5+`  
- **Estilização:** Tailwind CSS  
- **Linting & Formatação:** ESLint  
- **Containerização:** Docker & Docker Compose  

---

## ⚙️ Como Instalar e Executar Localmente

### 📌 Pré-requisitos

Antes de começar, você precisa ter instalado:

- Node.js  
- PostgreSQL **ou** Docker  

---

### 1. Clonar o Repositório

```bash
git clone <url-do-seu-repositorio> # baixa o repositório na sua maquina
cd ossa
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo **.env** de exemplo e ajuste os valores necessários (como credenciais do banco):

```bash
cp .env.example .env # copia o conteúdo do .env.example para o arquivo .env
```
Certifique-se de que o `DATABASE_URL` no `.env` aponta para sua instância local do Postgres.

### 3. Instalar as dependencias do node

O comando abaixo instalará todas as dependências nescessárias para o projeto:

```bash
npm install 
```

### 4. Subir o postgreSQL e PgAdmin (caso esteje usando docker) 

O comando abaixo irá subir dois container com volumes configurados para o postgreSQL e o PgAdmin:

```bash
npm run db-up
```

### 5. Rodar as migrações para o banco

O comando abaixo irá mandar as migrations para o banco:

```bash
npm run migrate
```

### 6. Gerar o prisma client

O comando abaixo irá gerar o client para manipulações no banco:

```bash
npm run generate
```

### 6. Rodar a aplicação

O comando abaixo irá subir o server da aplicação em localhost e na sua rede na porta 3000:

```bash
npm run dev
```

## 💡 Observações

- Certifique-se de que o banco de dados esteja em execução antes de rodar as migrações  
- O arquivo `.env` contém informações sensíveis e **não deve ser versionado**  
- Utilize o arquivo `.env.example` como base para configurar o ambiente local  
- Caso utilize Docker, verifique se os containers estão ativos antes de iniciar a aplicação  
- Sempre execute `npm install` após clonar o repositório para garantir que todas as dependências estejam instaladas  
- Em caso de alterações no schema do Prisma, lembre-se de rodar as migrations e gerar novamente o client  
- Recomenda-se utilizar versões compatíveis do Node.js conforme especificado no projeto  
- Para evitar conflitos, mantenha sua branch atualizada antes de abrir um Pull Request  