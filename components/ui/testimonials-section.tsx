'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GridPattern } from '@/components/ui/grid-pattern';
import { cn } from '@/lib/utils';

const quotes = [
  {
    text: 'Thầy dạy hay và vui lắm ạ. Em học với thầy mà không thấy chán lần nào.',
    author: 'Học viên LongIELTS',
    result: null,
  },
  {
    text: 'Từ hồi học với thầy Long, em mới hiểu Reading không phải đọc hết bài — thầy dạy cách scan và skim đúng cách, tiết kiệm được rất nhiều thời gian.',
    author: 'Trương Ngọc Lan',
    result: 'IELTS 7.5',
  },
  {
    text: 'Tìm được một người thầy "hợp gu" để giúp mình kết bạn lại với môn học này là điều quý giá nhất. Thầy không chỉ dạy kiến thức — mỗi buổi học đều có mục tiêu rõ ràng, mình luôn biết mình đạt được điều gì, không còn cảm giác bơi trong kiến thức.',
    author: 'Thùy Trang',
    result: null,
  },
  {
    text: 'Lớp nhỏ nên thầy để ý từng bạn. Em hay bị lỗi Tense và thầy nhắc riêng em mỗi buổi cho đến khi hết lỗi hẳn.',
    author: 'Học viên lớp Band 5–6+',
    result: null,
  },
];

const squarePhotos = [
  { src: '/students/class-photo-1.jpg', alt: 'Học viên lớp IELTS LongIELTS' },
  { src: '/students/class-photo-2.jpg', alt: 'Học viên lớp IELTS LongIELTS' },
  { src: '/students/class-photo-3.jpg', alt: 'Cả lớp chụp ảnh kỷ niệm cùng thầy Long' },
  { src: '/students/class-photo-4.jpg', alt: 'Học viên LongIELTS' },
  { src: '/students/class-photo-5.jpg', alt: 'Học viên LongIELTS' },
  { src: '/students/class-photo-6.jpg', alt: 'Học viên LongIELTS' },
];

const videos = [
  {
    label: 'Trương Ngọc Lan – IELTS 7.5',
    src: '/videos/lan-ielts-75.mp4',
    poster: '/students/poster-lan.jpg',
  },
  {
    label: 'Học sinh chia sẻ những gì mình đã học được trong 1 năm',
    src: '/videos/students-share.mp4',
    poster: '/students/poster-students-share.jpg',
  },
];

// ─── Video player card ─────────────────────────────────────────────────────

function VideoCard({ label, src, poster }: typeof videos[0]) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 4px 20px rgba(11,61,92,0.18)' }}
    >
      {/* 9:16 portrait container — video fills it, fullscreen works naturally on all devices */}
      <div className="relative w-full" style={{ aspectRatio: '9/16' }}>
        <video
          controls
          poster={poster}
          preload="metadata"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'contain', background: '#0B3D5C' }}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <div
        className="px-4 py-3"
        style={{ background: 'var(--navy)' }}
      >
        <p className="font-sans text-sm font-semibold text-white leading-snug">{label}</p>
      </div>
    </div>
  );
}

// ─── Quote card ────────────────────────────────────────────────────────────

function QuoteCard({ text, author, result }: typeof quotes[0]) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--off-white)',
        border: '1px solid var(--mint)',
        boxShadow: '0 2px 12px rgba(11,61,92,0.06)',
      }}
    >
      <div className="font-serif text-4xl leading-none" style={{ color: 'var(--teal)', opacity: 0.4 }}>&ldquo;</div>
      <p className="font-sans text-sm leading-relaxed flex-1" style={{ color: 'var(--ink)' }}>
        {text}
      </p>
      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--mint)' }}>
        <span className="font-sans text-xs font-semibold" style={{ color: 'var(--navy)' }}>
          — {author}
        </span>
        {result && (
          <span
            className="font-mono font-bold text-sm px-2.5 py-1 rounded-full"
            style={{ background: 'var(--navy)', color: 'var(--amber)' }}
          >
            {result}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Square photo card ─────────────────────────────────────────────────────

function SquarePhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden group"
      style={{
        boxShadow: '0 4px 20px rgba(11,61,92,0.12)',
        border: '2px solid var(--mint)',
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ aspectRatio: '1 / 1', objectPosition: 'center top' }}
      />
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-white relative overflow-hidden">
      <GridPattern
        width={36} height={36}
        strokeDasharray="4 2"
        className={cn('fill-[#1D9E75]/[0.03] stroke-[#1D9E75]/[0.05]', '[mask-image:radial-gradient(700px_circle_at_80%_20%,white,transparent)]')}
      />
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
             style={{ color: 'var(--teal)' }}>
            Học viên nói gì
          </p>
          <h2 className="font-serif font-bold text-4xl mb-4" style={{ color: 'var(--navy)' }}>
            Nhận xét, cảm nghĩ của học viên
          </h2>
          <p className="font-sans max-w-xl mx-auto text-sm leading-relaxed"
             style={{ color: 'var(--ink)', opacity: 0.65 }}>
            Những khoảnh khắc thật, cảm nhận thật — từ lớp học đến bảng điểm IELTS.
          </p>
        </motion.div>

        {/* Videos */}
        <motion.div
          className="grid md:grid-cols-2 gap-5 mb-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {videos.map((v, i) => (
            <VideoCard key={i} {...v} />
          ))}
        </motion.div>

        {/* Quote cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {quotes.map((q, i) => (
            <QuoteCard key={i} {...q} />
          ))}
        </motion.div>

        {/* Square photo grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {squarePhotos.map((p, i) => (
            <SquarePhoto key={i} {...p} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
