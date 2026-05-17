class LayoutHandler {
  constructor() {
    this.init();
    this.handleDOM();
    this.handleEvents();
  }

  init() {
    this.myId = 0;
    this.fakeId = 1;
    this.conversationId = 0;

    this.activeConversationId = null;

    this.users = [];
    this.conversations = [];
  }

  handleDOM() {
    this.chatLayout = document.getElementById("chatLayout");

    this.addNewChatBtn = document.getElementById("addNewChatBtn");

    this.addNewChatFormForm = $("#addNewChatFormForm");

    this.addNewChatInput = document.getElementById("addNewChatInput");

    this.listChatsContainer = $("#contactsList");

    this.chatArea = document.getElementById("chatArea");

    this.rightPanel = document.getElementById("rightPanel");

    this.messagesWrap = document.getElementById("messagesWrap");

    this.userChat = document.getElementById("headerName");

    this.userNamePanel = document.getElementById("panelAvatarName");

    this.sendMessageBtn = document.getElementById("sendMessageBtn");

    this.msgInput = document.getElementById("msgInput");
  }

  handleEvents() {
    // DISPLAY NEW CHAT FORM
    this.addNewChatBtn.addEventListener("click", () => {
      this.addNewChatFormForm.toggleClass("d-none");
    });

    // CREATE NEW CHAT
    this.addNewChatFormForm.validate({
      rules: {
        addChat: {
          required: true,
        },
      },

      messages: {
        addChat: {
          required: "This field is required",
        },
      },

      submitHandler: () => {
        const userName = this.addNewChatInput.value.trim();

        if (!userName) return false;

        const newUser = {
          id: this.fakeId++,
          name: userName,
        };

        const newConversation = {
          id: this.conversationId++,
          users: [this.myId, newUser.id],
          messages: [],
        };

        this.users.push(newUser);

        this.conversations.push(newConversation);

        this.renderConversation(newUser, newConversation);

        this.addNewChatFormForm.addClass("d-none");

        this.addNewChatInput.value = "";

        return false;
      },
    });

    // SELECT CHAT
    this.listChatsContainer.on("click", "li", (e) => {
      const contactItem = e.currentTarget;

      const conversationID = Number(
        contactItem.getAttribute("data-conversation-id"),
      );

      const userID = Number(contactItem.getAttribute("data-user-id"));

      this.activeConversationId = conversationID;

      this.chatArea.classList.remove("d-none");

      this.rightPanel.classList.remove("d-none");

      const selectedUser = this.users.find((user) => user.id === userID);

      if (!selectedUser) return;

      this.userChat.innerText = selectedUser.name;

      this.userNamePanel.innerText = selectedUser.name;

      this.renderMessages();
    });

    // SEND BUTTON
    this.sendMessageBtn.addEventListener("click", () => {
      this.sendMessage();
    });

    // ENTER SEND
    this.msgInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        this.sendMessage();
      }
    });
  }

  sendMessage() {
    const text = this.msgInput.value.trim();

    if (!text) return;

    if (this.activeConversationId === null) return;

    const conversation = this.conversations.find(
      (conv) => conv.id === this.activeConversationId,
    );

    if (!conversation) return;

    // USER MESSAGE
    conversation.messages.push({
      senderId: this.myId,
      text,
      createdAt: new Date(),
    });

    this.renderMessages();

    this.msgInput.value = "";

    // AUTO BOT REPLY
    this.fakeReply(text);
  }

  fakeReply(userMessage) {
    const conversation = this.conversations.find(
      (conv) => conv.id === this.activeConversationId,
    );

    if (!conversation) return;

    // TYPING MESSAGE
    const typingMessage = {
      senderId: 999,
      text: "Typing...",
      typing: true,
    };

    conversation.messages.push(typingMessage);

    this.renderMessages();

    const delay = Math.floor(Math.random() * 2000) + 1000;

    setTimeout(() => {
      // REMOVE TYPING
      conversation.messages = conversation.messages.filter(
        (msg) => !msg.typing,
      );

      // GENERATE REPLY
      const reply = this.generateBotReply(userMessage);

      // BOT MESSAGE
      conversation.messages.push({
        senderId: 999,
        text: reply,
        createdAt: new Date(),
      });

      this.renderMessages();
    }, delay);
  }

  generateBotReply(userMessage) {
    const starters = [
      "Interesting",
      "I see",
      "Got it",
      "That makes sense",
      "Hmm",
      "Right",
      "Okay",
      "Understood",
    ];

    const middles = [
      "tell me more about",
      "why do you think about",
      "how long have you worked on",
      "what inspired",
      "can you explain",
      "what exactly do you mean by",
      "how important is",
    ];

    const endings = [
      "this idea?",
      "that approach?",
      "the project?",
      "your message?",
      "this topic?",
      "that?",
    ];

    const words = userMessage.split(" ").filter((word) => word.length > 3);

    const randomWord =
      words[Math.floor(Math.random() * words.length)] || "that";

    const starter = starters[Math.floor(Math.random() * starters.length)];

    const middle = middles[Math.floor(Math.random() * middles.length)];

    const ending = endings[Math.floor(Math.random() * endings.length)];

    const randomType = Math.floor(Math.random() * 5);

    switch (randomType) {
      case 0:
        return `${starter}. ${middle} "${randomWord}" ${ending}`;

      case 1:
        return `Why are you mentioning "${randomWord}" specifically?`;

      case 2:
        return `I think "${randomWord}" could become something really interesting.`;

      case 3:
        return `Can you give me more details about "${randomWord}"?`;

      case 4:
        return `That's actually a good point about "${randomWord}".`;

      default:
        return `${starter}!`;
    }
  }

  renderMessages() {
    const conversation = this.conversations.find(
      (conv) => conv.id === this.activeConversationId,
    );

    if (!conversation) return;

    this.messagesWrap.innerHTML = "";

    conversation.messages.forEach((message) => {
      const isMine = message.senderId === this.myId;

      const template = `
        <div class="msg-row ${isMine ? "me" : "them"}">
          <p>${message.text}</p>
        </div>
      `;

      this.messagesWrap.innerHTML += template;
    });

    // AUTO SCROLL
    this.messagesWrap.scrollTop = this.messagesWrap.scrollHeight;
  }

  renderConversation(user, conversation) {
    const template = `
      <li 
        data-user-id="${user.id}" 
        data-conversation-id="${conversation.id}"
      >
        ${user.name}
      </li>
    `;

    this.listChatsContainer.append(template);
  }
}
