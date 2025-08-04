## ⚡ SaaS Turbo Starter

A high-performance SaaS boilerplate built with:

* **Next.js** – Modern React framework for fast, SEO-optimized frontend
* **NestJS** – Scalable and maintainable backend architecture
* **PostgreSQL** – Powerful, open-source relational database
* **Prisma** – Next-gen ORM for type-safe database access
* **Tailwind CSS** – Utility-first CSS framework for rapid UI development
* **shadcn/ui** – Beautifully designed components powered by Radix and Tailwind CSS

### 🧩 Features

* Monorepo powered by **Turborepo**
* Full-stack TypeScript support
* Authentication and user management
* Pre-configured styling with Tailwind and shadcn/ui
* Scalable database schema with Prisma and PostgreSQL
* API-first backend with NestJS
* Developer-friendly setup for fast iteration

### 🚀 Perfect for

Founders, indie hackers, and teams building modern SaaS apps with speed and flexibility.


### Development

```bash
docker-compose up -d
pnpm install
pnpm dev
```

### Deployment

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```
