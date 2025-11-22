'use client';

import { useMemo, useState } from 'react';

type Language = 'ar' | 'en';

type Comparison = 'greaterOrEqual' | 'lessOrEqual';

type LoopStep = {
  iteration: number;
  value: number;
  conditionMet: boolean;
};

const TEXT: Record<Language, {
  title: string;
  subtitle: string;
  overviewTitle: string;
  overview: string;
  anatomyTitle: string;
  anatomy: string[];
  simulationTitle: string;
  runButton: string;
  runningLabel: string;
  inputs: {
    start: string;
    target: string;
    step: string;
    condition: string;
  };
  conditions: Record<Comparison, string>;
  timelineTitle: string;
  timelineEmpty: string;
  codeTitle: string;
  codeLines: string[];
}> = {
  ar: {
    title: 'الحلقة التكرارية Do...Until',
    subtitle:
      'تعمل الحلقة Do...Until على تنفيذ التعليمات مرة واحدة على الأقل ثم تستمر حتى يتحقق الشرط.',
    overviewTitle: 'لمحة سريعة',
    overview:
      'في لغات البرمجة، تضمن الحلقة Do...Until تنفيذ الجملة داخل الحلقة مرة واحدة على الأقل، ثم تفحص الشرط في نهاية كل دورة. إذا تحقق الشرط، تتوقف الحلقة؛ وإذا لم يتحقق، تستمر.',
    anatomyTitle: 'مكونات الحلقة',
    anatomy: [
      'Do: يبدأ تنفيذ أوامر الحلقة مباشرة دون انتظار شرط مسبق.',
      'العمليات: أي تعليمات نريد تكرارها، مثل تحديث متغير أو طباعة قيمة.',
      'Until: يتم تقييم الشرط بعد انتهاء الكتلة. إذا أصبح صحيحًا، تتوقف الحلقة.',
    ],
    simulationTitle: 'تجربة تفاعلية',
    runButton: 'تشغيل الحلقة',
    runningLabel: 'الخطوات الناتجة',
    inputs: {
      start: 'القيمة الابتدائية',
      target: 'الهدف (يتحقق الشرط عنده)',
      step: 'مقدار التغيير في كل دورة',
      condition: 'نوع الشرط',
    },
    conditions: {
      greaterOrEqual: 'حتى تصبح القيمة أكبر أو تساوي الهدف',
      lessOrEqual: 'حتى تصبح القيمة أصغر أو تساوي الهدف',
    },
    timelineTitle: 'تسلسل التنفيذ',
    timelineEmpty: 'شغّل المحاكاة لرؤية خطوات الحلقة.',
    codeTitle: 'مثال شبه رمزي',
    codeLines: [
      'المتغير الحالي ← القيمة الابتدائية',
      'كرر',
      '    نفّذ الخطوات المطلوبة',
      '    اطبع "القيمة الحالية:" + المتغير الحالي',
      '    المتغير الحالي ← المتغير الحالي + مقدار التغيير',
      'حتى (المتغير الحالي يحقق الشرط)',
    ],
  },
  en: {
    title: 'Do...Until Loop',
    subtitle:
      'A Do...Until loop always runs the body at least once, then repeats until its condition becomes true.',
    overviewTitle: 'Quick Overview',
    overview:
      'In many programming languages, a Do...Until loop executes the block first and checks the condition afterwards. As soon as the condition evaluates to true, the loop stops. If the condition stays false, the loop continues.',
    anatomyTitle: 'Anatomy',
    anatomy: [
      'Do: execute the loop body immediately without a pre-check.',
      'Body: the instructions you want to repeat, such as updating variables or logging output.',
      'Until: evaluate the condition after each run; when it turns true, exit the loop.',
    ],
    simulationTitle: 'Interactive Simulation',
    runButton: 'Run Loop',
    runningLabel: 'Resulting steps',
    inputs: {
      start: 'Starting value',
      target: 'Target (condition triggers here)',
      step: 'Change per iteration',
      condition: 'Condition type',
    },
    conditions: {
      greaterOrEqual: 'Until value is greater than or equal to target',
      lessOrEqual: 'Until value is less than or equal to target',
    },
    timelineTitle: 'Execution timeline',
    timelineEmpty: 'Run the simulation to see the loop in action.',
    codeTitle: 'Pseudo code example',
    codeLines: [
      'current ← starting value',
      'repeat',
      '    perform loop actions',
      '    print "current:" + current',
      '    current ← current + step',
      'until (current satisfies the condition)',
    ],
  },
};

const MAX_ITERATIONS = 200;

export default function Page() {
  const [language, setLanguage] = useState<Language>('ar');
  const [startValue, setStartValue] = useState(1);
  const [targetValue, setTargetValue] = useState(10);
  const [step, setStep] = useState(2);
  const [comparison, setComparison] = useState<Comparison>('greaterOrEqual');
  const [steps, setSteps] = useState<LoopStep[]>([]);

  const t = TEXT[language];

  const runLoop = () => {
    const evalCondition = (value: number) => {
      return comparison === 'greaterOrEqual'
        ? value >= targetValue
        : value <= targetValue;
    };

    const newSteps: LoopStep[] = [];
    let current = startValue;
    let iteration = 1;

    do {
      const conditionMet = evalCondition(current);
      newSteps.push({ iteration, value: current, conditionMet });

      if (conditionMet) {
        break;
      }

      current = current + step;
      iteration += 1;
    } while (!evalCondition(current) && iteration <= MAX_ITERATIONS);

    if (iteration <= MAX_ITERATIONS && !evalCondition(newSteps[newSteps.length - 1]?.value ?? current)) {
      const conditionMet = evalCondition(current);
      newSteps.push({ iteration, value: current, conditionMet });
    } else if (iteration > MAX_ITERATIONS) {
      newSteps.push({ iteration: MAX_ITERATIONS, value: current, conditionMet: false });
    }

    setSteps(newSteps);
  };

  const directionHint = useMemo(() => {
    if (comparison === 'greaterOrEqual' && step <= 0) {
      return language === 'ar'
        ? '⚠️ لبلوغ الشرط، يجب أن يكون مقدار التغيير موجبًا.'
        : '⚠️ To reach the condition, the step should be positive.';
    }

    if (comparison === 'lessOrEqual' && step >= 0) {
      return language === 'ar'
        ? '⚠️ لبلوغ الشرط، يجب أن يكون مقدار التغيير سالبًا.'
        : '⚠️ To reach the condition, the step should be negative.';
    }

    return '';
  }, [comparison, language, step]);

  return (
    <main>
      <div className="container">
        <header className="header">
          <div className="language-toggle">
            <button
              type="button"
              className={language === 'ar' ? 'active' : ''}
              onClick={() => setLanguage('ar')}
            >
              العربية
            </button>
            <button
              type="button"
              className={language === 'en' ? 'active' : ''}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
          </div>
          <span className="badge">Do Until Loop</span>
          <h1 className="title">{t.title}</h1>
          <p className="subtitle">{t.subtitle}</p>
        </header>

        <section className="card-grid">
          <article className="card">
            <h2 className="section-title">{t.overviewTitle}</h2>
            <p className="paragraph">{t.overview}</p>
          </article>

          <article className="card">
            <h2 className="section-title">{t.anatomyTitle}</h2>
            <div className="paragraph">
              {t.anatomy.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </article>

          <article className="card">
            <h2 className="section-title">{t.simulationTitle}</h2>
            <div className="controls">
              <div className="control-card">
                <label htmlFor="start">{t.inputs.start}</label>
                <input
                  id="start"
                  type="number"
                  value={startValue}
                  onChange={(event) => setStartValue(Number(event.target.value))}
                />
              </div>
              <div className="control-card">
                <label htmlFor="target">{t.inputs.target}</label>
                <input
                  id="target"
                  type="number"
                  value={targetValue}
                  onChange={(event) => setTargetValue(Number(event.target.value))}
                />
              </div>
              <div className="control-card">
                <label htmlFor="step">{t.inputs.step}</label>
                <input
                  id="step"
                  type="number"
                  value={step}
                  onChange={(event) => setStep(Number(event.target.value))}
                />
              </div>
              <div className="control-card">
                <label htmlFor="condition">{t.inputs.condition}</label>
                <select
                  id="condition"
                  value={comparison}
                  onChange={(event) => setComparison(event.target.value as Comparison)}
                >
                  <option value="greaterOrEqual">{t.conditions.greaterOrEqual}</option>
                  <option value="lessOrEqual">{t.conditions.lessOrEqual}</option>
                </select>
              </div>
            </div>
            {directionHint ? <p className="paragraph">{directionHint}</p> : null}
            <button type="button" onClick={runLoop}>
              {t.runButton}
            </button>
            <div>
              <h3 className="section-title">{t.timelineTitle}</h3>
              {steps.length === 0 ? (
                <p className="paragraph">{t.timelineEmpty}</p>
              ) : (
                <div className="timeline">
                  {steps.map((item) => (
                    <div className="timeline-step" key={item.iteration}>
                      <span className="step-index">{item.iteration}</span>
                      <div className="step-body">
                        <strong>
                          {language === 'ar' ? 'القيمة الحالية' : 'Current value'}: {item.value}
                        </strong>
                        <span>
                          {item.conditionMet
                            ? language === 'ar'
                              ? '✅ الشرط تحقق، توقفت الحلقة.'
                              : '✅ Condition met, loop stopped.'
                            : language === 'ar'
                              ? '♻️ الشرط لم يتحقق بعد، تواصل الحلقة.'
                              : '♻️ Condition false, loop continues.'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>

          <article className="card">
            <h2 className="section-title">{t.codeTitle}</h2>
            <pre className="code-block">
              <code>
                {t.codeLines.join('\n')}
              </code>
            </pre>
          </article>
        </section>
      </div>
    </main>
  );
}
