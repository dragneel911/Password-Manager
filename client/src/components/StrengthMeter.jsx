import zxcvbn from 'zxcvbn';

const LABELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];

function StrengthMeter({ password }) {
  if (!password) return null;
  const { score, feedback } = zxcvbn(password);
  const hasTips = feedback.warning || feedback.suggestions.length > 0;
  return (
    <div>
      <progress value={score} max={4} />
      <span>{LABELS[score]}</span>
      {hasTips && (
        <div className="strength-tips">
          {feedback.warning && <p className="strength-warning">{feedback.warning}</p>}
          {feedback.suggestions.length > 0 && (
            <ul>
              {feedback.suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default StrengthMeter;
