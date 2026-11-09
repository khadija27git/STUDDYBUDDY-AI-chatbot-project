# STUDDYBUDDY-AI-chatbot-project
# StudyBuddy

StudyBuddy is an AI-powered study companion that answers your questions directly from the reference books you select, and falls back to general explanations when a topic isn't covered. It also includes quizzes, a focus timer, notes, and saved chats, so you can learn, revise, and stay on track in one place.

## Features

- **Book-based answers:** pick one or more books in the library, then chat. Answers come from the selected books, with a separate section for each book when a question spans several.
- **General fallback:** if a topic isn't in the selected books, StudyBuddy says so and answers from general knowledge.
- **Study-only chat:** schedules, timetables, how to study, brainstorming and academic guidance are supported; unrelated topics are politely declined.
- **AI quiz generator, focus timer, notes and saved chats.**
- Login and sign up.

## Tech stack

Python, Flask, SQLite, Google Gemini API, pypdf, HTML, CSS and JavaScript.

## Run locally

1. Install Python 3.10 or newer.
2. Install the requirements:
   ```
   pip install -r requirements.txt
   ```
3. Copy `api.env.example` to `api.env` and add your Gemini API key.
4. Put your PDF books in the `books/` folder.
5. Start the app:
   ```
   python app.py
   ```
6. Open http://127.0.0.1:5000

## Credits

Books courtesy of their authors and publishers. 

| Book | Author | License | Source |
|------|--------|---------|--------|
| Book title | Author name | e.g. CC BY 4.0 | link |

Created by Khadija Choudhary, SYIT.
