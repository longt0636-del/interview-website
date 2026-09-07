import type { VideoItem } from '@/components/ui/video-testimonial';

/**
 * Single source of truth for student video testimonials.
 * Used by the hero spotlight and the testimonials section so the two never drift.
 */
export const testimonialVideos: VideoItem[] = [
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
    id: 'class-share',
    name: 'Học viên lớp IELTS',
    label: 'Các bạn đã học được gì trong 1 năm qua?',
    src: '/videos/students-share.mp4',
    thumb: '/students/thumb-students-share.jpg',
    poster: '/students/poster-students-share.jpg',
    duration: '2:20',
  },
];

/** The student featured in the hero proof stack. */
export const heroSpotlight = testimonialVideos[0];
