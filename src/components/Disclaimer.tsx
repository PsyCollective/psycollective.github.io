import React from 'react';

interface DisclaimerProps {
  variant?: 'general' | 'autosave';
  className?: string;
}

export function Disclaimer({ variant = 'general', className = '' }: DisclaimerProps) {
  const content = {
    general: (
      <>
        Все опросники проходят <span className="font-semibold">локально</span> в вашем браузере; результаты
        <span className="font-semibold"> не отправляются</span> на сервер.
      </>
    ),
    autosave: (
      <>
        💾 <strong>Автосохранение.</strong> Все данные сохраняются локально в вашем браузере и <strong>не передаются</strong> на сервер.
      </>
    ),
  };

  const baseClassName = variant === 'general' 
    ? "rounded-2xl bg-note p-4 text-sm pc-muted ring-1 ring-border md:p-5"
    : "rounded-2xl border border-border p-4 text-center text-sm text-fg bg-note";

  return (
    <div className={`${baseClassName} ${className}`}>
      {content[variant]}
    </div>
  );
}