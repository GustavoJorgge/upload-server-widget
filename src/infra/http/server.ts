import { fastifyCors } from "@fastify/cors"; // Plugin para habilitar CORS
import { fastify } from "fastify"; // Framework Fastify
// import { env } from '@/env' // Importa variáveis de ambiente (se houver)
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"; // Integração do Fastify com Zod para validação

import { transformSwaggerSchema } from "@/infra/http/transform-swagger-schema";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { exportUploadsRoute } from "./routes/export-uploads";
import { getUploadsRoute } from "./routes/get-uploads";
import { uploadImageRoute } from "./routes/upload-image"; // Importa rota de upload de imagem

const server = fastify(); // Cria instância do servidor Fastify

// Configura Fastify para usar Zod como validador e serializador
server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

// Middleware de tratamento de erros
server.setErrorHandler((error, request, reply) => {
  // Se o erro for de validação com Zod
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Validation error",
      isses: error.validation, // Detalhes dos erros de validação
    });
  }

  // Aqui você pode enviar o erro para ferramentas como Sentry, Datadog etc.
  console.error(error);

  // Retorna erro genérico caso não seja de validação
  return reply.status(500).send({ message: "Internal server error." });
});

// Habilita CORS para todas as origens (útil para testes e frontends externos)
server.register(fastifyCors, { origin: "*" });

server.register(fastifyMultipart);

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Upload Server",
      description: "teste docs",
      version: "1.0.0",
    },
  },
  transform: transformSwaggerSchema,
});

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

// Registra a rota de upload de imagem no servidor
server.register(uploadImageRoute);
server.register(getUploadsRoute);
server.register(exportUploadsRoute);

// Inicia o servidor na porta 3333 e aceita conexões externas (host 0.0.0.0)
server.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running"); // Confirma que o servidor está no ar
});
