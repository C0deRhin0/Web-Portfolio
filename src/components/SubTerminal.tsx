import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/SubTerminal.module.css";

interface SubTerminalProps {
  content: string;
  onClose: () => void;
}

const TYPE_SPEED = 40;

const SubTerminal: React.FC<SubTerminalProps> = ({ content, onClose }) => {
  const [displayed, setDisplayed] = useState("");
  const idxRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    idxRef.current = 0;
    const type = () => {
      if (idxRef.current < content.length) {
        setDisplayed((prev) => prev + content[idxRef.current]);
        idxRef.current++;
        setTimeout(type, TYPE_SPEED);
      }
    };
    type();
  }, [content]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className={styles.overlay}>
      <div className={styles.subTerminalBox}>
        <pre className={styles.terminalText}>{displayed}</pre>
        <div className={styles.escNote}>click anywhere here and press esc key to exit</div>
      </div>
    </div>
  );
};

export default SubTerminal; 