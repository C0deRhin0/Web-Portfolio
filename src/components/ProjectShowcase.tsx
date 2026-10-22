import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { PROJECT_CAPTURES, type ProjectCapture } from '../data/projectScreenshots';
import styles from './ProjectShowcase.module.css';

interface ProjectShowcaseProps {
  projectSlug?: string;
  projectRepo?: string;
}

const normalizeRepo = (value: string) => value.replace(/\.git$|\/$/g, '').toLowerCase();

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ projectSlug, projectRepo }) => {
  const [touchPaused, setTouchPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selection, setSelection] = useState<{ project: ProjectCapture; screen: number } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const scoped = Boolean(projectSlug || projectRepo);
  const projects = useMemo(() => PROJECT_CAPTURES.filter((project) => !scoped ||
    project.slug === projectSlug || Boolean(projectRepo && /github\.com\/[^/]+\/[^/]+$/.test(normalizeRepo(projectRepo)) && normalizeRepo(project.repo) === normalizeRepo(projectRepo))), [scoped, projectSlug, projectRepo]);
  const slides = useMemo(() => projects.flatMap((project) =>
    (scoped ? project.screens : project.screens.slice(0, 1)).map((screen, index) => ({ project, screen, index }))), [projects, scoped]);
  const looping = slides.length > 1;
  const current = selection?.project;

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
    if (triggerRef.current?.isConnected) triggerRef.current.focus();
  };

  const changeScreen = (delta: number) => {
    if (!current) return;
    setSelection((value) => value && ({ ...value, screen: (value.screen + delta + current.screens.length) % current.screens.length }));
  };

  if (!slides.length) return null;

  return (
    <section className={styles.panel} aria-labelledby={titleId} data-project={scoped ? projectSlug : 'all'} data-paused={touchPaused || Boolean(selection) || reducedMotion}>
      <header className={styles.titlebar}><span className={styles.pictureIcon} aria-hidden="true">▧</span><h2 className={styles.title} id={titleId}>{scoped ? `${projects[0].title} — Screenshots` : 'Project screenshots'}</h2></header>
      <div className={styles.viewport} onPointerDown={(event) => { if (event.pointerType === 'touch') setTouchPaused(true); }}>
        <div className={styles.loop} data-looping={looping} style={{ animationDuration: `${Math.max(24, slides.length * 10)}s` }}>
          {(looping ? [false, true] : [false]).map((duplicate) => (
            <div className={styles.group} key={String(duplicate)} aria-hidden={duplicate || undefined} inert={duplicate || undefined}>
              {slides.map(({ project, screen, index }) => (
                <button className={styles.card} type="button" key={`${project.slug}-${index}`} tabIndex={duplicate ? -1 : 0} aria-label={`Open ${project.title}: ${screen.alt}`} onClick={(event) => { triggerRef.current = event.currentTarget; setSelection({ project, screen: index }); }}>
                  <span className={styles.imageFrame}><img src={screen.src} alt="" width={1440} height={1000} loading="lazy" decoding="async" /></span>
                  <span className={styles.cardBody}><strong>{scoped ? screen.alt : project.title}</strong><span className={styles.kind}>{screen.kind ?? project.kind}</span></span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      {current && selection && <dialog className={styles.dialog} ref={dialogRef} aria-labelledby={`${titleId}-preview`} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className={styles.viewer} onKeyDown={(event) => { if (event.key === 'ArrowRight') changeScreen(1); if (event.key === 'ArrowLeft') changeScreen(-1); }}>
          <header className={styles.viewerHeader}><span className={styles.pictureIcon} aria-hidden="true">▧</span><h2 className={styles.title} id={`${titleId}-preview`}>{current.title}</h2><button className={styles.close} type="button" onClick={close} autoFocus aria-label="Close screenshot preview">×</button></header>
          <div className={styles.imageWell}><img className={styles.fullImage} src={current.screens[selection.screen].src} alt={current.screens[selection.screen].alt} width={1440} height={1000} /></div>
          <p className={styles.caption} aria-live="polite">{current.screens[selection.screen].alt}</p>
          <footer className={styles.viewerFooter}><p>{current.screens[selection.screen].note ?? current.note}</p><div>{current.screens.length > 1 && <><button className={styles.control} type="button" onClick={() => changeScreen(-1)} aria-label="Previous screenshot">◀ Previous</button><button className={styles.control} type="button" onClick={() => changeScreen(1)} aria-label="Next screenshot">Next ▶</button></>}<a href={current.repo} target="_blank" rel="noreferrer">View source ↗</a></div></footer>
        </div>
      </dialog>}
    </section>
  );
};

export default ProjectShowcase;
