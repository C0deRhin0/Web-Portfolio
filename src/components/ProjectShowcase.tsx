import React, { useEffect, useId, useRef, useState } from 'react';
import { PROJECT_CAPTURES } from '../data/projectScreenshots';
import styles from './ProjectShowcase.module.css';

/** Locally captured interfaces and execution evidence, with explicit provenance. */
const ProjectShowcase: React.FC = () => {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selection, setSelection] = useState<{ project: number; screen: number } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const trackId = useId();
  const current = selection ? PROJECT_CAPTURES[selection.project] : null;

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener?.('change', update);
    return () => preference.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selection && dialog && !dialog.open) dialog.showModal();
  }, [selection]);

  const close = () => {
    dialogRef.current?.close();
    setSelection(null);
    triggerRef.current?.focus();
  };

  const changeScreen = (delta: number) => {
    if (!current) return;
    setSelection((value) => value && ({
      ...value,
      screen: (value.screen + delta + current.screens.length) % current.screens.length
    }));
  };

  return (
    <section className={styles.panel} aria-labelledby={titleId} data-paused={paused || Boolean(selection) || reducedMotion}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}><span aria-hidden="true" /> PROJECT SIGNAL</p><h2 id={titleId}>A closer look at the work</h2></div>
        {!reducedMotion && <button className={styles.control} type="button" aria-controls={trackId} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? '▶ Resume' : 'Ⅱ Pause'}</button>}
      </header>
      <p className={styles.hint}>{reducedMotion ? 'Scroll through the captures.' : 'Hover to pause. Select a capture to explore.'} Sample data and generated reports are labeled.</p>
      <div className={styles.viewport} id={trackId} onPointerDown={(event) => { if (event.pointerType === 'touch') setPaused(true); }}>
        <div className={styles.loop}>
          {[false, true].map((duplicate) => (
            <div className={styles.group} key={String(duplicate)} aria-hidden={duplicate || undefined} inert={duplicate || undefined}>
              {PROJECT_CAPTURES.map((project, index) => (
                <button className={styles.card} type="button" key={project.slug} tabIndex={duplicate ? -1 : 0} aria-label={`Explore ${project.title} screenshots`} onClick={(event) => { triggerRef.current = event.currentTarget; setSelection({ project: index, screen: 0 }); }}>
                  <span className={styles.imageFrame}><img src={project.screens[0].src} alt="" width={1440} height={1000} loading="lazy" decoding="async" /><span className={styles.number}>{String(index + 1).padStart(2, '0')} / {String(PROJECT_CAPTURES.length).padStart(2, '0')}</span></span>
                  <span className={styles.cardBody}><span className={styles.kind}>{project.kind}</span><strong>{project.title}</strong><span>{project.note}</span><span className={styles.open}>Explore captures <span aria-hidden="true">↗</span></span></span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      {current && selection && <dialog className={styles.dialog} ref={dialogRef} aria-labelledby={`${titleId}-preview`} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className={styles.viewer} onKeyDown={(event) => { if (event.key === 'ArrowRight') changeScreen(1); if (event.key === 'ArrowLeft') changeScreen(-1); }}>
          <header className={styles.viewerHeader}><div><span className={styles.kind}>{current.kind}</span><h2 id={`${titleId}-preview`}>{current.title}</h2></div><button className={styles.control} type="button" onClick={close} autoFocus aria-label="Close screenshot preview">Close ×</button></header>
          <img className={styles.fullImage} src={current.screens[selection.screen].src} alt={current.screens[selection.screen].alt} width={1440} height={1000} />
          <p className={styles.caption}>{current.screens[selection.screen].alt}</p>
          <footer className={styles.viewerFooter}><p>{current.note}</p><div>{current.screens.length > 1 && <><button className={styles.control} type="button" onClick={() => changeScreen(-1)} aria-label="Previous screenshot">←</button><span aria-live="polite">{selection.screen + 1} / {current.screens.length}</span><button className={styles.control} type="button" onClick={() => changeScreen(1)} aria-label="Next screenshot">→</button></>}<a href={current.repo} target="_blank" rel="noreferrer">View source ↗</a></div></footer>
        </div>
      </dialog>}
    </section>
  );
};

export default ProjectShowcase;
