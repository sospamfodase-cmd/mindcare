import { Calendar, Heart, Instagram, MessageCircle, Clock, Video } from 'lucide-react';
import { LinkItem } from './types';

export const DOCTOR_NAME = "Dra. Bianca Amaral Fernandes";
export const CLINIC_NAME = "Espaço Mindcare";
export const CRM = "CRM SP 247.077 | PR 53.736";
export const RQE = ""; // Limpar placeholder se não houver RQE específico no momento

export const SOCIAL_URLS = {
  whatsapp: "https://api.whatsapp.com/send/?phone=5518997527188&text&type=phone_number&app_absent=0",
  availableHours: "https://agendarconsulta.com/perfil/dra-bianca-amaral-fernandes-1698190773",
  tiktok: "https://www.tiktok.com/@espacomindcare",
  socialValue: "https://agendamento.medprev.online/professionals/4586a530-9c14-4978-865f-0187ec0dc794",
  instagramMindcare: "https://www.instagram.com/espacomindcare/",
  instagramPersonal: "https://www.instagram.com/drabiafernandes/"
};

export const QUICK_LINKS: LinkItem[] = [
  {
    id: 'whatsapp',
    title: 'Agendar Consulta',
    subtitle: 'Atendimento via WhatsApp',
    url: SOCIAL_URLS.whatsapp,
    icon: MessageCircle,
    primary: true
  },
  {
    id: 'hours',
    title: 'Horários Disponíveis',
    subtitle: 'Verifique a agenda online',
    url: SOCIAL_URLS.availableHours,
    icon: Clock
  },
  {
    id: 'social-value',
    title: 'Atendimento Social',
    subtitle: 'Agendamento via MedPrev',
    url: SOCIAL_URLS.socialValue,
    icon: Heart
  },
  {
    id: 'ig-mindcare',
    title: 'Espaço Mindcare',
    subtitle: 'Instagram da Clínica',
    url: SOCIAL_URLS.instagramMindcare,
    icon: Instagram
  },
  {
    id: 'ig-personal',
    title: 'Instagram Pessoal',
    subtitle: 'Acompanhe meu dia a dia',
    url: SOCIAL_URLS.instagramPersonal,
    icon: Instagram
  },
  {
    id: 'tiktok',
    title: 'TikTok',
    subtitle: 'Conteúdos educativos em vídeo',
    url: SOCIAL_URLS.tiktok,
    icon: Video
  }
];

export const PLACEHOLDER_AVATAR = "https://picsum.photos/400/400";