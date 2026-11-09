// ///////////////////////////////////
// FOR TIMER
// ///////////////////////////////////

let seconds = 1500;
let running = false;
let id = null;

const focusTab = document.getElementById("focusTab");
const shortBreakTab = document.getElementById("shortBreakTab");
const longBreakTab = document.getElementById("longBreakTab");

const timerNumber = document.querySelector(".number");
const sessionText = document.querySelector(".session");
const clock = document.getElementById("clock");
const start = document.getElementById("start");
const mins = document.getElementById("mins");


// TIMER RENDER

function render() {

    if (!clock) return;

    clock.textContent =
        String(Math.floor(seconds / 60)).padStart(2, "0") +
        ":" +
        String(seconds % 60).padStart(2, "0");
}


// TIMER START / PAUSE

function toggle() {

    if (!start) return;

    if (running) {

        clearInterval(id);

        running = false;

        start.textContent = "▶ START";

    } else {

        running = true;

        start.textContent = "Ⅱ PAUSE";

        id = setInterval(() => {

            if (seconds <= 0) {

                clearInterval(id);

                running = false;

                if (
                    focusTab &&
                    focusTab.classList.contains("active")
                ) {

                    alert(
                        "Focus session complete! Time for a short break."
                    );

                    changeMode(
                        5,
                        "Short Break",
                        shortBreakTab
                    );

                } else if (
                    shortBreakTab &&
                    shortBreakTab.classList.contains("active")
                ) {

                    alert(
                        "Short break complete! Back to focus."
                    );

                    changeMode(
                        25,
                        "Focus",
                        focusTab
                    );

                } else if (
                    longBreakTab &&
                    longBreakTab.classList.contains("active")
                ) {

                    alert(
                        "Long break complete! Back to focus."
                    );

                    changeMode(
                        25,
                        "Focus",
                        focusTab
                    );
                }

                return;
            }

            seconds--;

            render();

        }, 1000);
    }
}


// RESET TIMER

function reset() {

    clearInterval(id);

    running = false;

    if (
        longBreakTab &&
        longBreakTab.classList.contains("active")
    ) {

        seconds = 15 * 60;

    } else if (
        shortBreakTab &&
        shortBreakTab.classList.contains("active")
    ) {

        seconds = 5 * 60;

    } else {

        seconds = 25 * 60;
    }

    if (start) {
        start.textContent = "▶ START";
    }

    render();
}


// CUSTOM TIMER

function custom() {

    if (!mins) return;

    let m = parseInt(mins.value);

    if (m > 0 && m <= 180) {

        clearInterval(id);

        running = false;

        seconds = m * 60;

        if (start) {
            start.textContent = "▶ START";
        }

        render();
    }
}


// TIMER MENU

function toggleMenu() {

    const timerMenu = document.getElementById("timerMenu");

    if (timerMenu) {
        timerMenu.classList.toggle("show");
    }
}


// CHANGE TIMER MODE

function changeMode(minutes, name, activeTab) {

    if (!timerNumber || !sessionText || !activeTab) {
        return;
    }

    clearInterval(id);

    running = false;

    seconds = minutes * 60;

    timerNumber.textContent =
        `${String(minutes).padStart(2, "0")}:00`;

    sessionText.textContent =
        `• ${name} session`;

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    activeTab.classList.add("active");

    if (start) {
        start.textContent = "▶ START";
    }

    render();
}


// TIMER TAB EVENTS

if (focusTab && shortBreakTab && longBreakTab) {

    focusTab.addEventListener("click", function () {

        changeMode(
            25,
            "Focus",
            focusTab
        );

    });


    shortBreakTab.addEventListener("click", function () {

        changeMode(
            5,
            "Short Break",
            shortBreakTab
        );

    });


    longBreakTab.addEventListener("click", function () {

        changeMode(
            15,
            "Long Break",
            longBreakTab
        );

    });

}


// ///////////////////////////////////
// BOOK SEARCH
// ///////////////////////////////////


/* =========================================
   STUDYBUDDY BOOK LIBRARY
========================================= */

const bookSearch = document.getElementById("bookSearch");
const bookGrid = document.getElementById("bookGrid");
const bookCount = document.getElementById("bookCount");
const selectedCount = document.getElementById("selectedCount");
const useSelectedBooks = document.getElementById("useSelectedBooks");

if (bookGrid) {

    const selectedBooks = new Set(
        JSON.parse(localStorage.getItem("selectedBooks") || "[]")
    );

    let allBooks = [];

    function updateSelectedCount() {
        selectedCount.textContent =
            `${selectedBooks.size} book${selectedBooks.size === 1 ? "" : "s"} selected`;

        localStorage.setItem(
            "selectedBooks",
            JSON.stringify([...selectedBooks])
        );
    }

   
function renderBooks() {

    const searchText = bookSearch.value.toLowerCase().trim();

    bookGrid.innerHTML = "";

    const filteredBooks = allBooks.filter(filename =>
        filename.toLowerCase().includes(searchText)
    );

    // Create a new shelf row after every 5 books
    for (let i = 0; i < filteredBooks.length; i += 5) {

        const row = document.createElement("div");
        row.className = "bookrow";

        const rowBooks = filteredBooks.slice(i, i + 5);

        rowBooks.forEach(filename => {

            const card = document.createElement("div");
            card.className = "book";

            const isSelected = selectedBooks.has(filename);

            if (isSelected) {
                card.classList.add("selected");
            }

            const cover = document.createElement("div");
            cover.className = `cover cover-tone-${allBooks.indexOf(filename) % 10}`;

            const title = document.createElement("strong");
            title.textContent = filename
                .replace(/\.pdf$/i, "")
                .replace(/[_-]/g, " ");

            const subtitle = document.createElement("span");
            subtitle.textContent = "PDF Reference";

            const name = document.createElement("div");
            name.className = "bookname";
            name.textContent = filename.replace(/\.pdf$/i, "");

            const status = document.createElement("small");
            status.className = "book-selection-status";
            status.textContent = isSelected ? "✓ Selected" : "Select book";

            cover.append(title, subtitle);
            card.append(cover, name, status);

            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-pressed", String(isSelected));

            function toggleBook() {
                if (selectedBooks.has(filename)) {
                    selectedBooks.delete(filename);
                } else {
                    selectedBooks.add(filename);
                }

                updateSelectedCount();
                renderBooks();
            }

            card.addEventListener("click", toggleBook);

            card.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleBook();
                }
            });

            row.appendChild(card);
        });

        bookGrid.appendChild(row);

        // Draw a shelf line after each group of 5
        if (i + 5 < filteredBooks.length) {
            const line = document.createElement("div");
            line.className = "shelfline";
            bookGrid.appendChild(line);
        }
    }

    bookCount.textContent =
        `${filteredBooks.length} of ${allBooks.length} books`;
}

    bookSearch.addEventListener("input", renderBooks);

    fetch("/api/books")
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load books");
            }
            return response.json();
        })
        .then(data => {
            allBooks = data.books || [];
            renderBooks();
            updateSelectedCount();
        })
        .catch(error => {
            console.error("Book loading error:", error);
            bookCount.textContent = "Could not load books.";
        });

    useSelectedBooks.addEventListener("click", () => {
        if (selectedBooks.size === 0) {
            alert("Please select at least one book first.");
            return;
        }

        window.location.href = "/chat";
    });
}



/* =========================================
   BOOK SELECTION
========================================= */

// const selectedBooks = new Set();

// books.forEach(function (book) {

//     book.addEventListener("click", function () {

//         const bookName = book.dataset.filename;

//         if (!bookName) {
//             console.error("This book has no PDF filename assigned.");
//             return;
//         }

//         if (selectedBooks.has(bookName)) {
//             selectedBooks.delete(bookName);
//             book.classList.remove("selected");
//         } else {
//             selectedBooks.add(bookName);
//             book.classList.add("selected");
//         }

//         console.log("Selected books:", [...selectedBooks]);
//     });

// });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
// ///////////////////////////////////
// NOTES
// ///////////////////////////////////


const notesContainer =
    document.getElementById("notesContainer");

const newNoteBtn =
    document.getElementById("newNoteBtn");

const editorOverlay =
    document.getElementById("editorOverlay");

const closeEditor =
    document.getElementById("closeEditor");

const noteTitle =
    document.getElementById("noteTitle");

const noteContent =
    document.getElementById("noteContent");

const saveStatus =
    document.getElementById("saveStatus");

const deleteNoteBtn =
    document.getElementById("deleteNote");

const searchNotes =
    document.getElementById("searchNotes");


// ONLY RUN NOTES CODE ON NOTES PAGE

if (notesContainer) {

    let notes = [];

try {
    const savedNotes =
        localStorage.getItem("studyBuddyNotes");

    notes = savedNotes ? JSON.parse(savedNotes) : [];

    if (!Array.isArray(notes)) {
        notes = [];
    }
} catch (error) {
    console.error("Could not load saved notes:", error);
    notes = [];
}

let currentNoteId = null;


    // SAVE NOTES TO LOCAL STORAGE

    function saveNotes() {

        localStorage.setItem(
            "studyBuddyNotes",
            JSON.stringify(notes)
        );

    }


    // ESCAPE HTML

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }


    // OPEN NOTE EDITOR

    function openEditor(note) {

        currentNoteId = note.id;

        noteTitle.value = note.title;

        noteContent.value = note.content;

        editorOverlay.classList.add("show");

        noteTitle.focus();

        saveStatus.textContent =
            "✓ Saved automatically";

    }


    // CLOSE NOTE EDITOR

    function closeNoteEditor() {

        editorOverlay.classList.remove("show");

        currentNoteId = null;

    }


    // CREATE NEW NOTE

    function createNote() {

        const newNote = {

            id: Date.now(),

            title: "Untitled Note",

            content: "",

            date: new Date().toLocaleDateString()

        };


        notes.unshift(newNote);

        saveNotes();

        renderNotes();

        openEditor(newNote);

    }


    // RENDER NOTES

    function renderNotes(filterText = "") {

        notesContainer.innerHTML = "";

        const searchText =
            filterText.toLowerCase().trim();


        const filteredNotes =
            notes.filter(function (note) {

                return (
                    note.title
                        .toLowerCase()
                        .includes(searchText)
                    ||
                    note.content
                        .toLowerCase()
                        .includes(searchText)
                );

            });


        // EMPTY STATE

        if (filteredNotes.length === 0) {

            notesContainer.innerHTML = `

                <div class="empty-notes">

                    <i class="fa-regular fa-note-sticky"></i>

                    <h3>
                        ${
                            searchText
                            ? "No notes found"
                            : "No notes yet"
                        }
                    </h3>

                    <p>
                        ${
                            searchText
                            ? "Try searching for something else."
                            : "Create your first note to get started."
                        }
                    </p>

                </div>

            `;

            return;
        }


        // CREATE NOTE CARDS

        filteredNotes.forEach(function (note) {

            const card =
                document.createElement("div");

            card.className = "note-card";


            card.innerHTML = `

                <button
                    class="note-delete"
                    title="Delete note"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

                <h3>
                    ${escapeHTML(note.title)}
                </h3>

                <p>
                    ${
                        escapeHTML(
                            note.content ||
                            "Start writing your note..."
                        )
                    }
                </p>

                <span class="note-date">
                    ${note.date}
                </span>

            `;


            // OPEN NOTE

            card.addEventListener(
                "click",
                function () {

                    openEditor(note);

                }
            );


            // DELETE ICON

            const deleteButton =
                card.querySelector(".note-delete");


            deleteButton.addEventListener(
                "click",
                function (event) {

                    // Prevent card from opening

                    event.stopPropagation();


                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this note?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    notes =
                        notes.filter(
                            function (item) {

                                return item.id !== note.id;

                            }
                        );


                    saveNotes();

                    renderNotes(
                        searchNotes.value
                    );

                }
            );


            notesContainer.appendChild(card);

        });

    }


    // AUTO SAVE

    function autoSave() {

        if (currentNoteId === null) {
            return;
        }


        const note =
            notes.find(
                function (item) {

                    return item.id === currentNoteId;

                }
            );


        if (!note) {
            return;
        }


        note.title =
            noteTitle.value.trim() ||
            "Untitled Note";


        note.content =
            noteContent.value;


        note.date =
            new Date().toLocaleDateString();


        saveNotes();


        renderNotes(
            searchNotes.value
        );


        saveStatus.textContent =
            "✓ Saved automatically";

    }


    // DELETE CURRENT NOTE FROM EDITOR

    function deleteCurrentNote() {

        if (currentNoteId === null) {
            return;
        }


        const confirmed =
            confirm(
                "Are you sure you want to delete this note?"
            );


        if (!confirmed) {
            return;
        }


        notes =
            notes.filter(
                function (note) {

                    return note.id !== currentNoteId;

                }
            );


        saveNotes();

        closeNoteEditor();

        renderNotes(
            searchNotes.value
        );

    }


    // NEW NOTE BUTTON

    newNoteBtn.addEventListener(
        "click",
        createNote
    );


    // CLOSE EDITOR

    closeEditor.addEventListener(
        "click",
        closeNoteEditor
    );


    // DELETE FROM EDITOR

    deleteNoteBtn.addEventListener(
        "click",
        deleteCurrentNote
    );


    // AUTO SAVE TITLE

    noteTitle.addEventListener(
        "input",
        autoSave
    );


    // AUTO SAVE CONTENT

    noteContent.addEventListener(
        "input",
        autoSave
    );


    // SEARCH NOTES

    searchNotes.addEventListener(
        "input",
        function () {

            renderNotes(
                searchNotes.value
            );

        }
    );


    // CLOSE EDITOR BY CLICKING OUTSIDE

    editorOverlay.addEventListener(
        "click",
        function (event) {

            if (event.target === editorOverlay) {

                closeNoteEditor();

            }

        }
    );


    // ESCAPE KEY

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                editorOverlay.classList.contains("show")
            ) {

                closeNoteEditor();

            }

        }
    );


    // LOAD SAVED NOTES

    renderNotes();

}
////////////FOR HAMBURGER MENU

document.addEventListener("DOMContentLoaded", () => {
    const page = document.querySelector(".notes-page");
    const toggle = document.getElementById("mobileMenuToggle");
    const sidebar = page?.querySelector(".sidebar");

    if (!page || !toggle || !sidebar) return;

    function closeMenu() {
        page.classList.remove("mobile-menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation menu");
        toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }

    function openMenu() {
        page.classList.add("mobile-menu-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close navigation menu");
        toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    }

    toggle.addEventListener("click", (event) => {
        event.stopPropagation();

        if (page.classList.contains("mobile-menu-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    sidebar.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (link) closeMenu();
        event.stopPropagation();
    });

    document.addEventListener("click", (event) => {
        if (
            page.classList.contains("mobile-menu-open") &&
            !sidebar.contains(event.target) &&
            !toggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
});

//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
// ///////////////////////////////////
// ///////////////////////////////////

// ==========================================
// STUDYBUDDY QUIZ
// ==========================================

// if (document.getElementById("quizPage")) {

//     const questions = [
//         {
//             question: "Which normal form removes partial dependency?",
//             options: ["1NF", "2NF", "3NF", "BCNF"],
//             answer: 1
//         },

//         {
//             question: "Which key uniquely identifies each record in a table?",
//             options: [
//                 "Foreign Key",
//                 "Candidate Key",
//                 "Primary Key",
//                 "Composite Key"
//             ],
//             answer: 2
//         },

//         {
//             question: "Which SQL command is used to retrieve data?",
//             options: [
//                 "INSERT",
//                 "UPDATE",
//                 "SELECT",
//                 "DELETE"
//             ],
//             answer: 2
//         },

//         {
//             question: "Which normal form removes transitive dependency?",
//             options: [
//                 "1NF",
//                 "2NF",
//                 "3NF",
//                 "4NF"
//             ],
//             answer: 2
//         },

//         {
//             question: "Which SQL command removes a table completely?",
//             options: [
//                 "DELETE",
//                 "REMOVE",
//                 "DROP",
//                 "CLEAR"
//             ],
//             answer: 2
//         }
//     ];

if (document.getElementById("quizPage")) {
    const topicSection = document.getElementById("quizTopicSection");
    const topicForm = document.getElementById("quizTopicForm");
    const topicInput = document.getElementById("quizTopic");
    const generateButton = document.getElementById("generateQuiz");
    const errorMessage = document.getElementById("quizError");

    const questionText = document.getElementById("questionText");
    const optionsContainer = document.getElementById("optionsContainer");
    const nextButton = document.getElementById("nextQuestion");
    const currentQuestion = document.getElementById("currentQuestion");
    const totalQuestions = document.getElementById("totalQuestions");

    const quizCard = document.querySelector(".quiz-card");
    const quizHeading = document.querySelector(".quiz-heading");
    const quizResult = document.getElementById("quizResult");

    const scoreNumber = document.getElementById("scoreNumber");
    const scoreTotal = document.getElementById("scoreTotal");
    const scoreMessage = document.getElementById("scoreMessage");
    const retryButton = document.getElementById("retryQuiz");

    if (
        !topicSection || !topicForm || !topicInput ||
        !generateButton || !errorMessage || !questionText ||
        !optionsContainer || !nextButton || !currentQuestion ||
        !totalQuestions || !quizCard || !quizHeading ||
        !quizResult || !scoreNumber || !scoreTotal ||
        !scoreMessage || !retryButton
    ) {
        console.error("Some StudyBuddy quiz elements are missing.");
    } else {
        let questions = [];
        let currentIndex = 0;
        let score = 0;
        let selectedAnswer = null;
        let answers = [];

        // Initial page: ask for a topic first.
        topicSection.style.display = "";
        quizCard.style.display = "none";
        quizResult.style.display = "none";
        errorMessage.textContent = "";

        totalQuestions.textContent = "5";
        scoreTotal.textContent = "5";

        async function startQuiz(topic) {
            generateButton.disabled = true;
            generateButton.textContent = "Generating...";
            errorMessage.textContent = "";

            try {
                const response = await fetch("/api/quiz", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ topic: topic })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Could not generate the quiz."
                    );
                }

                if (
                    !Array.isArray(data.questions) ||
                    data.questions.length !== 5
                ) {
                    throw new Error(
                        "The quiz did not contain exactly 5 questions."
                    );
                }

                // Check the returned question structure.
                for (const question of data.questions) {
                    if (
                        typeof question.question !== "string" ||
                        !Array.isArray(question.options) ||
                        question.options.length !== 4 ||
                        !Number.isInteger(question.answer) ||
                        question.answer < 0 ||
                        question.answer > 3
                    ) {
                        throw new Error(
                            "The generated quiz had an invalid format."
                        );
                    }
                }

                questions = data.questions;
                currentIndex = 0;
                score = 0;
                selectedAnswer = null;
                answers = [];

                topicSection.style.display = "none";
                quizResult.style.display = "none";
                quizHeading.style.display = "";
                quizCard.style.display = "";

                loadQuestion();
            } catch (error) {
                errorMessage.textContent =
                    error.message || "Something went wrong.";

                console.error("Quiz generation error:", error);
            } finally {
                generateButton.disabled = false;
                generateButton.textContent = "Generate 5 Questions";
            }
        }

        function loadQuestion() {
            const question = questions[currentIndex];

            currentQuestion.textContent = currentIndex + 1;
            totalQuestions.textContent = questions.length;
            questionText.textContent = question.question;

            optionsContainer.replaceChildren();
            selectedAnswer = null;
            nextButton.disabled = true;

            question.options.forEach((option, index) => {
                const button = document.createElement("button");

                button.type = "button";
                button.className = "quiz-option";
                button.textContent =
                    String.fromCharCode(65 + index) + ". " + option;

                button.addEventListener("click", () => {
                    selectedAnswer = index;

                    optionsContainer
                        .querySelectorAll(".quiz-option")
                        .forEach(item => {
                            item.classList.remove("selected");
                        });

                    button.classList.add("selected");
                    nextButton.disabled = false;
                });

                optionsContainer.appendChild(button);
            });

            nextButton.textContent =
                currentIndex === questions.length - 1
                    ? "Submit Quiz"
                    : "Next Question";
        }

        function showResult() {
            quizCard.style.display = "none";
            quizHeading.style.display = "none";
            quizResult.style.display = "block";

            scoreNumber.textContent = score;
            scoreTotal.textContent = questions.length;

            const percentage = Math.round(
                (score / questions.length) * 100
            );

            if (percentage === 100) {
                scoreMessage.textContent =
                    "Outstanding! A perfect score. You've mastered this topic!";
            } else if (percentage >= 80) {
                scoreMessage.textContent =
                    "Excellent work! You have a strong understanding of this topic.";
            } else if (percentage >= 60) {
                scoreMessage.textContent =
                    "Good effort! Review a few concepts and try again.";
            } else if (percentage >= 40) {
                scoreMessage.textContent =
                    "You're making progress. Revise this topic and practise again.";
            } else {
                scoreMessage.textContent =
                    "Don't give up! Review the basics of this topic and give it another try.";
            }

            scoreMessage.textContent +=
                " Final percentage: " + percentage + "%.";
        }

        topicForm.addEventListener("submit", event => {
            event.preventDefault();

            const topic = topicInput.value.trim();

            if (!topic) {
                errorMessage.textContent =
                    "Please enter a topic first.";
                topicInput.focus();
                return;
            }

            startQuiz(topic);
        });

        nextButton.addEventListener("click", () => {
            if (selectedAnswer === null) return;

            answers[currentIndex] = selectedAnswer;

            if (selectedAnswer === questions[currentIndex].answer) {
                score++;
            }

            if (currentIndex < questions.length - 1) {
                currentIndex++;
                loadQuestion();
            } else {
                showResult();
            }
        });

        retryButton.addEventListener("click", () => {
            quizResult.style.display = "none";
            quizCard.style.display = "none";
            quizHeading.style.display = "";
            topicSection.style.display = "";

            errorMessage.textContent = "";
            topicInput.value = "";
            topicInput.focus();
        });
    }
}



//     // ------------------------------------------
//     // ELEMENTS
//     // ------------------------------------------

//     const questionText =
//         document.getElementById("questionText");

//     const optionsContainer =
//         document.getElementById("optionsContainer");

//     const nextButton =
//         document.getElementById("nextQuestion");

//     const currentQuestion =
//         document.getElementById("currentQuestion");

//     const totalQuestions =
//         document.getElementById("totalQuestions");

//     const quizCard =
//         document.querySelector(".quiz-card");

//     const quizHeading =
//         document.querySelector(".quiz-heading");

//     const quizTop =
//         document.querySelector(".quiz-top");

//     const quizResult =
//         document.getElementById("quizResult");

//     const scoreNumber =
//         document.getElementById("scoreNumber");

//     const scoreTotal =
//         document.getElementById("scoreTotal");

//     const scoreMessage =
//         document.getElementById("scoreMessage");

//     const retryButton =
//         document.getElementById("retryQuiz");


//     // ------------------------------------------
//     // CHECK ELEMENTS
//     // ------------------------------------------

//     if (
//         !questionText ||
//         !optionsContainer ||
//         !nextButton ||
//         !quizCard ||
//         !quizResult ||
//         !retryButton
//     ) {

//         console.error("Quiz elements are missing.");

//     } else {


//         // --------------------------------------
//         // VARIABLES
//         // --------------------------------------

//         let currentIndex = 0;

//         let score = 0;

//         let selectedAnswer = null;


//         totalQuestions.textContent =
//             questions.length;

//         scoreTotal.textContent =
//             questions.length;


//         // --------------------------------------
//         // LOAD QUESTION
//         // --------------------------------------

//         function loadQuestion() {

//             const current =
//                 questions[currentIndex];


//             currentQuestion.textContent =
//                 currentIndex + 1;


//             questionText.textContent =
//                 current.question;


//             optionsContainer.innerHTML = "";


//             selectedAnswer = null;

//             nextButton.disabled = true;


//             // Create answer buttons

//             current.options.forEach(
//                 function (option, index) {

//                     const button =
//                         document.createElement("button");


//                     button.type = "button";

//                     button.className =
//                         "quiz-option";


//                     button.textContent =
//                         String.fromCharCode(65 + index)
//                         + ". "
//                         + option;


//                     button.addEventListener(
//                         "click",
//                         function () {

//                             selectedAnswer = index;


//                             document
//                                 .querySelectorAll(".quiz-option")
//                                 .forEach(
//                                     function (item) {

//                                         item.classList.remove(
//                                             "selected"
//                                         );

//                                     }
//                                 );


//                             button.classList.add(
//                                 "selected"
//                             );


//                             nextButton.disabled =
//                                 false;

//                         }
//                     );


//                     optionsContainer.appendChild(
//                         button
//                     );

//                 }
//             );


//             // Last question

//             if (
//                 currentIndex ===
//                 questions.length - 1
//             ) {

//                 nextButton.textContent =
//                     "Submit Quiz";

//             } else {

//                 nextButton.textContent =
//                     "Next Question";

//             }

//         }


//         // --------------------------------------
//         // NEXT / SUBMIT BUTTON
//         // --------------------------------------

//         nextButton.addEventListener(
//             "click",
//             function () {

//                 if (selectedAnswer === null) {
//                     return;
//                 }


//                 // Check answer

//                 if (
//                     selectedAnswer ===
//                     questions[currentIndex].answer
//                 ) {

//                     score++;

//                 }


//                 // Are there more questions?

//                 if (
//                     currentIndex <
//                     questions.length - 1
//                 ) {

//                     currentIndex++;

//                     loadQuestion();

//                 } else {

//                     // THIS IS THE IMPORTANT PART
//                     showResult();

//                 }

//             }
//         );


//         // --------------------------------------
//         // SHOW RESULT
//         // --------------------------------------

//         function showResult() {

//             console.log("Quiz finished. Score:", score);


//             // Hide quiz

//             quizCard.style.display = "none";

//             quizHeading.style.display = "none";

//             quizTop.style.display = "none";


//             // Calculate score

//             scoreNumber.textContent =
//                 score;

//             scoreTotal.textContent =
//                 questions.length;


//             const percentage =
//                 Math.round(
//                     (score / questions.length) * 100
//                 );


//             // Result message

//             if (percentage === 100) {

//                 scoreMessage.textContent =
//                     "Perfect score! Excellent work.";

//             }

//             else if (percentage >= 80) {

//                 scoreMessage.textContent =
//                     "Great work! Keep it up.";

//             }

//             else if (percentage >= 60) {

//                 scoreMessage.textContent =
//                     "Good effort! Keep revising.";

//             }

//             else {

//                 scoreMessage.textContent =
//                     "Keep practicing. You can improve.";

//             }


//             // ----------------------------------
//             // SHOW RESULT DIRECTLY
//             // ----------------------------------

//             quizResult.style.display = "block";

//         }


//         // --------------------------------------
//         // RETRY QUIZ
//         // --------------------------------------

//         retryButton.addEventListener(
//             "click",
//             function () {

//                 currentIndex = 0;

//                 score = 0;

//                 selectedAnswer = null;


//                 // Hide result

//                 quizResult.style.display = "none";


//                 // Show quiz again

//                 quizCard.style.display = "";

//                 quizHeading.style.display = "";

//                 quizTop.style.display = "";


//                 // Load first question

//                 loadQuestion();

//             }
//         );


//         // --------------------------------------
//         // START
//         // --------------------------------------

//         loadQuestion();

//     }

// }
/* ==========================================
   QUIZ NAVIGATION
   ========================================== */

if (document.getElementById("quizPage")) {

    const quizNavBtn =
        document.getElementById("quizNavBtn");

    const quizNavDropdown =
        document.getElementById("quizNavDropdown");


    if (quizNavBtn && quizNavDropdown) {

        quizNavBtn.addEventListener("click", function (event) {

            event.stopPropagation();

            quizNavDropdown.classList.toggle("show");

        });


        document.addEventListener("click", function () {

            quizNavDropdown.classList.remove("show");

        });

    }

}
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// =========================================================
// STUDYBUDDY CHAT
// =========================================================

// if (document.querySelector(".chat-page")) {

//     const chatInput =
//         document.getElementById("chatInput");

//     const chatSendBtn =
//         document.getElementById("chatSendBtn");

//     const chatMessages =
//         document.getElementById("chatMessages");

//     const newChatBtn =
//         document.getElementById("newChatBtn");

//     const chatSearch =
//         document.getElementById("chatSearch");


//     // -----------------------------------------------------
//     // SEND MESSAGE
//     // -----------------------------------------------------

//     function sendChatMessage() {

//         const message =
//             chatInput.value.trim();

//         if (message === "") {
//             return;
//         }


//         // User message

//         const userMessage =
//             document.createElement("div");

//         userMessage.className =
//             "chat-message user-message";


//         userMessage.innerHTML = `

//             <div>

//                 <div class="chat-bubble">
//                     ${escapeChatHTML(message)}
//                 </div>

//                 <span class="chat-time">
//                     Just now
//                 </span>

//             </div>

//         `;


//         chatMessages.appendChild(userMessage);


//         chatInput.value = "";


//         chatMessages.scrollTop =
//             chatMessages.scrollHeight;


//         // Temporary frontend response
//         // This is where Flask/backend AI will
//         // eventually return the real answer.

//         setTimeout(function () {

//             const aiMessage =
//                 document.createElement("div");

//             aiMessage.className =
//                 "chat-message ai-message";


//             aiMessage.innerHTML = `

//                 <div class="chat-avatar">
//                     <i class="fa-solid fa-star"></i>
//                 </div>

//                 <div>

//                     <div class="chat-bubble">

//                         I'm ready to help with that! ✨

//                         <br><br>

//                         The AI response will be connected
//                         to your Flask backend later.

//                     </div>

//                     <span class="chat-time">
//                         Just now
//                     </span>

//                 </div>

//             `;


//             chatMessages.appendChild(aiMessage);


//             chatMessages.scrollTop =
//                 chatMessages.scrollHeight;

//         }, 500);

//     }


//     // -----------------------------------------------------
//     // SEND BUTTON
//     // -----------------------------------------------------

//     if (chatSendBtn) {

//         chatSendBtn.addEventListener(
//             "click",
//             sendChatMessage
//         );

//     }


//     // -----------------------------------------------------
//     // ENTER KEY
//     // -----------------------------------------------------

//     if (chatInput) {

//         chatInput.addEventListener(
//             "keydown",
//             function (event) {

//                 if (
//                     event.key === "Enter" &&
//                     !event.shiftKey
//                 ) {

//                     event.preventDefault();

//                     sendChatMessage();

//                 }

//             }
//         );

//     }


//     // -----------------------------------------------------
//     // NEW CHAT
//     // -----------------------------------------------------

//     if (newChatBtn) {

//         newChatBtn.addEventListener(
//             "click",
//             function () {

//                 chatMessages.innerHTML = `

//                     <div class="chat-message ai-message">

//                         <div class="chat-avatar">
//                             <i class="fa-solid fa-star"></i>
//                         </div>

//                         <div>

//                             <div class="chat-bubble">

//                                 <p>
//                                     Hi there! 👋
//                                 </p>

//                                 <p>
//                                     I'm StudyBuddy, your AI study
//                                     companion. What would you
//                                     like to study today?
//                                 </p>

//                             </div>

//                             <span class="chat-time">
//                                 Just now
//                             </span>

//                         </div>

//                     </div>

//                 `;

//                 chatInput.focus();

//             }
//         );

//     }


//     // -----------------------------------------------------
//     // SEARCH SAVED CHATS
//     // -----------------------------------------------------

//     if (chatSearch) {

//         chatSearch.addEventListener(
//             "input",
//             function () {

//                 const searchText =
//                     chatSearch.value
//                         .toLowerCase()
//                         .trim();


//                 const savedChats =
//                     document.querySelectorAll(
//                         ".chat-saved-item"
//                     );


//                 savedChats.forEach(function (chat) {

//                     const text =
//                         chat.textContent
//                             .toLowerCase();


//                     if (
//                         text.includes(searchText)
//                     ) {

//                         chat.style.display =
//                             "";

//                     } else {

//                         chat.style.display =
//                             "none";

//                     }

//                 });

//             }
//         );

//     }


//     // -----------------------------------------------------
//     // HTML SAFETY
//     // -----------------------------------------------------

//     function escapeChatHTML(text) {

//         return text
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")
//             .replace(/"/g, "&quot;")
//             .replace(/'/g, "&#039;");

//     }

// }

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


