import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import {
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { notesCollection, db } from "./firebase";

export default function App() {
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");
  const [tempNoteText, setTempNoteText] = React.useState("");

  // Sort notes by updatedAt descending (newest first)
  const sortedNotes = notes.slice().sort((a, b) => b.updatedAt - a.updatedAt);

  // Current note based on selected id or fallback to first note
  const currentNote =
    notes.find((note) => note.id === currentNoteId) || sortedNotes[0] || null;

  // Real-time subscription to Firestore notes collection
  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

  // When notes change, if no currentNoteId, set the first note as current
  React.useEffect(() => {
    if (!currentNoteId && sortedNotes.length > 0) {
      setCurrentNoteId(sortedNotes[0].id);
    }
  }, [sortedNotes, currentNoteId]);

  // Sync tempNoteText when currentNote changes
  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);

  // Debounce update note in Firestore on tempNoteText change
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentNote && tempNoteText !== currentNote.body) {
        updateNote(tempNoteText);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [tempNoteText]);

  // Create a new note
  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  // Update a note in Firestore
  async function updateNote(text) {
    const docRef = doc(db, "notes", currentNoteId);
    await setDoc(
      docRef,
      {
        body: text,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  }

  // Delete a note from Firestore
  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
    if (noteId === currentNoteId) {
      setCurrentNoteId("");
    }
  }

  return (
    <main style={{ height: "100vh" }}>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          <Editor tempNoteText={tempNoteText} setTempNoteText={setTempNoteText} />
        </Split>
      ) : (
        <div className="no-notes" style={{ textAlign: "center", marginTop: "3rem" }}>
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
