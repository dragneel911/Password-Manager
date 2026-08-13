import zxcvbn from 'zxcvbn';

const LABELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];

function StrengthMeter({ password }) {
  if (!password) return null;
  const { score } = zxcvbn(password);
  return (
    <div>
      <progress value={score} max={4} />
      <span>{LABELS[score]}</span>
    </div>
  );
}

export default StrengthMeter;
