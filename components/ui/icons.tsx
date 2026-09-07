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

/** Headphones — listening sections */
export function HeadphonesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 14h2.2a1 1 0 0 1 1 1v3.6a1 1 0 0 1-1 1H5.4A1.4 1.4 0 0 1 4 18.2V14Z" />
      <path d="M20 14h-2.2a1 1 0 0 0-1 1v3.6a1 1 0 0 0 1 1h.8a1.4 1.4 0 0 0 1.4-1.4V14Z" />
    </Icon>
  );
}

/** Stacked books — study material */
export function BookStackIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="3.5" width="5" height="17" rx="1.2" />
      <rect x="10.5" y="3.5" width="5" height="17" rx="1.2" />
      <path d="M17.4 5.6l3 .8-3.6 13.4-2.4-.7" />
    </Icon>
  );
}

/** Microphone — Speaking recording */
export function MicIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5v4M8.5 21.5h7" />
    </Icon>
  );
}

/** Phone — contact step */
export function PhoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.2 3.5H4.8A1.8 1.8 0 0 0 3 5.4C3 13.9 10.1 21 18.6 21a1.8 1.8 0 0 0 1.9-1.8v-2.4a1.2 1.2 0 0 0-.95-1.17l-3.1-.66a1.2 1.2 0 0 0-1.26.55l-.85 1.4a13.4 13.4 0 0 1-5.33-5.33l1.4-.85a1.2 1.2 0 0 0 .55-1.26l-.66-3.1A1.2 1.2 0 0 0 7.2 3.5Z" />
    </Icon>
  );
}

/** Speech bubble — feedback / consultation */
export function ChatIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.5 12.4c0 4-3.8 7.2-8.5 7.2-1 0-2-.15-2.9-.42L4 21l1.4-3.5A6.9 6.9 0 0 1 3.5 12.4C3.5 8.4 7.3 5.2 12 5.2s8.5 3.2 8.5 7.2Z" />
    </Icon>
  );
}

/** Warning triangle */
export function WarningIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10.7 4.1 2.9 17.5a1.5 1.5 0 0 0 1.3 2.3h15.6a1.5 1.5 0 0 0 1.3-2.3L13.3 4.1a1.5 1.5 0 0 0-2.6 0Z" />
      <path d="M12 9.5v4M12 16.8h.01" />
    </Icon>
  );
}

/** Lightbulb — tip callout */
export function LightbulbIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.2 17.5a6 6 0 1 1 5.6 0" />
      <path d="M9.2 17.5h5.6M10 20.5h4" />
    </Icon>
  );
}

/** Cog — dev-mode banner */
export function CogIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
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
