import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Ejecutando seed...');

  const rooms = [
    {
      name: 'Sobreviviendo a la Tesis',
      description: 'Para quienes están en el proceso de titulación y necesitan apoyo.',
    },
    {
      name: 'Ansiedad de Exámenes',
      description: 'Comparte estrategias y recibe aliento antes de cada parcial o final.',
    },
    {
      name: 'Primeros Semestres',
      description: 'El inicio de la carrera puede ser abrumador. Aquí no estás solo.',
    },
    {
      name: 'Descanso y Autocuidado',
      description: 'Hablemos de dormir bien, alimentarnos y hacer pausas.',
    },
    {
      name: 'Muro de Apoyo General',
      description: 'Publica lo que sientes. La comunidad está aquí para escucharte.',
    },
  ];

  for (const room of rooms) {
    await prisma.communityRoom.upsert({
      where: { name: room.name },
      update: {},
      create: room,
    });
  }

  const phrases = [
    { text: 'No tienes que tenerlo todo resuelto hoy. Un paso a la vez.', author: 'Anónimo' },
    { text: 'Pedir ayuda no es debilidad, es inteligencia emocional.', author: 'Anónimo' },
    { text: 'El descanso no es rendirse, es recargarse.', author: 'Anónimo' },
    { text: 'Eres más que tus calificaciones.', author: 'Anónimo' },
    { text: 'Los días difíciles también pasan.', author: 'Anónimo' },
    { text: 'Está bien no estar bien. Pero no tienes que estarlo solo/a.', author: 'AStress' },
    { text: 'Tu salud mental importa más que cualquier entrega.', author: 'Anónimo' },
    {
      text: 'El éxito no es lineal. Los tropiezos forman parte del camino.',
      author: 'Anónimo',
    },
  ];

  for (const phrase of phrases) {
    await prisma.dailyPhrase.create({ data: phrase });
  }

  console.log('✅ Seed completado.');
  console.log(`   • ${rooms.length} salas de comunidad creadas`);
  console.log(`   • ${phrases.length} frases del día creadas`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
