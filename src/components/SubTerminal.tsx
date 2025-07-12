import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/SubTerminal.module.css";
import clueContent from "../data/clue.sh.json";
import secretContent from "../data/secret.sh.json";

interface SubTerminalProps {
  file: string; // 'clue.sh' or 'secret.sh'
  onClose: () => void;
}

const TYPE_SPEED = 5;

const SubTerminal: React.FC<SubTerminalProps> = ({ file, onClose }) => {
  const [displayed, setDisplayed] = useState("");
  const idxRef = useRef(0);

  // Get content based on file
  const getContent = () => {
    switch (file) {
      case 'clue.sh':
        return clueContent.content;
      case 'secret.sh':
        return secretContent.content;
      default:
        return 'File not found';
    }
  };

  useEffect(() => {
    setDisplayed("");
    idxRef.current = 0;
    const content = getContent();
    const type = () => {
      if (idxRef.current < content.length) {
        setDisplayed((prev) => prev + content[idxRef.current]);
        idxRef.current++;
        setTimeout(type, TYPE_SPEED);
      }
    };
    type();
  }, [file]);

  return (
    <div className={styles.overlay}>
      <div className={styles.subTerminalBox}>
        <button className={styles.exitButton} onClick={onClose}>
          ×
        </button>
        <pre className={styles.terminalText}>{displayed}</pre>
      </div>
    </div>
  );
};

export default SubTerminal; 