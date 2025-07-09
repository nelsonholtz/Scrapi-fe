const handleUndo = ({ history, historyStep, setPosition }) => {
  if (historyStep.current === 0) {
    return;
  }
  historyStep.current -= 1;
  const previous = history.current[historyStep.current];
  setPosition(previous);
};

const handleRedo = ({ history, historyStep, setPosition }) => {
  if (historyStep.current === history.current.length - 1) {
    return;
  }
  historyStep.current += 1;
  const next = history.current[historyStep.current];
  setPosition(next);
};

export default { handleRedo, handleUndo };
