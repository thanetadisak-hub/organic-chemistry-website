import React, { useMemo, useState } from 'react';

const pathways = {
  SN1: [
    'Step 1 (slow): Leaving group departs to form a carbocation.',
    'Step 2 (fast): Nucleophile attacks planar carbocation.',
    'Step 3: Deprotonation if nucleophile was neutral.'
  ],
  SN2: [
    'Single concerted step: nucleophile attacks as leaving group leaves.',
    'Backside attack gives inversion of configuration.',
    'Rate depends on both substrate and nucleophile.'
  ],
  E1: [
    'Step 1 (slow): Leaving group departs to form carbocation.',
    'Step 2 (fast): Base removes β-hydrogen.',
    'Step 3: π bond forms (alkene product).'
  ],
  E2: [
    'Single concerted step: base removes β-hydrogen while LG leaves.',
    'Anti-periplanar geometry is required.',
    'Strong base favors elimination.'
  ]
};

const reactionFacts = [
  { reaction: 'SN1', molecularity: 'Unimolecular (rate = k[RX])', substrate: '3° > 2° >> 1°', nucleophile: 'Weak/neutral OK', stereochemistry: 'Racemization tendency', solvent: 'Polar protic' },
  { reaction: 'SN2', molecularity: 'Bimolecular (rate = k[RX][Nu⁻])', substrate: 'CH₃ > 1° > 2° (no 3°)', nucleophile: 'Strong nucleophile preferred', stereochemistry: 'Inversion (Walden)', solvent: 'Polar aprotic' },
  { reaction: 'E1', molecularity: 'Unimolecular (rate = k[RX])', substrate: '3° > 2°', nucleophile: 'Weak base sufficient', stereochemistry: 'Not stereospecific', solvent: 'Polar protic' },
  { reaction: 'E2', molecularity: 'Bimolecular (rate = k[RX][Base])', substrate: '3°, 2°, 1° possible', nucleophile: 'Strong base required', stereochemistry: 'Anti elimination', solvent: 'Often polar aprotic' }
];

const quizBank = [
  {
    prompt: 'A tertiary alkyl bromide in methanol at room temperature most likely undergoes:',
    choices: ['SN2', 'SN1/E1', 'E2 only', 'No reaction'],
    answer: 1,
    explain: 'Tertiary carbocations are stabilized and methanol is polar protic, favoring SN1/E1.'
  },
  {
    prompt: 'Which condition best favors SN2?',
    choices: ['Tertiary substrate, weak nucleophile', 'Primary substrate, strong nucleophile, polar aprotic solvent', 'Primary substrate, weak base, polar protic solvent', 'Carbocation intermediate required'],
    answer: 1,
    explain: 'SN2 requires backside attack and is fastest with less hindered substrates in polar aprotic solvents.'
  },
  {
    prompt: 'E2 reactions require what key geometric relationship?',
    choices: ['Syn-coplanar', 'Anti-periplanar', 'Random orientation', 'Planar carbocation'],
    answer: 1,
    explain: 'Anti-periplanar C-H and C-LG alignment allows concerted elimination orbital overlap.'
  }
];

function MechanismAnimation({ mode }) {
  const progressClass = `progress-${mode.toLowerCase()}`;
  return (
    <div className="mechanism-card">
      <h3>{mode} Mechanism</h3>
      <svg viewBox="0 0 800 220" className="mechanism-svg" role="img" aria-label={`${mode} mechanism with curved-arrow electron movement`}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#60a5fa" />
          </marker>
          <marker id="greenhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#34d399" />
          </marker>
        </defs>

        <rect x="35" y="65" width="165" height="84" rx="16" className="state-box" />
        <text x="52" y="95">Nu: / Base:</text>
        <text x="52" y="122">R-CH₂-CH₂-LG</text>

        <rect x="320" y="65" width="165" height="84" rx="16" className="state-box mid" />
        <text x="336" y="95">Transition /</text>
        <text x="336" y="122">Carbocation</text>

        <rect x="600" y="65" width="165" height="84" rx="16" className="state-box end" />
        <text x="620" y="95">Product</text>
        <text x="620" y="122">Substitution or Alkene</text>

        <path d="M 105 172 C 175 218, 275 218, 344 172" className={`electron-arrow ${progressClass}`} markerEnd="url(#arrowhead)"/>
        <path d="M 415 172 C 495 212, 560 212, 634 172" className={`electron-arrow secondary ${progressClass}`} markerEnd="url(#greenhead)"/>
      </svg>
      <ol>
        {pathways[mode].map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

export default function App() {
  const [activeMode, setActiveMode] = useState('SN1');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const question = quizBank[quizIndex];
  const finished = quizIndex === quizBank.length;

  const feedback = useMemo(() => {
    if (!revealed || selected === null) return '';
    return selected === question.answer ? 'Correct! 🎉' : 'Not quite — review the explanation below.';
  }, [revealed, selected, question]);

  const submitAnswer = () => {
    if (selected === null || revealed) return;
    if (selected === question.answer) setScore((s) => s + 1);
    setRevealed(true);
  };

  const nextQuestion = () => {
    setSelected(null);
    setRevealed(false);
    setQuizIndex((i) => i + 1);
  };

  return (
    <div className="app">
      <header className="hero">
        <h1>SN1, SN2, E1 & E2 Reaction Explorer</h1>
        <p>Interactive undergraduate-level guide to substitution and elimination with mechanism visuals, curved-arrow electron flow, and exam-style practice.</p>
      </header>

      <section className="modes">
        {Object.keys(pathways).map((mode) => (
          <button key={mode} className={mode === activeMode ? 'tab active' : 'tab'} onClick={() => setActiveMode(mode)}>
            {mode}
          </button>
        ))}
      </section>

      <MechanismAnimation mode={activeMode} />

      <section className="table-wrap">
        <h2>Reaction Comparison Table</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Reaction</th><th>Molecularity / Rate Law</th><th>Favored Substrate</th><th>Nucleophile / Base</th><th>Stereochemical Outcome</th><th>Typical Solvent</th>
              </tr>
            </thead>
            <tbody>
              {reactionFacts.map((row) => (
                <tr key={row.reaction}>
                  <td>{row.reaction}</td><td>{row.molecularity}</td><td>{row.substrate}</td><td>{row.nucleophile}</td><td>{row.stereochemistry}</td><td>{row.solvent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="quiz">
        <h2>Practice Quiz</h2>
        {!finished ? (
          <div className="quiz-card">
            <p className="q-count">Question {quizIndex + 1} of {quizBank.length}</p>
            <h3>{question.prompt}</h3>
            <div className="choices">
              {question.choices.map((choice, i) => (
                <button key={choice} onClick={() => setSelected(i)} className={`choice ${selected === i ? 'picked' : ''}`}>
                  {choice}
                </button>
              ))}
            </div>
            <div className="quiz-actions">
              <button onClick={submitAnswer} className="primary">Check Answer</button>
              {revealed && <button onClick={nextQuestion} className="secondary-btn">Next</button>}
            </div>
            {revealed && (
              <div className="feedback">
                <p>{feedback}</p>
                <p>{question.explain}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="quiz-card">
            <h3>Quiz Complete</h3>
            <p>Your score: {score}/{quizBank.length}</p>
          </div>
        )}
      </section>
    </div>
  );
}
