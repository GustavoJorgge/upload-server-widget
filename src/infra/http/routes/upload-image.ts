import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { uploads } from './../../db/schemas/uploads';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';

// Define a rota de upload de imagem com validação via Zod
export const UploadImageRoute: FastifyPluginAsyncZod = async (server) => {
    server.post(
        '/uploads',
        {
            schema: {
                summary: 'Upload an Image', // Descrição que aparece na documentação (ex: Swagger)
                
                // Define a estrutura esperada do corpo da requisição
                body: z.object({
                    name: z.string(), // Campo obrigatório
                    password: z.string().optional(), // Campo opcional
                }),

                // Define os formatos esperados nas respostas
                response: {
                    201: z.object({
                        uploadId: z.string() // Quando o upload for criado com sucesso
                    }),

                    409: z.object({
                        message: z.string()})
                    .describe('Upload already exist.') // Aparece como descrição na doc
                },
            },
        },
        
        // Função que lida com a requisição
        async (request, reply) => {

            await db.insert(schema.uploads).values({
                name: 'teste.jpg',
                remoteKey: 'testes.jpg',
                remoteUrl: 'http://asdasd.com'
            })
            return reply.status(201).send({ uploadId: 'teste' }) // Retorna um ID de teste
        }
    )
}
