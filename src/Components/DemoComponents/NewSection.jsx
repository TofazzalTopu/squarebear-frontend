import { useState, useRef } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

function NewSection() {
  const ref = useRef();
  const [isModalOpen, setModalOpen] = useState(false);
  const newSection = () => {
    setModalOpen(false);
  };

  useOnClickOutside(ref, newSection);

  return (
    <div>
      {isModalOpen ? (
        <div ref={ref}>
          <h1>Azim </h1>
          <h1>Azim </h1>
          <h1>Azim </h1>
          <h1>Azim </h1>
        </div>
      ) : (
        <button onClick={() => setModalOpen(true)}>Open Modal</button>
      )}
    </div>
  );
}
export default NewSection;
