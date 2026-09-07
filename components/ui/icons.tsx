import * as React from 'react';

/**
 * Inline SVG icon set (Heroicons outline geometry).
 * Replaces the emoji that were previously used as icons — emoji render
 * inconsistently across platforms and are announced as text by screen readers.
 */

type IconProps = {
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

function Icon({ className, strokeWidth = 1.7, style, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Sprout — foundation / starting from zero */
export function SproutIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21v-8" />
      <path d="M12 13c0-3.3-2.7-6-6-6H4v1.5A5.5 5.5 0 0 0 9.5 14H12Z" />
      <path d="M12 13c0-2.8 2.2-5 5-5h2v1a5 5 0 0 1-5 5h-2Z" />
    </Icon>
  );
}

/** Rising chart — building on existing basics */
export function TrendUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 17.5 9 11l4 4 7.5-7.5" />
      <path d="M15.5 7.5H21v5.5" />
    </Icon>
  );
}

/** Target — exam-focused strategy */
export function TargetIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** Academic cap — courses header ornament */
export function AcademicCapIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z" />
      <path d="M6.5 10.7v4.6c0 1.5 2.5 2.9 5.5 2.9s5.5-1.4 5.5-2.9v-4.6" />
      <path d="M21.5 8.5v5" />
    </Icon>
  );
}

/** Open book — courses header ornament */
export function BookOpenIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 6.7C10.4 5.6 8.4 5 6 5H3v12h3c2.4 0 4.4.6 6 1.7" />
      <path d="M12 6.7C13.6 5.6 15.6 5 18 5h3v12h-3c-2.4 0-4.4.6-6 1.7" />
      <path d="M12 6.7v12" />
    </Icon>
  );
}

/** Clipboard with check — survey form step */
export function ClipboardCheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 4.5h6M9 4.5A1.5 1.5 0 0 0 7.5 6v.5h9V6A1.5 1.5 0 0 0 15 4.5" />
      <path d="M16.5 5.8h1.7A1.8 1.8 0 0 1 20 7.6v11.1a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18.7V7.6a1.8 1.8 0 0 1 1.8-1.8h1.7" />
      <path d="m9 13.5 2 2 4-4" />
    </Icon>
  );
}

/** Pencil on paper — placement test step */
export function PencilSquareIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16.9 4.5a1.9 1.9 0 0 1 2.6 2.6L9.9 16.8 6 18l1.2-3.9 9.7-9.6Z" />
      <path d="M19.5 13.5v5a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18.5V6.8A1.8 1.8 0 0 1 5.8 5h5" />
    </Icon>
  );
}

/** Calendar — trial lesson step */
export function CalendarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
    </Icon>
  );
}

/** Two people — small class size */
export function UsersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.4a3.2 3.2 0 0 1 0 5.2" />
      <path d="M17.6 14.2a5.5 5.5 0 0 1 2.9 4.8" />
    </Icon>
  );
}

/** Arrow right — inline link affordance */
export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 2.2}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </Icon>
  );
}
