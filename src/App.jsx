import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { nanoid } from "nanoid"

export default function App() {
  const [notes, setNotes] = React.useState(() => {
    return JSON.parse(localStorage.getItem("notes")) || []
  })

  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  )

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "Start writing your note here..."
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  function updateNote(text) {
    setNotes(oldNotes =>
      oldNotes.map(note =>
        note.id === currentNoteId
          ? { ...note, body: text }
          : note
      )
    )
  }

  function deleteNote(noteId) {
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
  }

  function findCurrentNote() {
    return notes.find(note => note.id === currentNoteId) || notes[0]
  }

  return (
    <main>
      {
        notes.length > 0
          ? <>
              <Sidebar 
                notes={notes}
                currentNote={findCurrentNote()}
                setCurrentNoteId={setCurrentNoteId}
                newNote={createNewNote}
                deleteNote={deleteNote}
              />
              <Editor 
                currentNote={findCurrentNote()}
                updateNote={updateNote}
              />
            </>
          : <div className="no-notes">
              <h1>No notes yet</h1>
              <button className="new-note" onClick={createNewNote}>
                Create one now
              </button>
            </div>
      }
    </main>
  )
}
