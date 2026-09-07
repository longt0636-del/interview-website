import type { VideoItem } from '@/components/ui/video-testimonial';

/**
 * Single source of truth for student video testimonials.
 * Used by the hero deck and the testimonials grid so the two never drift.
 *
 * Order matters: the first entry is the slide a visitor lands on. Ngọc Lan leads
 * because hers is the established story students already recognise — the newer
 * spotlights sit behind her in the deck rather than displacing her.
 */
export const testimonialVideos: VideoItem[] = [
  {
    id: 'ngoc-lan',
    name: 'Trương Ngọc Lan',
    shortName: 'Ngọc Lan',
    band: 'IELTS 7.5',
    label: 'Từ mất gốc Reading đến band 7.5 sau một lộ trình.',
    src: '/videos/lan-ielts-75.mp4',
    thumb: '/students/thumb-lan.jpg',
    poster: '/students/poster-lan.jpg',
    duration: '4:46',
  },
  {
    id: 'minh-thu',
    name: 'Đặng Nguyễn Minh Thư',
    shortName: 'Minh Thư',
    band: 'IELTS 7.5',
    label: 'Vừa đi làm vừa học — và vẫn cán mốc 7.5.',
    src: '/videos/minh-thu-ielts-75.mp4',
    thumb: '/students/thumb-minh-thu.jpg',
    poster: '/students/poster-minh-thu.jpg',
    duration: '2:19',
  },
  {
    id: 'class-share',
    name: 'Học viên lớp IELTS',
    label: 'Các bạn đã học được gì trong 1 năm qua?',
    // Nhóm không có band nên hai dòng chữ mặc định ("Học viên vừa đạt band" /
    // "Nghe ... kể lại") đọc sai — ghi đè bằng chữ hợp với video cả lớp.
    heroEyebrow: 'Cảm nhận cả lớp',
    heroLine: 'Cả lớp kể chuyện 1 năm qua',
    src: '/videos/students-share.mp4',
    thumb: '/students/thumb-students-share.jpg',
    poster: '/students/poster-students-share.jpg',
    duration: '2:20',
  },
];

/**
 * Slides shown in the hero, in order. Same objects as the grid — the hero shows
 * every testimonial rather than a hand-picked subset, so adding a student to the
 * list above is all it takes to put them in the deck.
 */
export const heroDeck = testimonialVideos;
