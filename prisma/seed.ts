import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

const quotes = [
    {
        text: 'No tienes que ser perfecto para ser increíble.',
        author: null,
    },
    {
        text: 'Está bien no estar bien. Lo importante es seguir.',
        author: null,
    },
    {
        text: 'Cada día es una nueva oportunidad para empezar.',
        author: null,
    },
    {
        text: 'Tu esfuerzo de hoy es la base de tu éxito de mañana.',
        author: null,
    },
    {
        text: 'Descansa si necesitas, pero no te rindas.',
        author: null,
    },
    {
        text: 'El agotamiento no es una señal de fracaso, es una señal de que necesitas cuidarte.',
        author: null,
    },
    {
        text: 'Un paso a la vez. No tienes que resolverlo todo hoy.',
        author: null,
    },
    {
        text: 'Mereces el mismo cuidado que le das a los demás.',
        author: null,
    },
    {
        text: 'Pedir ayuda es una fortaleza, no una debilidad.',
        author: null,
    },
    {
        text: 'Los exámenes son temporales. Tu bienestar es permanente.',
        author: null,
    },
];

async function main() {
    console.log('🌱 Sembrando base de datos...');

    for (const quote of quotes) {
        await prisma.quote.upsert({
            where: { id: quote.text.slice(0, 10) }, // simple trick
            update: {},
            create: quote,
        });
    }

    // Más simple: solo insertar si no hay quotes
    const count = await prisma.quote.count();
    if (count === 0) {
        await prisma.quote.createMany({ data: quotes });
        console.log(`✅ ${quotes.length} frases del día insertadas`);
    } else {
        console.log(`ℹ️  Ya existen ${count} frases, no se sobreescribieron`);
    }

    console.log('✅ Seed completado');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
