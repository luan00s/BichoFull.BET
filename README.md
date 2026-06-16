BichoFull — Sistema de Simulação do Jogo do Bicho

Aplicação web full stack para fins educacionais (IFAM Campus Parintins).  
Permite que usuários criem contas, gerenciem uma carteira virtual e realizem apostas simuladas baseadas na mecânica clássica do Jogo do Bicho.

---

Tecnologias

| Camada    | Tecnologia                        |
|-----------|-----------------------------------|
| Backend   | Node.js + Express                 |
| Banco     | MySQL / MariaDB                   |
| Auth      | JWT + bcrypt                      |
| API Docs  | Swagger (OpenAPI 3.0)             |
| Frontend  | React + CSS                       |
| CI/CD     | GitHub Actions                    |

---

Pré-requisitos

- Node.js 18+
- MySQL 8+ ou MariaDB 10.5+
- npm

---

Configuração do ambiente

 1. Clone o repositório

```bash
git clone https://github.com/<seu-usuario>/bichofull.git
cd bichofull
```

2. Configure as variáveis de ambiente

```bash
cp env/.env.example .env
```


```
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=jogo_bicho
```

3. Configure o banco de dados

Execute o script SQL completo para criar o banco, as tabelas e o usuário admin:

```bash
mysql -u root -p < database/schema.sql
```

Isso cria:
- Banco `jogo_bicho`
- Tabelas `usuarios`, `sorteios` e `apostas`
- Usuário admin padrão:
  - E-mail: `admin@bichofull.com`
  - Senha: `admin123`  *(troque após o primeiro login em produção)*

4. Instale as dependências do backend

```bash
npm install
```
5. Inicie o servidor

```bash
npm start
```

O servidor ficará disponível em `http://localhost:3000`.  
A documentação Swagger estará em `http://localhost:3000/api-docs`.

---

Frontend

```bash
cd jogo-frontend
npm install
npm run dev
```

Acesse em `http://localhost:5173`.

---

Como funciona o sistema

Fluxo de aposta

1. **Cadastro / Login** — o usuário cria uma conta e recebe R$ 1.000,00 de saldo fictício.
2. **Aposta** — o usuário escolhe o tipo (Grupo, Dezena ou Milhar), informa o valor e confirma. O valor é debitado imediatamente e a aposta fica com status **pendente**.
3. **Sorteio** — o administrador dispara o sorteio via `POST /sorteio/simular`. O sistema gera 5 prêmios de milhar, confere todas as apostas pendentes contra o 1º prêmio e atualiza o saldo dos vencedores.
4. **Histórico** — o usuário consulta `GET /historico` para ver apostas pendentes e processadas.

Taxas de premiação (RN2)

| Tipo    | Acerto               | Prêmio          |
|---------|----------------------|-----------------|
| Grupo   | Animal do 1º prêmio  | 18× o apostado  |
| Dezena  | Dezena do 1º prêmio  | 60× o apostado  |
| Milhar  | Milhar do 1º prêmio  | 4000× o apostado |

Regras gerais

- O saldo nunca pode ficar negativo.
- Cada aposta só é avaliada no próximo sorteio após ser realizada.
- Apenas administradores podem disparar o sorteio.

---

Rodando os testes

```bash
npm test
```

---

Endpoints principais

| Método | Rota               | Descrição                              | Auth       |
|--------|--------------------|----------------------------------------|------------|
| POST   | /register          | Cadastra novo usuário                  | —          |
| POST   | /login             | Login — retorna token JWT              | —          |
| GET    | /saldo             | Consulta saldo atual                   | JWT        |
| POST   | /saldo             | Depósito ou saque                      | JWT        |
| POST   | /aposta            | Registra aposta (pendente)             | JWT        |
| GET    | /historico         | Histórico de apostas do usuário        | JWT        |
| POST   | /sorteio/simular   | Dispara sorteio (admin)                | JWT + Admin|
| GET    | /sorteio           | Lista últimos sorteios                 | —          |
| GET    | /api-docs          | Documentação Swagger interativa        | —          |

---

Fontes — Regras de negócio

As regras de negócio foram baseadas nas seguintes fontes:

- Tabela oficial de grupos e animais do Jogo do Bicho (25 grupos × 4 dezenas consecutivas).
- Taxas praticadas na modalidade tradicional: Grupo 18×, Dezena 60×, Milhar 4000×.
- Referências indicadas pelo professor (vídeos educativos sobre a mecânica do jogo).

> **Aviso:** este sistema é uma simulação para fins acadêmicos. Não envolve dinheiro real.

---

Observação sobre a stack

O projeto foi implementado com **Node.js + Express** (backend) e **React** (frontend), em vez da stack sugerida (Spring Boot + Angular), por decisão da equipe visando maior agilidade de desenvolvimento no contexto acadêmico. A arquitetura segue os mesmos princípios (API REST, JWT, banco relacional, Swagger).
