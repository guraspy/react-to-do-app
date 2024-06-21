import React, { useState, useEffect, ChangeEvent } from "react";
import "./App.css";

interface Note {
  text: string;
  isChecked: boolean;
}

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleButtonClick = () => {
    setIsPopupVisible(true);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      if (editIndex !== null) {
        const updatedNotes = [...notes];
        updatedNotes[editIndex] = { ...updatedNotes[editIndex], text: newNote };
        setNotes(updatedNotes);
        setEditIndex(null);
      } else {
        setNotes([...notes, { text: newNote, isChecked: false }]);
      }
      setNewNote("");
      setIsPopupVisible(false);
    }
  };

  const handleNoteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleCheck = (index: number) => {
    setNotes(
      notes.map((note, i) =>
        i === index ? { ...note, isChecked: !note.isChecked } : note
      )
    );
  };

  const handleEditNote = (index: number) => {
    setNewNote(notes[index].text);
    setEditIndex(index);
    setIsPopupVisible(true);
  };

  const handleRemoveNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <br />
      <br />
      <div className="center">
        <h3>TODO LIST</h3>
        <br />
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="searchBar"
            type="text"
            placeholder="   Search note..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit" className="searchButton">
            <img className="searchButton" src="Vector.png" alt="Search" />
          </button>
          <div className="dropdown">
            <button className="dropbtn">ALL ˅</button>
            <div className="dropdown-content">
              <a href="#">All</a>
              <a href="#">Complete</a>
              <a href="#">Incomplete</a>
            </div>
          </div>
          <button className="footerButton">
            <img src="Night_Button.png" alt="Day/Night" className="day_night" />
          </button>
        </form>
      </div>

      <div className="footer">
        <button className="footerButton" onClick={handleButtonClick}>
          <img src="Plus_Button.png" alt="Add Note" />
        </button>
      </div>

      <div className="noteStyle">
        {isPopupVisible && (
          <div className="popup">
            <center>
              <h3>{editIndex !== null ? "EDIT NOTE" : "NEW NOTE"}</h3>
            </center>
            <div className="popup-content">
              <textarea
                value={newNote}
                onChange={handleNoteChange}
                placeholder="Input your note"
              />
              <div className="popup-buttons">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setIsPopupVisible(false);
                    setEditIndex(null);
                    setNewNote("");
                  }}
                >
                  Cancel
                </button>
                <button className="apply-button" onClick={handleAddNote}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="notes">
          {filteredNotes.length === 0 ? (
            <div className="empty-div">
              <img
                src="no-notes-image.png"
                alt="No notes"
                className="no-notes-image"
              />
              <center>
                <h3>Empty...</h3>
              </center>
            </div>
          ) : (
            filteredNotes.map((note, index) => (
              <div
                key={index}
                className={`note ${note.isChecked ? "checked" : ""}`}
              >
                <label className="container">
                  <input
                    type="checkbox"
                    checked={note.isChecked}
                    onChange={() => toggleCheck(index)}
                  />
                  <span className="checkmark"></span>
                </label>
                <div className="note-content">
                  <div className="note-text">{note.text}</div>
                  <div className="button-group">
                    <button
                      className="edit-button"
                      onClick={() => handleEditNote(index)}
                    >
                      <img src="edit.png" alt="edit" />
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveNote(index)}
                    >
                      <img src="delete.png" alt="delete" />
                    </button>
                  </div>
                </div>
                <hr className="hr" />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default App;
