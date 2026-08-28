import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ilmaLogo from '@/assets/images/ilma-logo.png';

const LAUNCH_YEAR = 2026;
const LAUNCH_MONTH = 9;
const LAUNCH_DAY = 4;
const ILMA_TIME_ZONE = 'Asia/Kolkata';
const LAUNCH_START = Date.parse('2026-09-03T18:30:00.000Z');
const LAUNCH_END = Date.parse('2026-09-04T18:30:00.000Z');
const MAX_TIMER_DELAY = 2_147_000_000;

type LaunchStep = 'name' | 'welcome' | 'ribbon' | 'celebration';
type LaunchStatus = 'checking' | 'hidden' | 'visible';

function isLaunchDay(date: Date): boolean {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ILMA_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type === 'year' || type === 'month' || type === 'day')
      .map(({ type, value }) => [type, Number(value)]),
  );

  return (
    values.year === LAUNCH_YEAR &&
    values.month === LAUNCH_MONTH &&
    values.day === LAUNCH_DAY
  );
}

async function getWebsiteDate(): Promise<Date> {
  try {
    const response = await fetch(window.location.href, {
      method: 'HEAD',
      cache: 'no-store',
    });
    const serverDate = response.headers.get('date');
    if (serverDate) {
      const parsed = new Date(serverDate);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  } catch {
    // The visitor's clock is a safe fallback when the host does not expose Date.
  }
  return new Date();
}

const confetti = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 17) % 84)}%`,
  delay: (index % 6) * 0.08,
  rotate: (index * 47) % 180,
  color: index % 2 === 0 ? 'bg-primary' : 'bg-secondary',
}));

export function LaunchCeremony() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<LaunchStatus>('checking');
  const [step, setStep] = useState<LaunchStep>('name');
  const [nameInput, setNameInput] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const isVisible = status === 'visible';

  useEffect(() => {
    let active = true;
    let boundaryTimer: number | undefined;

    const scheduleReconciliation = (delay: number) => {
      boundaryTimer = window.setTimeout(
        () => void reconcileWebsiteDate(),
        Math.max(0, Math.min(delay, MAX_TIMER_DELAY)),
      );
    };

    const reconcileWebsiteDate = async () => {
      const date = await getWebsiteDate();
      if (!active) return;
      const websiteTime = date.getTime();

      if (isLaunchDay(date)) {
        setStatus('visible');
        boundaryTimer = window.setTimeout(
          () => setStatus('hidden'),
          Math.max(0, LAUNCH_END - websiteTime),
        );
      } else {
        setStatus('hidden');
        if (websiteTime < LAUNCH_START) {
          scheduleReconciliation(LAUNCH_START - websiteTime);
        }
      }
    };

    void reconcileWebsiteDate();

    return () => {
      active = false;
      if (boundaryTimer !== undefined) window.clearTimeout(boundaryTimer);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const previousOverflow = document.body.style.overflow;
    const appRoot = document.getElementById('root');
    const previousAriaHidden = appRoot
      ? appRoot.getAttribute('aria-hidden')
      : null;
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    document.body.style.overflow = 'hidden';
    if (appRoot) {
      appRoot.inert = true;
      appRoot.setAttribute('aria-hidden', 'true');
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      if (appRoot) {
        appRoot.inert = false;
        if (previousAriaHidden === null) appRoot.removeAttribute('aria-hidden');
        else appRoot.setAttribute('aria-hidden', previousAriaHidden);
      }
      previouslyFocusedRef.current?.focus();
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const focusTimer = window.setTimeout(() => {
      const firstControl = overlayRef.current?.querySelector<HTMLElement>(
        'input:not(:disabled), button:not(:disabled)',
      );
      (firstControl ?? overlayRef.current)?.focus();
    }, 0);
    return () => window.clearTimeout(focusTimer);
  }, [isVisible, step]);

  useEffect(() => {
    if (step !== 'welcome') return;
    const timer = window.setTimeout(
      () => setStep('ribbon'),
      reduceMotion ? 700 : 2200,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion, step]);

  useEffect(() => {
    if (step !== 'celebration') return;
    const timer = window.setTimeout(
      () => setStatus('hidden'),
      reduceMotion ? 1200 : 2800,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion, step]);

  const transition = useMemo(
    () => ({ duration: reduceMotion ? 0.1 : 0.65, ease: 'easeOut' as const }),
    [reduceMotion],
  );

  const handleNameSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = nameInput.trim();
    if (!name) return;
    setVisitorName(name.slice(0, 60));
    setStep('welcome');
  };

  const handleFocusTrap = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const controls = Array.from(
      overlayRef.current?.querySelectorAll<HTMLElement>(
        'input:not(:disabled), button:not(:disabled)',
      ) ?? [],
    );

    if (controls.length === 0) {
      event.preventDefault();
      overlayRef.current?.focus();
      return;
    }

    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const ceremony = (
    <AnimatePresence>
      {status === 'checking' && (
        <motion.div
          key="checking-date"
          aria-hidden="true"
          className="fixed inset-0 z-[10000] bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        />
      )}
      {status === 'visible' && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="ILMA launch ceremony"
          tabIndex={-1}
          onKeyDown={handleFocusTrap}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          className="fixed inset-0 z-[10000] overflow-y-auto bg-background"
        >
          <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-10 md:px-6">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

            <div className="relative z-10 w-full max-w-3xl text-center">
              <AnimatePresence mode="wait">
                {step === 'name' && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={transition}
                    className="mx-auto max-w-xl"
                  >
                    <img
                      src={ilmaLogo}
                      alt="ILMA – Biomedical Future"
                      className="mx-auto mb-7 h-24 w-40 object-contain md:h-28 md:w-48"
                    />
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                      Welcome to ILMA
                    </p>
                    <p className="mb-10 text-sm font-medium text-muted-foreground md:text-base">
                      Innovation • Learning • Medical Technology • Advancement
                    </p>
                    <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur md:p-9">
                      <h1 className="mb-7 text-2xl font-bold tracking-tight md:text-3xl">
                        Before we open our doors, we&apos;d love to know who&apos;s joining us.
                      </h1>
                      <form onSubmit={handleNameSubmit}>
                        <label
                          htmlFor="launch-visitor-name"
                          className="mb-2 block text-left text-sm font-semibold text-foreground"
                        >
                          Enter your name
                        </label>
                        <input
                          id="launch-visitor-name"
                          value={nameInput}
                          onChange={(event) => setNameInput(event.target.value)}
                          maxLength={60}
                          autoComplete="name"
                          autoFocus
                          placeholder="Your Name"
                          className="mb-4 h-12 w-full rounded-lg border border-input bg-background px-4 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <Button
                          type="submit"
                          size="lg"
                          disabled={!nameInput.trim()}
                          className="h-12 w-full font-semibold tracking-wide"
                        >
                          Continue
                        </Button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {step === 'welcome' && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={transition}
                    className="py-16"
                  >
                    <img
                      src={ilmaLogo}
                      alt=""
                      className="mx-auto mb-8 h-24 w-40 object-contain"
                    />
                    <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
                      Welcome, <span className="text-primary">{visitorName}</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground md:text-2xl">
                      You are part of our beginning.
                    </p>
                  </motion.div>
                )}

                {step === 'ribbon' && (
                  <motion.div
                    key="ribbon"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={transition}
                  >
                    <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Our learners are at the heart of ILMA.
                    </p>
                    <h1 className="mx-auto mb-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
                      You are not just a visitor. You are part of our journey.
                    </h1>
                    <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                      So rather than simply opening our doors for you, we wanted you to open them yourself.
                    </p>

                    <div className="relative mx-auto mb-10 flex h-20 max-w-2xl items-center" aria-hidden="true">
                      <div className="h-8 flex-1 border-y border-primary/20 bg-primary shadow-md" />
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-secondary text-white shadow-lg">
                        <Scissors className="h-7 w-7 -rotate-45" />
                      </div>
                      <div className="h-8 flex-1 border-y border-primary/20 bg-primary shadow-md" />
                    </div>

                    <p className="mb-6 text-lg font-semibold md:text-xl">
                      Cut the ribbon. Open the doors. Begin the journey.
                    </p>
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => setStep('celebration')}
                      className="h-14 px-8 text-base font-bold tracking-wide md:text-lg"
                    >
                      ✂️ Cut the Ribbon
                    </Button>
                  </motion.div>
                )}

                {step === 'celebration' && (
                  <motion.div
                    key="celebration"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={transition}
                    className="relative py-10"
                  >
                    {!reduceMotion &&
                      confetti.map((piece) => (
                        <motion.span
                          key={piece.id}
                          className={`absolute top-1/2 h-2 w-1.5 rounded-sm ${piece.color}`}
                          style={{ left: piece.left }}
                          initial={{ opacity: 0, y: 0, rotate: 0 }}
                          animate={{
                            opacity: [0, 1, 1, 0],
                            y: [0, -150 - (piece.id % 4) * 20, 180],
                            rotate: piece.rotate + 220,
                          }}
                          transition={{ duration: 2.1, delay: piece.delay, ease: 'easeOut' }}
                        />
                      ))}

                    <div className="relative mx-auto mb-8 flex h-12 max-w-2xl items-center" aria-hidden="true">
                      <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: reduceMotion ? -20 : -220, opacity: 0 }}
                        transition={transition}
                        className="h-8 flex-1 bg-primary"
                      />
                      <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: reduceMotion ? 20 : 220, opacity: 0 }}
                        transition={transition}
                        className="h-8 flex-1 bg-primary"
                      />
                    </div>

                    <motion.img
                      src={ilmaLogo}
                      alt="ILMA – Biomedical Future"
                      initial={{ opacity: 0, scale: 0.86 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...transition, delay: reduceMotion ? 0 : 0.3 }}
                      className="mx-auto mb-7 h-28 w-48 object-contain md:h-36 md:w-60"
                    />
                    <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-6xl">
                      Welcome to ILMA
                    </h1>
                    <p className="mb-5 text-xl text-primary md:text-2xl">
                      Where innovation meets healthcare.
                    </p>
                    <p className="mb-6 font-semibold text-foreground">September 4, 2026</p>
                    <p className="text-lg text-muted-foreground">
                      Thank you for being here at the beginning.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(ceremony, document.body);
}