'use client';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { type SyntheticEvent, useEffect, useState, useTransition } from 'react';
import {
  Collapsible,
  CollapsibleContent,
} from 'fumadocs-ui/components/ui/collapsible';
import { cva } from 'class-variance-authority';
import { usePathname } from 'next/navigation';

const rateButtonVariants = cva(
  'inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium border text-sm [&_svg]:size-4 disabled:cursor-not-allowed cursor-pointer transition-colors',
  {
    variants: {
      active: {
        true: 'bg-fd-accent text-fd-accent-foreground [&_svg]:fill-current',
        false: 'text-fd-muted-foreground hover:bg-fd-accent/50',
      },
    },
  }
);

export interface Feedback {
  opinion: 'good' | 'bad';
  url?: string;
  message: string;
}

export interface ActionResponse {
  githubUrl: string;
}

interface Result extends Feedback {
  response?: ActionResponse;
}

export interface FeedbackProps {
  lang: string;
  onRateAction: (url: string, feedback: Feedback) => Promise<ActionResponse>;
}

const translations = {
  'en-US': {
    question: 'How is this guide?',
    good: 'Good',
    bad: 'Bad',
    thanks: 'Thank you for your feedback!',
    viewOnGitHub: 'View on GitHub',
    submitAgain: 'Submit Again',
    placeholder: 'Leave your feedback...',
    submit: 'Submit',
  },
  'zh-CN': {
    question: '这篇文档对您有帮助吗？',
    good: '有帮助',
    bad: '没帮助',
    thanks: '感谢您的反馈！',
    viewOnGitHub: '在 GitHub 查看',
    submitAgain: '重新提交',
    placeholder: '请留下您的反馈...',
    submit: '提交',
  },
};

export function Feedback({ lang, onRateAction }: FeedbackProps) {
  const url = usePathname();
  const [previous, setPrevious] = useState<Result | null>(null);
  const [opinion, setOpinion] = useState<'good' | 'bad' | null>(null);
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const t = translations[lang as keyof typeof translations] || translations.en;

  useEffect(() => {
    const item = localStorage.getItem(`docs-feedback-${url}`);

    if (item === null) return;
    setPrevious(JSON.parse(item) as Result);
  }, [url]);

  useEffect(() => {
    const key = `docs-feedback-${url}`;

    if (previous) localStorage.setItem(key, JSON.stringify(previous));
    else localStorage.removeItem(key);
  }, [previous, url]);

  function submit(e?: SyntheticEvent) {
    if (opinion == null) return;

    startTransition(async () => {
      const feedback: Feedback = {
        opinion,
        message,
      };

      void onRateAction(url, feedback).then((response) => {
        setPrevious({
          response,
          ...feedback,
        });
        setMessage('');
        setOpinion(null);
      });
    });

    e?.preventDefault();
  }

  const activeOpinion = previous?.opinion ?? opinion;

  return (
    <Collapsible
      open={opinion !== null || previous !== null}
      onOpenChange={(v) => {
        if (!v) setOpinion(null);
      }}
      className="border-y py-3"
    >
      <div className="flex flex-row flex-wrap items-center gap-2">
        <p className="pe-2 text-sm font-medium">{t.question}</p>
        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: activeOpinion === 'good',
            })
          )}
          onClick={() => {
            setOpinion('good');
          }}
        >
          <ThumbsUp />
          {t.good}
        </button>
        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: activeOpinion === 'bad',
            })
          )}
          onClick={() => {
            setOpinion('bad');
          }}
        >
          <ThumbsDown />
          {t.bad}
        </button>
      </div>
      <CollapsibleContent className="mt-3">
        {previous ? (
          <div className="bg-fd-card text-fd-muted-foreground flex flex-col items-center gap-3 rounded-xl px-3 py-6 text-center text-sm">
            <p>{t.thanks}</p>
            <div className="flex flex-row items-center gap-2">
              <a
                href={previous.response?.githubUrl}
                rel="noreferrer noopener"
                target="_blank"
                className={cn(
                  buttonVariants({
                    color: 'primary',
                  }),
                  'text-xs'
                )}
              >
                {t.viewOnGitHub}
              </a>

              <button
                className={cn(
                  buttonVariants({
                    color: 'secondary',
                  }),
                  'text-xs'
                )}
                onClick={() => {
                  setOpinion(previous.opinion);
                  setPrevious(null);
                }}
              >
                {t.submitAgain}
              </button>
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <textarea
              autoFocus
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-fd-secondary text-fd-secondary-foreground placeholder:text-fd-muted-foreground resize-none rounded-lg border p-3 focus-visible:outline-none"
              placeholder={t.placeholder}
              onKeyDown={(e) => {
                if (!e.shiftKey && e.key === 'Enter') {
                  submit(e);
                }
              }}
            />
            <button
              type="submit"
              className={cn(buttonVariants({ color: 'outline' }), 'w-fit px-3')}
              disabled={isPending}
            >
              {t.submit}
            </button>
          </form>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
