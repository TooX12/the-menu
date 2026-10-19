import { useMemo } from 'react';
import { encodeQr, qrToSvgPath } from '@/lib/qr';

interface QrCodeProps {
  value: string;
  /** Rendered size in pixels. The SVG scales, so this is only a box. */
  size?: number;
  /** Quiet zone in modules. Four is the minimum the spec allows. */
  quietZone?: number;
  title?: string;
  className?: string;
}

export function QrCode({ value, size = 220, quietZone = 4, title, className }: QrCodeProps) {
  const code = useMemo(() => {
    try {
      return encodeQr(value);
    } catch {
      return null;
    }
  }, [value]);

  if (!code) {
    return (
      <div className="qr qr--error" style={{ width: size, height: size }}>
        <span>·</span>
      </div>
    );
  }

  const extent = code.size + quietZone * 2;
  const path = qrToSvgPath(code);

  return (
    <svg
      className={className ? `qr ${className}` : 'qr'}
      width={size}
      height={size}
      viewBox={`0 0 ${extent} ${extent}`}
      role="img"
      aria-label={title ?? 'QR code'}
      shapeRendering="crispEdges"
    >
      <rect width={extent} height={extent} fill="var(--qr-light)" />
      <g transform={`translate(${quietZone} ${quietZone})`}>
        <path d={path} fill="var(--qr-dark)" />
      </g>
    </svg>
  );
}
