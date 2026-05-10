import { Injectable } from '@nestjs/common';
import { MoodLevel } from '@prisma/client';

// ── Tipos ────────────────────────────────────────────────────────────────────
export interface Recommendation {
  type: 'respiracion' | 'descanso' | 'tecnica' | 'contenido' | 'general';
  title: string;
  description: string;
  duration?: string;
  link?: string;
}

export interface RecommendationResponse {
  moodLevel: MoodLevel;
  moodLabel: string;
  message: string;
  recommendations: Recommendation[];
}

// ── Mapa de etiquetas legibles ───────────────────────────────────────────────
export const MOOD_LABELS: Record<MoodLevel, string> = {
  ATOPE: '¡A tope! 🚀',
  BIEN: 'Bien 😊',
  REGULAR: 'Regular 😐',
  MAL: 'Mal 😞',
  BURNOUT: 'Burnout total 🔥',
};

// ── Recomendaciones por nivel de ánimo ───────────────────────────────────────
export const RECOMMENDATIONS: Record<MoodLevel, RecommendationResponse> = {
  ATOPE: {
    moodLevel: MoodLevel.ATOPE,
    moodLabel: MOOD_LABELS.ATOPE,
    message: '¡Qué buena energía! Aprovéchala bien. Aquí algunas ideas para mantenerla.',
    recommendations: [
      {
        type: 'tecnica',
        title: 'Técnica Pomodoro',
        description:
          'Estás en tu mejor momento. Trabaja en bloques de 25 minutos con descansos de 5. Maximiza tu productividad.',
        duration: '25 min de trabajo + 5 de descanso',
      },
      {
        type: 'contenido',
        title: 'Tips para mantener la energía',
        description: 'Cómo mantener el estado de flujo y la motivación a lo largo del día.',
        link: 'https://www.youtube.com/results?search_query=flow+state+study+productivity',
      },
      {
        type: 'general',
        title: 'Comparte tu buena vibra',
        description:
          'Visita el Muro de Apoyo de la comunidad y deja un mensaje de aliento para alguien que lo necesite.',
      },
    ],
  },

  BIEN: {
    moodLevel: MoodLevel.BIEN,
    moodLabel: MOOD_LABELS.BIEN,
    message: 'Estás bien, y eso ya es mucho. Sigue así.',
    recommendations: [
      {
        type: 'tecnica',
        title: 'Técnica de los 5 minutos',
        description:
          'Empieza esa tarea pendiente comprometiéndote solo 5 minutos. Casi siempre terminarás haciendo más.',
        duration: '5 minutos para empezar',
      },
      {
        type: 'contenido',
        title: 'Gestión del tiempo para estudiantes',
        description: 'Video corto con técnicas prácticas de organización académica.',
        link: 'https://www.youtube.com/results?search_query=gestión+del+tiempo+estudiantes',
      },
      {
        type: 'general',
        title: 'Escribe en tu Bitácora',
        description: 'Escribe 3 cosas positivas que pasaron hoy. Entrena tu mente hacia el agradecimiento.',
      },
    ],
  },

  REGULAR: {
    moodLevel: MoodLevel.REGULAR,
    moodLabel: MOOD_LABELS.REGULAR,
    message: 'Los días regulares también cuentan. Aquí tienes algunas herramientas.',
    recommendations: [
      {
        type: 'respiracion',
        title: 'Respiración 4-7-8',
        description:
          'Inhala 4 segundos, retén 7, exhala 8. Repite 4 veces. Activa tu sistema nervioso parasimpático y reduce la tensión.',
        duration: '1-2 minutos',
      },
      {
        type: 'tecnica',
        title: 'Técnica de los 5 minutos',
        description:
          'Si te sientes bloqueado/a, comprométete solo 5 minutos con una tarea. Solo 5. Luego decides si continúas.',
        duration: '5 minutos',
      },
      {
        type: 'contenido',
        title: 'Manejo del estrés académico',
        description: 'Artículo breve con estrategias probadas para días difíciles.',
        link: 'https://www.youtube.com/results?search_query=manejo+estrés+académico+universitario',
      },
    ],
  },

  MAL: {
    moodLevel: MoodLevel.MAL,
    moodLabel: MOOD_LABELS.MAL,
    message: 'Está bien no estar bien. Aquí hay cosas que pueden ayudarte ahora mismo.',
    recommendations: [
      {
        type: 'respiracion',
        title: 'Respiración de caja (Box Breathing)',
        description:
          'Inhala 4 seg → Retén 4 seg → Exhala 4 seg → Retén 4 seg. Repite 5 veces. Usada por equipos de alto rendimiento para calmarse.',
        duration: '2 minutos',
      },
      {
        type: 'descanso',
        title: 'Siesta reparadora de 20 minutos',
        description:
          'Una siesta de 20 min (no más) mejora el estado de ánimo y la cognición. Pon una alarma y descansa sin culpa.',
        duration: '20 minutos',
      },
      {
        type: 'contenido',
        title: 'Música para relajarse',
        description: 'Música ambiental y lo-fi para calmar el sistema nervioso y reducir la ansiedad.',
        link: 'https://www.youtube.com/results?search_query=lofi+hip+hop+relax+study',
      },
      {
        type: 'general',
        title: 'Habla con alguien',
        description:
          'La comunidad de AStress está aquí. Publica de forma anónima en el Muro de Apoyo.',
      },
    ],
  },

  BURNOUT: {
    moodLevel: MoodLevel.BURNOUT,
    moodLabel: MOOD_LABELS.BURNOUT,
    message:
      'El burnout es real y merece atención. Lo más valiente que puedes hacer ahora es parar y cuidarte.',
    recommendations: [
      {
        type: 'respiracion',
        title: 'Respiración diafragmática guiada',
        description:
          'Pon una mano en el pecho y otra en el vientre. Respira lento, que solo suba la mano del vientre. Inhala 4 seg, exhala 6. Repite 10 veces.',
        duration: '3-5 minutos',
      },
      {
        type: 'descanso',
        title: 'Para. Ahora.',
        description:
          'Cierra tus materiales. Pon música suave, sal a caminar 10 minutos o toma agua. Tu cerebro no puede procesar más si está en modo supervivencia.',
        duration: '10-30 minutos',
      },
      {
        type: 'descanso',
        title: 'Música ambiental relajante',
        description: 'Sonidos de naturaleza y música ambient para bajar la activación del sistema nervioso.',
        link: 'https://www.youtube.com/results?search_query=música+relajante+naturaleza+ansiedad',
      },
      {
        type: 'general',
        title: '¿Necesitas hablar con alguien?',
        description:
          'Si sientes que no puedes más, considera contactar al servicio psicológico de tu universidad. No tienes que atravesar esto solo/a.',
      },
      {
        type: 'contenido',
        title: 'Qué es el burnout estudiantil y cómo salir',
        description: 'Video con señales de alarma y pasos concretos para recuperarte.',
        link: 'https://www.youtube.com/results?search_query=burnout+estudiante+universitario+recuperación',
      },
    ],
  },
};

@Injectable()
export class RecommendationsService {
  // ── Recomendaciones por nivel de ánimo ─────────────────────────
  getByMoodLevel(level: MoodLevel): RecommendationResponse {
    return RECOMMENDATIONS[level];
  }

  // ── Todos los niveles disponibles ───────────────────────────────
  getAllLevels() {
    return Object.entries(MOOD_LABELS).map(([level, label]) => ({
      level,
      label,
    }));
  }
}
