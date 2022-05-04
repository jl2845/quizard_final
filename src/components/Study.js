import React, { useState, useEffect } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { db } from "../firebase.js"
import { collection, onSnapshot, doc, addDoc, deleteDoc, getDoc, DocumentSnapshot } from "firebase/firestore"
import "../css/dashboard.css"


export default function Study() {
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

  const handleDashboard = () => {
    window.location.href = "./"
  }

  const studySet = localStorage.getItem("studySetName")
  const docRef = doc(db, "flashcards", studySet)

  const [studyQuestions, setStudyQuestions] = useState([])
  const [studyAnswers, setStudyAnswers] = useState([])

  async function getData() {
    const docSnap = await getDoc(docRef)
    setStudyQuestions(docSnap.data().questions)
    setStudyAnswers(docSnap.data().answers)
  }
  
  getData()

	const [input, setInput] = useState('')
	const [current, setCurrent] = useState(0)
	
	const [streak, setStreak] = useState(0)
	const [maxStreak, setMaxStreak] = useState(0)

	const setRandomQuestion = () => {
		const randomIndex = Math.floor(Math.random() * studyQuestions.length)
		setCurrent(randomIndex)
	}

	const handleChange = (e) => {
		setInput(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		 
		if (input.toLowerCase() === studyAnswers[current]) {
			setStreak(streak + 1)
			setMaxStreak(streak + 1 > maxStreak ? streak + 1 : maxStreak)
			setError(false)

			localStorage.setItem('streak', streak + 1)
			localStorage.setItem('maxStreak', streak + 1 > maxStreak ? streak + 1 : maxStreak)
		} else {
			const q = studyQuestions[current]
			const a = studyAnswers[current]
			setError(`Wrong! The correct answer for ${q} is ${a}`)
			setStreak(0)
			localStorage.setItem('streak', 0)
		}

		setInput('')
		setRandomQuestion()
	}

	useEffect(() => {
		setRandomQuestion()
		setStreak(parseInt(localStorage.getItem('streak')) || 0)
		setMaxStreak(parseInt(localStorage.getItem('maxStreak')) || 0)
	}, [])

	return (
		<div className="min-h-screen bg-slate-800 text-black text-center">
			<header className="p-6 mb-8">
				<h1 className="text-2xl font-bold uppercase">Flashcard Quiz</h1>
				<div>
					<p>{streak} / {maxStreak}</p>
				</div>
			</header>

			<div className="text-9xl font-bold mb-8">
				<p>{studyQuestions[current]}</p>
			</div>

			<div className="mb-8">
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						onChange={handleChange}
						value={input}
						className="block w-24 bg-transparent border-b-2 border-b-white mx-auto outline-none text-center text-6xl pb-2" />
				</form>
			</div>
			{error && 
				<div>
					<p>{ error }</p>
				</div>
			}
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleDashboard}>
          Dashboard
        </Button>
      </div>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
		</div>
	)
}
