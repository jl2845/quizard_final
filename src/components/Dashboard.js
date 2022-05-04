import React, { useState, useEffect } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { db } from "../firebase.js"
import { collection, onSnapshot, doc, addDoc, deleteDoc } from "firebase/firestore"
import "../css/dashboard.css"


export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  const [flashcards, setflashcards] = useState([])
  const [form, setForm] = useState({
    title: "",
    desc: "",
    questions: [],
    answers: []
  })
  const [popupActive, setPopupActive] = useState(false)

  const flashcardsCollectionRef = collection(db, "flashcards")

  useEffect(() => {
    onSnapshot(flashcardsCollectionRef, snapshot => {
      setflashcards(snapshot.docs.map(doc => {
        return {
          id: doc.id,
          viewing: false,
          ...doc.data()
        }
      }))
    })
  }, [])

  const handleView = id => {
    const flashcardsClone = [...flashcards]

    flashcardsClone.forEach(flashcard => {
      if (flashcard.id === id) {
        flashcard.viewing = !flashcard.viewing
      } else {
        flashcard.viewing = false
      }
    })

    setflashcards(flashcardsClone)
  }

  const handleStudy = id => {
    window.location.href = "./study"
    const studySet = id
    localStorage.setItem("studySetName", studySet);
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (
      !form.title ||
      !form.desc ||
      !form.questions ||
      !form.answers
    ) {
      alert("Please fill out all fields")
      return
    }

    addDoc(flashcardsCollectionRef, form)

    setForm({
      title: "",
      desc: "",
      questions: [],
      answers: []
    })

    setPopupActive(false)
  }

  const handlequestion = (e, i) => {
    const questionsClone = [...form.questions]

    questionsClone[i] = e.target.value

    setForm({
      ...form,
      questions: questionsClone
    })
  }

  const handleanswer = (e, i) => {
    const answersClone = [...form.answers]

    answersClone[i] = e.target.value

    setForm({
      ...form,
      answers: answersClone
    })
  }

  const handlequestionCount = () => {
    setForm({
      ...form,
      questions: [...form.questions, ""]
    })
  }

  const handleanswerCount = () => {
    setForm({
      ...form,
      answers: [...form.answers, ""]
    })
  }

  const removeflashcard = id => {
    deleteDoc(doc(db, "flashcards", id))
  }

  return (
    <div className="App">
      <h1>My flashcards</h1>

      <button onClick={() => setPopupActive(!popupActive)}>Add flashcards</button>

      <div className="flashcards">
        { flashcards.map((flashcard, i) => (
          <div className="flashcard" key={flashcard.id}>
            <h3>{ flashcard.title }</h3>

            <p dangerouslySetInnerHTML={{ __html: flashcard.desc }}></p>

            { flashcard.viewing && <div>
              <h4>questions</h4>
              <ul>
                { flashcard.questions.map((question, i) => (
                  <li key={i}>{ question }</li>
                ))}
              </ul>

              <h4>answers</h4>
              <ol>
                { flashcard.answers.map((answer, i) => (
                  <li key={i}>{ answer }</li>
                ))}
              </ol>
            </div>}

            <div className="buttons">
              <button onClick={() => handleView(flashcard.id)}>View { flashcard.viewing ? 'less' : 'more' }</button>
              <button onClick={() => handleStudy(flashcard.id)}>Study</button>
              <button className="remove" onClick={() => removeflashcard(flashcard.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      { popupActive && <div className="popup">
        <div className="popup-inner">
          <h2>Add a new flashcard</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                type="text" 
                value={form.desc} 
                onChange={e => setForm({...form, desc: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Questions</label>
              {
                form.questions.map((question, i) => (
                  <input 
                    type="text"
                    key={i}
                    value={question} 
                    onChange={e => handlequestion(e, i)} />
                ))
              }
              <button type="button" onClick={handlequestionCount}>Add question</button>
            </div>

            <div className="form-group">
              <label>Answers</label>
              {
                form.answers.map((answer, i) => (
                  <textarea 
                    type="text"
                    key={i}
                    value={answer} 
                    onChange={e => handleanswer(e, i)} />
                ))
              }
              <button type="button" onClick={handleanswerCount}>Add answer</button>
            </div>

            <div className="buttons">
              <button type="submit">Submit</button>
              <button type="button" class="remove" onClick={() => setPopupActive(false)}>Close</button>
            </div>

          </form>
        </div>
      </div>}

      <div>
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

    </div>
  );
}