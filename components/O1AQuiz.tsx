"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";

const QUESTIONS = [
  {
    id: 1,
    question: "Have you won an award or prize in your field?",
    hint: "Hackathon wins, startup competitions, academic prizes, industry awards",
    criteria: "Awards",
  },
  {
    id: 2,
    question: "Have you been featured in press or media?",
    hint: "Tech blogs, newspapers, podcasts, YouTube interviews — any publication covering your work",
    criteria: "Press",
  },
  {
    id: 3,
    question: "Have you judged a competition or reviewed others' work?",
    hint: "Hackathon judge, startup pitch panel, peer reviewer, grant committee",
    criteria: "Judging",
  },
  {
    id: 4,
    question: "Have you made an original contribution to your field?",
    hint: "Open source project used by others, new methodology, significant product, research cited by others",
    criteria: "Contributions",
  },
  {
    id: 5,
    question: "Have you authored articles or papers about your work?",
    hint: "Technical blog posts with traction, research papers, published articles in trade/academic journals",
    criteria: "Publications",
  },
  {
    id: 6,
    question: "Have you spoken at conferences or industry events?",
    hint: "Keynotes, panel talks, podcast appearances, invited presentations — any speaking role",
    criteria: "Critical Role",
  },
  {
    id: 7,
    question: "Have you had a critical or leading role at a recognised organisation?",
    hint: "Founder, CTO, Head of, Director, or key technical lead at a notable startup, lab, or company",
    criteria: "Critical Employment",
  },
  {
    id: 8,
    question: "Do you earn (or have you earned) a high salary compared to peers?",
    hint: "Top 10-15% salary for your role and industry, equity that demonstrates your value, significant funding raised",
    criteria: "High Salary",
  },
];

interface O1AQuizProps {
  onClose: () => void;
  onSignup: (score: number) => void;
}

export function O1AQuiz({ onClose, onSignup }: O1AQuizProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(new Array(8).fill(null));
  const [done, setDone] = useState(false);

  const score = answers.filter(Boolean).length;

  const answer = (yes: boolean) => {
    const next = [...answers];
    next[current] = yes;
    setAnswers(next);
    if (current < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(current + 1), 300);
    } else {
      setTimeout(() => setDone(true), 300);
    }
  };

  const reset = () => {
    setAnswers(new Array(8).fill(null));
    setCurrent(0);
    setDone(false);
  };

  // Auto-redirect to signup 2.5s after result is shown
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => onSignup(score), 2500);
    return () => clearTimeout(t);
  }, [done, score, onSignup]);

  const q = QUESTIONS[current];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0D1220] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="size-5" />
        </button>

        {!done ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>O-1A Qualifier</span>
                <span>{current + 1} / {QUESTIONS.length}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
              {/* Dot indicators */}
              <div className="flex gap-1.5 pt-1">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      answers[i] === true
                        ? "bg-emerald-400"
                        : answers[i] === false
                        ? "bg-red-500/50"
                        : i === current
                        ? "bg-blue-400"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Criteria badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
              Criteria: {q.criteria}
            </div>

            {/* Question */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white leading-snug">
                {q.question}
              </h3>
              <p className="text-sm text-slate-400">{q.hint}</p>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => answer(false)}
                className="flex items-center justify-center gap-2 h-14 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all font-semibold"
              >
                <XCircle className="size-4" />
                No
              </button>
              <button
                onClick={() => answer(true)}
                className="flex items-center justify-center gap-2 h-14 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all font-semibold"
              >
                <CheckCircle2 className="size-4" />
                Yes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            {/* Score ring */}
            <div className="flex justify-center">
              <div className={`size-28 rounded-full border-4 flex flex-col items-center justify-center ${
                score >= 3 ? "border-emerald-400 bg-emerald-500/10" : "border-yellow-400 bg-yellow-500/10"
              }`}>
                <span className="text-4xl font-bold text-white">{score}</span>
                <span className="text-xs text-slate-400">/ 8</span>
              </div>
            </div>

            {score >= 3 ? (
              <>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">You Likely Qualify</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    You meet {score} O-1A criteria — the threshold is typically 3 out of 8.
                    You're a strong candidate. Register your interest and compete at a One Way hackathon.
                  </p>
                </div>
                <Button
                  onClick={() => onSignup(score)}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl"
                >
                  Register to Compete
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Not There Yet</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    You meet {score} criteria right now. You need at least 3 to qualify for O-1A.
                    Competing in a hackathon can help you build criteria — especially Press, Awards, and Critical Role.
                  </p>
                </div>
                <Button
                  onClick={() => onSignup(score)}
                  variant="outline"
                  className="w-full h-12 border-white/10 text-slate-300 hover:bg-white/5 rounded-xl"
                >
                  Register Anyway — Build Your Case
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </>
            )}

            {/* Criteria breakdown */}
            <div className="grid grid-cols-4 gap-1.5 pt-2">
              {QUESTIONS.map((q, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-2 text-center text-xs ${
                    answers[i]
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-white/3 border border-white/8 text-slate-600"
                  }`}
                >
                  {q.criteria}
                </div>
              ))}
            </div>

            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mx-auto"
            >
              <RotateCcw className="size-3" />
              Retake quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
