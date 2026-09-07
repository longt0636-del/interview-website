'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GridPattern } from '@/components/ui/grid-pattern';
import { VideoCardGrid } from '@/components/ui/video-testimonial';
import { testimonialVideos } from '@/lib/testimonial-videos';
import { cn } from '@/lib/utils';

const quotes = [
  {
    text: 'Thầy ơi em đang bế con. Đợi xíu em vào học ạ? — vừa đi làm, vừa chăm con, em vẫn theo hết lộ trình và đạt 7.5.',
    author: 'Đặng Nguyễn Minh Thư',
    result: 'IELTS 7.5',
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
  { src: '/students/class-photo-1.jpg', alt: 'Học viên lớp IELTS LongIELTS trong giờ học' },
  { src: '/students/class-photo-2.jpg', alt: 'Học viên LongIELTS luyện tập theo nhóm nhỏ' },
  { src: '/students/class-photo-3.jpg', alt: 'Cả lớp chụp ảnh kỷ niệm cùng thầy Long' },
  { src: '/students/class-photo-4.jpg', alt: 'Học viên LongIELTS nhận kết quả IELTS' },
  { src: '/students/class-photo-5.jpg', alt: 'Buổi học IELTS tại lớp của thầy Long' },
  { src: '/students/class-photo-6.jpg', alt: 'Học viên LongIELTS cùng thầy Long sau buổi học' },
];

/* ── Quote card ────────────────────────────────────────────────────────────── */

function QuoteCard({ text, author, result }: (typeof quotes)[0]) {
  return (
    <figure
      className="flex h-full flex-col gap-3 rounded-2xl p-5"
      style={{
        background: 'var(--off-white)',
        border: '1px solid var(--mint)',
        boxShadow: '0 2px 12px rgba(11,61,92,0.06)',
      }}
    >
      <span aria-hidden="true" className="font-serif text-4xl leading-none" style={{ color: 'var(--teal)', opacity: 0.4 }}>
        &ldquo;
      </span>
      <blockquote className="flex-1 font-sans text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
        {text}
      </blockquote>
      <figcaption className="flex items-center justify-between gap-3 border-t pt-3" style={{ borderColor: 'var(--mint)' }}>
        <span className="font-sans text-xs font-semibold" style={{ color: 'var(--navy)' }}>
          — {author}
        </span>
        {result ? (
          <span
            className="shrink-0 rounded-full px-2.5 py-1 font-mono text-sm font-bold"
            style={{ background: 'var(--navy)', color: 'var(--amber)' }}
          >
            {result}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}

/* ── Square photo card ─────────────────────────────────────────────────────── */

function SquarePhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl"
      style={{ boxShadow: '0 4px 20px rgba(11,61,92,0.12)', border: '2px solid var(--mint)' }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        style={{ aspectRatio: '1 / 1', objectPosition: 'center top' }}
      />
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative scroll-mt-20 overflow-hidden bg-white px-6 py-24">
      <GridPattern
        width={36}
        height={36}
        strokeDasharray="4 2"
        className={cn(
          'fill-[#1D9E75]/[0.03] stroke-[#1D9E75]/[0.05]',
          '[mask-image:radial-gradient(700px_circle_at_80%_20%,white,transparent)]',
        )}
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-8" style={{ background: 'var(--teal)' }} />
            <p className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--teal)' }}>
              · Học viên nói gì ·
            </p>
            <span className="h-px w-8" style={{ background: 'var(--teal)' }} />
          </div>
          <h2 className="mb-4 font-serif text-4xl font-bold" style={{ color: 'var(--navy)' }}>
            Nhận xét, cảm nghĩ của học viên
          </h2>
          <p className="mx-auto max-w-xl font-sans text-sm leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.65 }}>
            Những khoảnh khắc thật, cảm nhận thật — từ lớp học đến bảng điểm IELTS.
            Bấm vào từng thẻ để nghe học viên tự kể.
          </p>
        </motion.div>

        {/* Video testimonials */}
        <motion.div
          className="mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <VideoCardGrid items={testimonialVideos} className="mx-auto max-w-5xl" />
        </motion.div>

        {/* Quote cards */}
        <motion.div
          className="mb-16 grid gap-4 md:grid-cols-2"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          {quotes.map((q) => (
            <QuoteCard key={q.author} {...q} />
          ))}
        </motion.div>

        {/* Class photos */}
        <motion.div
          className="grid grid-cols-2 gap-4 md:grid-cols-3"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.16 }}
        >
          {squarePhotos.map((p) => (
            <SquarePhoto key={p.src} {...p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
