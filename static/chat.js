
// /* =========================================================
//    STUDYBUDDY CHAT
// ========================================================= */

// if (document.querySelector(".chat-page")) {

//     console.log("StudyBuddy chat JS loaded!");

//     const chatPage = document.querySelector(".chat-page");

//     const chatLanding = document.getElementById("chatLanding");
//     const chatActive = document.getElementById("chatActive");

//     const chatInput = document.getElementById("chatInput");
//     const chatSendBtn = document.getElementById("chatSendBtn");

//     const chatActiveInput = document.getElementById("chatActiveInput");
//     const chatActiveSend = document.getElementById("chatActiveSend");

//     const chatMessages = document.getElementById("chatMessages");

//     const newChatBtn = document.getElementById("newChatBtn");
//     const savedChatsBtn = document.getElementById("savedChatsBtn");
//     const activeSavedBtn = document.getElementById("activeSavedBtn");

//     const savedChatPanel = document.getElementById("savedChatPanel");
//     const closeSavedChats = document.getElementById("closeSavedChats");


//     /* =====================================================
//        ESCAPE HTML
//     ===================================================== */

//     function escapeChatHTML(text) {

//         const div = document.createElement("div");

//         div.textContent = text;

//         return div.innerHTML;
//     }


//     /* =====================================================
//        ADD USER MESSAGE
//     ===================================================== */

//     function addUserMessage(message) {

//         const messageElement = document.createElement("div");

//         messageElement.className = "chat-message user-message";

//         messageElement.innerHTML = `
//             <div>
//                 <div class="chat-bubble">
//                     ${escapeChatHTML(message)}
//                 </div>

//                 <span class="chat-time">Just now</span>
//             </div>
//         `;

//         chatMessages.appendChild(messageElement);

//         chatMessages.scrollTop = chatMessages.scrollHeight;
//     }


//     /* =====================================================
//        ADD AI MESSAGE
//     ===================================================== */

//     function addAIMessage(message) {

//         const aiMessage = document.createElement("div");

//         aiMessage.className = "chat-message ai-message";

//         aiMessage.innerHTML = `
//             <div class="chat-avatar">
//                 <i class="fa-solid fa-star"></i>
//             </div>

//             <div>
//                 <div class="chat-bubble">
//                     ${escapeChatHTML(message).replace(/\n/g, "<br>")}
//                 </div>

//                 <span class="chat-time">Just now</span>
//             </div>
//         `;

//         chatMessages.appendChild(aiMessage);

//         chatMessages.scrollTop = chatMessages.scrollHeight;
//     }


//     /* =====================================================
//        SHOW LOADING MESSAGE
//     ===================================================== */

//     function showLoadingMessage() {

//         const loadingMessage = document.createElement("div");

//         loadingMessage.className = "chat-message ai-message";

//         loadingMessage.innerHTML = `
//             <div class="chat-avatar">
//                 <i class="fa-solid fa-star"></i>
//             </div>

//             <div>
//                 <div class="chat-bubble">Thinking...</div>
//             </div>
//         `;

//         chatMessages.appendChild(loadingMessage);

//         chatMessages.scrollTop = chatMessages.scrollHeight;

//         return loadingMessage;
//     }


//     /* =====================================================
//        SEND MESSAGE TO FLASK + GEMINI
//     ===================================================== */

//     async function sendToAI(message) {

//         const loadingMessage = showLoadingMessage();

//         try {

//             const response = await fetch("/api/chat", {

//                 method: "POST",

//                 headers: {
//                     "Content-Type": "application/json"
//                 },

//                 body: JSON.stringify({
//                     message: message
//                 })

//             });

//             const data = await response.json();

//             loadingMessage.remove();

//             if (!response.ok) {

//                 addAIMessage(
//                     data.error || "Sorry, something went wrong. Please try again."
//                 );

//                 return;
//             }

//             addAIMessage(
//                 data.reply || "I couldn't generate a response. Please try again."
//             );

//         } catch (error) {

//             loadingMessage.remove();

//             console.error("StudyBuddy API error:", error);

//             addAIMessage(
//                 "I couldn't connect to StudyBuddy's server. Please make sure the Flask backend is running."
//             );
//         }
//     }


//     /* =====================================================
//        START CHAT
//     ===================================================== */

//     function startChat(message) {

//         if (!message || message.trim() === "") {
//             return;
//         }

//         chatPage.classList.add("chat-started");

//         addUserMessage(message.trim());

//         sendToAI(message.trim());
//     }


//     /* =====================================================
//        LANDING SEND BUTTON
//     ===================================================== */

//     if (chatSendBtn) {

//         chatSendBtn.addEventListener("click", function () {

//             const message = chatInput.value.trim();

//             if (!message) {
//                 return;
//             }

//             startChat(message);

//             chatInput.value = "";
//         });
//     }


//     /* =====================================================
//        LANDING ENTER KEY
//     ===================================================== */

//     if (chatInput) {

//         chatInput.addEventListener("keydown", function (event) {

//             if (event.key === "Enter" && !event.shiftKey) {

//                 event.preventDefault();

//                 const message = chatInput.value.trim();

//                 if (!message) {
//                     return;
//                 }

//                 startChat(message);

//                 chatInput.value = "";
//             }
//         });
//     }


//     /* =====================================================
//        ACTIVE CHAT SEND
//     ===================================================== */

//     async function sendActiveMessage() {

//         const message = chatActiveInput.value.trim();

//         if (!message) {
//             return;
//         }

//         addUserMessage(message);

//         chatActiveInput.value = "";

//         await sendToAI(message);
//     }


//     if (chatActiveSend) {

//         chatActiveSend.addEventListener("click", sendActiveMessage);
//     }


//     /* =====================================================
//        ACTIVE CHAT ENTER KEY
//     ===================================================== */

//     if (chatActiveInput) {

//         chatActiveInput.addEventListener("keydown", function (event) {

//             if (event.key === "Enter" && !event.shiftKey) {

//                 event.preventDefault();

//                 sendActiveMessage();
//             }
//         });
//     }


//     /* =====================================================
//        NEW CHAT
//     ===================================================== */

//     if (newChatBtn) {

//         newChatBtn.addEventListener("click", function () {

//             chatPage.classList.remove("chat-started");

//             chatMessages.innerHTML = "";

//             chatInput.value = "";

//             chatActiveInput.value = "";

//             chatInput.focus();
//         });
//     }


//     /* =====================================================
//        SAVED CHATS
//     ===================================================== */

//     function toggleSavedChats() {

//         if (savedChatPanel) {

//             savedChatPanel.classList.toggle("show");
//         }
//     }


//     if (savedChatsBtn) {

//         savedChatsBtn.addEventListener("click", toggleSavedChats);
//     }


//     if (activeSavedBtn) {

//         activeSavedBtn.addEventListener("click", toggleSavedChats);
//     }


//     if (closeSavedChats) {

//         closeSavedChats.addEventListener("click", function () {

//             savedChatPanel.classList.remove("show");
//         });
//     }

// }
/* =========================================================
   STUDYBUDDY CHAT
========================================================= */

if (document.querySelector(".chat-page")) {

    console.log("StudyBuddy chat JS loaded!");

    const chatPage = document.querySelector(".chat-page");

    const chatLanding = document.getElementById("chatLanding");
    const chatActive = document.getElementById("chatActive");

    const chatInput = document.getElementById("chatInput");
    const chatSendBtn = document.getElementById("chatSendBtn");

    const chatActiveInput = document.getElementById("chatActiveInput");
    const chatActiveSend = document.getElementById("chatActiveSend");

    const chatMessages = document.getElementById("chatMessages");

    const newChatBtn = document.getElementById("newChatBtn");
    const savedChatsBtn = document.getElementById("savedChatsBtn");
    const activeSavedBtn = document.getElementById("activeSavedBtn");

    const savedChatPanel = document.getElementById("savedChatPanel");
    const closeSavedChats = document.getElementById("closeSavedChats");


    /* =====================================================
       SELECTED BOOKS (picked on the Books page)
       The Books page saves them in localStorage as "selectedBooks".
       Every message sent to the AI carries this list.
    ===================================================== */

    const SELECTED_BOOKS_KEY = "selectedBooks";

    // filenames that really exist on the server (filled by /api/books)
    let validBooks = null;

    // recent messages, so follow-ups like "explain more" make sense
    let chatHistory = [];

    function getSelectedBooks() {

        let saved = [];

        try {
            saved = JSON.parse(
                localStorage.getItem(SELECTED_BOOKS_KEY) || "[]"
            );
        } catch (error) {
            saved = [];
        }

        if (!Array.isArray(saved)) {
            saved = [];
        }

        // drop books that were removed from the library since
        if (validBooks) {
            saved = saved.filter(name => validBooks.includes(name));
        }

        return saved;
    }

    function prettyBookName(filename) {

        return filename
            .replace(/\.pdf$/i, "")
            .replace(/[_-]+/g, " ");
    }

    function renderSelectedBooksBar() {

        const books = getSelectedBooks();

        document.querySelectorAll(".selected-books-bar").forEach(bar => {

            bar.innerHTML = "";

            const icon = document.createElement("i");
            icon.className = "fa-solid fa-book";

            const label = document.createElement("span");

            if (books.length) {
                label.textContent =
                    "Answering from: " + books.map(prettyBookName).join(", ");
            } else {
                label.textContent =
                    "No books selected. Answering from general knowledge.";
            }

            const link = document.createElement("a");
            link.href = "/books";
            link.textContent = books.length ? "Change books" : "Pick books";

            bar.append(icon, label, link);
        });
    }

    renderSelectedBooksBar();

    fetch("/api/books")
        .then(response => response.json())
        .then(data => {
            validBooks = data.books || [];
            renderSelectedBooksBar();
        })
        .catch(() => {});


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeChatHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }


    /* =====================================================
       ADD USER MESSAGE
    ===================================================== */

    function addUserMessage(message) {

        const messageElement = document.createElement("div");

        messageElement.className = "chat-message user-message";

        messageElement.innerHTML = `
            <div>
                <div class="chat-bubble">
                    ${escapeChatHTML(message)}
                </div>

                <span class="chat-time">Just now</span>
            </div>
        `;

        chatMessages.appendChild(messageElement);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    /* =====================================================
       ADD AI MESSAGE
    ===================================================== */

    function addAIMessage(message) {

        const aiMessage = document.createElement("div");

        aiMessage.className = "chat-message ai-message";

        aiMessage.innerHTML = `
            <div class="chat-avatar">
                <i class="fa-solid fa-star"></i>
            </div>

            <div>
                <div class="chat-bubble">
                    ${escapeChatHTML(message).replace(/\n/g, "<br>")}
                </div>

                <span class="chat-time">Just now</span>
            </div>
        `;

        chatMessages.appendChild(aiMessage);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    /* =====================================================
       SHOW LOADING MESSAGE
    ===================================================== */

    function showLoadingMessage() {

        const loadingMessage = document.createElement("div");

        loadingMessage.className = "chat-message ai-message";

        loadingMessage.innerHTML = `
            <div class="chat-avatar">
                <i class="fa-solid fa-star"></i>
            </div>

            <div>
                <div class="chat-bubble">Thinking...</div>
            </div>
        `;

        chatMessages.appendChild(loadingMessage);

        chatMessages.scrollTop = chatMessages.scrollHeight;

        return loadingMessage;
    }


    /* =====================================================
       SEND MESSAGE TO FLASK + GEMINI
    ===================================================== */

    async function sendToAI(message) {

        const loadingMessage = showLoadingMessage();

        try {

            const response = await fetch("/api/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message,
                    books: getSelectedBooks(),
                    history: chatHistory.slice(-6)
                })

            });

            const data = await response.json();

            loadingMessage.remove();

            if (!response.ok) {

                addAIMessage(
                    data.error || "Sorry, something went wrong. Please try again."
                );

                return;
            }

            const reply =
                data.reply || "I couldn't generate a response. Please try again.";

            addAIMessage(reply);

            if (data.reply) {
                chatHistory.push(
                    { role: "user", content: message },
                    { role: "assistant", content: data.reply }
                );
            }

        } catch (error) {

            loadingMessage.remove();

            console.error("StudyBuddy API error:", error);

            addAIMessage(
                "I couldn't connect to StudyBuddy's server. Please make sure the Flask backend is running."
            );
        }
    }


    /* =====================================================
       START CHAT
    ===================================================== */

    function startChat(message) {

        if (!message || message.trim() === "") {
            return;
        }

        chatPage.classList.add("chat-started");

        addUserMessage(message.trim());

        sendToAI(message.trim());
    }


    /* =====================================================
       LANDING SEND BUTTON
    ===================================================== */

    if (chatSendBtn) {

        chatSendBtn.addEventListener("click", function () {

            const message = chatInput.value.trim();

            if (!message) {
                return;
            }

            startChat(message);

            chatInput.value = "";
        });
    }


    /* =====================================================
       LANDING ENTER KEY
    ===================================================== */

    if (chatInput) {

        chatInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter" && !event.shiftKey) {

                event.preventDefault();

                const message = chatInput.value.trim();

                if (!message) {
                    return;
                }

                startChat(message);

                chatInput.value = "";
            }
        });
    }


    /* =====================================================
       ACTIVE CHAT SEND
    ===================================================== */

    async function sendActiveMessage() {

        const message = chatActiveInput.value.trim();

        if (!message) {
            return;
        }

        addUserMessage(message);

        chatActiveInput.value = "";

        await sendToAI(message);
    }


    if (chatActiveSend) {

        chatActiveSend.addEventListener("click", sendActiveMessage);
    }


    /* =====================================================
       ACTIVE CHAT ENTER KEY
    ===================================================== */

    if (chatActiveInput) {

        chatActiveInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter" && !event.shiftKey) {

                event.preventDefault();

                sendActiveMessage();
            }
        });
    }


    /* =====================================================
       NEW CHAT
    ===================================================== */

    if (newChatBtn) {

        newChatBtn.addEventListener("click", function () {

            chatPage.classList.remove("chat-started");

            chatMessages.innerHTML = "";

            chatHistory = [];

            renderSelectedBooksBar();

            chatInput.value = "";

            chatActiveInput.value = "";

            chatInput.focus();
        });
    }


    /* =====================================================
       SAVED CHATS
    ===================================================== */

    function toggleSavedChats() {

        if (savedChatPanel) {

            savedChatPanel.classList.toggle("show");
        }
    }


    if (savedChatsBtn) {

        savedChatsBtn.addEventListener("click", toggleSavedChats);
    }


    if (activeSavedBtn) {

        activeSavedBtn.addEventListener("click", toggleSavedChats);
    }


    if (closeSavedChats) {

        closeSavedChats.addEventListener("click", function () {

            savedChatPanel.classList.remove("show");
        });
    }

}