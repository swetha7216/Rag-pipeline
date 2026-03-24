
// ================================
// Configuration
// ================================
const API_BASE_URL = 'http://localhost:8000';

// ================================
// DOM Elements
// ================================
const elements = {
    // New Chat
    newChatBtn: document.getElementById('newChatBtn'),

    // Chat History
    chatHistoryList: document.getElementById('chatHistoryList'),
    noHistory: document.getElementById('noHistory'),

    // Upload & Docs
    fileInput: document.getElementById('fileInput'),
    uploadTriggerBtn: document.getElementById('uploadTriggerBtn'),
    miniUploadStatus: document.getElementById('miniUploadStatus'),
    miniStatusText: document.getElementById('miniStatusText'),

    // Docs Drawer
    toggleDocsBtn: document.getElementById('toggleDocsBtn'),
    docsDrawer: document.getElementById('docsDrawer'),
    documentsList: document.getElementById('documentsList'),
    noDocs: document.getElementById('noDocs'),

    // Chat elements
    chatMessages: document.getElementById('chatMessages'),
    welcomeMessage: document.getElementById('welcomeMessage'),
    questionInput: document.getElementById('questionInput'),
    sendBtn: document.getElementById('sendBtn'),
    chatTitle: document.getElementById('chatTitle'),
    chatSubtitle: document.getElementById('chatSubtitle'),

    // Header actions
    renameChat: document.getElementById('renameChat'),
    deleteChat: document.getElementById('deleteChat'),

    // Loading & Toast
    loadingOverlay: document.getElementById('loadingOverlay'), // Keep for initial load or heavy ops
    loadingText: document.getElementById('loadingText'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),

    // Modals
    renameModal: document.getElementById('renameModal'),
    renameInput: document.getElementById('renameInput'),
    closeRenameModal: document.getElementById('closeRenameModal'),
    cancelRename: document.getElementById('cancelRename'),
    confirmRename: document.getElementById('confirmRename'),

    deleteModal: document.getElementById('deleteModal'),
    closeDeleteModal: document.getElementById('closeDeleteModal'),
    cancelDelete: document.getElementById('cancelDelete'),
    confirmDelete: document.getElementById('confirmDelete'),

    // Scroll Button
    scrollTopBtn: document.getElementById('scrollTopBtn'),

    // Clear DB
    clearDbBtn: document.getElementById('clearDbBtn'),
    clearDbModal: document.getElementById('clearDbModal'),
    closeClearDbModal: document.getElementById('closeClearDbModal'),
    cancelClearDb: document.getElementById('cancelClearDb'),
    confirmClearDb: document.getElementById('confirmClearDb')
};

// ================================
// State
// ================================
let state = {
    isDocumentProcessed: false,
    uploadedDocuments: [],
    isLoading: false,

    // Chat History
    chats: [],
    currentChatId: null
};



// ================================
// Local Storage Keys
// ================================
const STORAGE_KEYS = {
    CHATS: 'rag_chats',
    CURRENT_CHAT: 'rag_current_chat',
    DOCUMENTS: 'rag_documents'
};

// ================================
// Utility Functions
// ================================
function generateId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function showToast(message, type = 'success') {
    elements.toast.className = `toast show ${type}`;
    elements.toastMessage.textContent = message;

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 4000);
}

function showMiniLoading(message = 'Processing...') {
    elements.miniStatusText.textContent = message;
    elements.miniUploadStatus.classList.remove('hidden');
    state.isLoading = true;
    elements.questionInput.disabled = true;
}

function hideMiniLoading() {
    elements.miniUploadStatus.classList.add('hidden');
    state.isLoading = false;
    elements.questionInput.disabled = false;
    elements.questionInput.focus();
}

// ================================
// Storage Functions
// ================================
function saveToStorage() {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(state.chats));
    localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT, state.currentChatId);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(state.uploadedDocuments));
}

function loadFromStorage() {
    try {
        const chats = localStorage.getItem(STORAGE_KEYS.CHATS);
        const currentChat = localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT);
        const documents = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);

        if (chats) {
            state.chats = JSON.parse(chats);
            state.chats.forEach(chat => {
                chat.createdAt = new Date(chat.createdAt);
                chat.updatedAt = new Date(chat.updatedAt);
            });
        }

        if (documents) {
            state.uploadedDocuments = JSON.parse(documents);
            state.isDocumentProcessed = state.uploadedDocuments.length > 0;
        }

        if (currentChat && state.chats.find(c => c.id === currentChat)) {
            state.currentChatId = currentChat;
        }
    } catch (error) {
        console.error('Error loading from storage:', error);
    }
}

// ================================
// Chat History Functions
// ================================
function createNewChat() {
    const chat = {
        id: generateId(),
        name: 'New Conversation',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    state.chats.unshift(chat);
    state.currentChatId = chat.id;

    saveToStorage();
    renderChatHistory();
    loadChat(chat.id);

    showToast('New conversation started!', 'success');
}

function loadChat(chatId) {
    const chat = state.chats.find(c => c.id === chatId);
    if (!chat) return;

    state.currentChatId = chatId;
    saveToStorage();

    elements.chatTitle.textContent = chat.name;
    elements.chatSubtitle.textContent = `Created ${formatDate(chat.createdAt)}`;

    const messages = elements.chatMessages.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());

    if (chat.messages.length === 0) {
        elements.welcomeMessage.classList.remove('hidden');
    } else {
        elements.welcomeMessage.classList.add('hidden');
        chat.messages.forEach(msg => {
            addMessageToDOM(msg.content, msg.type);
        });
    }

    renderChatHistory();
    updateInputState();
}

function renameCurrentChat(newName) {
    const chat = state.chats.find(c => c.id === state.currentChatId);
    if (!chat) return;

    chat.name = newName.trim() || 'Untitled';
    chat.updatedAt = new Date();

    saveToStorage();
    renderChatHistory();

    elements.chatTitle.textContent = chat.name;
    showToast('Conversation renamed!', 'success');
}

function deleteChat(chatId) {
    const index = state.chats.findIndex(c => c.id === chatId);
    if (index === -1) return;

    state.chats.splice(index, 1);

    if (state.currentChatId === chatId) {
        if (state.chats.length > 0) {
            loadChat(state.chats[0].id);
        } else {
            createNewChat();
        }
    }

    saveToStorage();
    renderChatHistory();

    showToast('Conversation deleted!', 'success');
}

function addMessageToChat(content, type) {
    let chat = state.chats.find(c => c.id === state.currentChatId);

    if (!chat) {
        const newChat = {
            id: generateId(),
            name: 'New Conversation',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        state.chats.unshift(newChat);
        state.currentChatId = newChat.id;
        chat = newChat;
    }

    chat.messages.push({
        content,
        type,
        timestamp: new Date()
    });

    chat.updatedAt = new Date();

    if (chat.name === 'New Conversation' && type === 'user') {
        chat.name = content.length > 30 ? content.substring(0, 30) + '...' : content;
        elements.chatTitle.textContent = chat.name;
    }

    saveToStorage();
    renderChatHistory();
}

function renderChatHistory() {
    elements.chatHistoryList.innerHTML = '';

    if (state.chats.length === 0) {
        elements.noHistory.classList.remove('hidden');
        return;
    }

    elements.noHistory.classList.add('hidden');

    state.chats.forEach(chat => {
        const item = document.createElement('div');
        item.className = `chat-history-item ${chat.id === state.currentChatId ? 'active' : ''}`;
        item.dataset.chatId = chat.id;

        item.innerHTML = `
            <div class="chat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <div class="chat-info">
                <span class="chat-name">${escapeHtml(chat.name)}</span>
                <span class="chat-date">${formatDate(chat.updatedAt)}</span>
            </div>
            <div class="chat-actions">
                <button class="icon-btn" title="Rename" data-action="rename" style="width:24px;height:24px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="icon-btn" title="Delete" data-action="delete" style="width:24px;height:24px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;

        item.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            loadChat(chat.id);
        });

        item.querySelector('[data-action="rename"]').addEventListener('click', (e) => {
            e.stopPropagation();
            state.currentChatId = chat.id;
            openRenameModal(chat.name);
        });

        item.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
            e.stopPropagation();
            state.currentChatId = chat.id;
            elements.deleteModal.classList.add('show');
        });

        elements.chatHistoryList.appendChild(item);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ================================
// Modal Functions
// ================================
function openRenameModal(currentName) {
    elements.renameInput.value = currentName;
    elements.renameModal.classList.add('show');
    elements.renameInput.focus();
    elements.renameInput.select();
}

function closeRenameModal() {
    elements.renameModal.classList.remove('show');
}

function closeDeleteModal() {
    elements.deleteModal.classList.remove('show');
}

// ================================
// File Handling
// ================================
function addDocumentToList(filename) {
    if (!state.uploadedDocuments.includes(filename)) {
        state.uploadedDocuments.push(filename);
        saveToStorage();
    }
    renderDocumentsList();
}

function renderDocumentsList() {
    elements.documentsList.innerHTML = '';

    if (state.uploadedDocuments.length === 0) {
        elements.noDocs.classList.remove('hidden');
        return;
    }

    elements.noDocs.classList.add('hidden');

    state.uploadedDocuments.forEach(filename => {
        const li = document.createElement('li');
        li.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span title="${filename}">${filename}</span>
        `;
        elements.documentsList.appendChild(li);
    });
}

function updateInputState() {
    const canChat = state.isDocumentProcessed;
    elements.questionInput.disabled = !canChat;
    elements.sendBtn.disabled = !canChat;

    // Hint text update can be added if needed
}

// ================================
// API Functions
// ================================
async function uploadPDF(files) {
    if (!files || files.length === 0 || state.isLoading) return;

    // Convert FileList to array if needed
    const fileList = files instanceof FileList ? Array.from(files) : (Array.isArray(files) ? files : [files]);

    // Validation
    const validFiles = [];
    const maxSize = 50 * 1024 * 1024;

    for (const file of fileList) {
        if (file.type !== 'application/pdf') {
            showToast(`Skipped ${file.name}: Not a PDF`, 'error');
            continue;
        }
        if (file.size > maxSize) {
            showToast(`Skipped ${file.name}: Too large (>50MB)`, 'error');
            continue;
        }
        validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const formData = new FormData();
    // In FastAPI, if the endpoint expects List[UploadFile], we append each file with the SAME key 'files' (plural based on your API change, or just 'files')
    // Wait, let's check the API signature. It was updated to `files: list[UploadFile]`.
    // Typically frameworks expect the field name to match the parameter name??
    // Actually FastAPI handles `files` (plural) if you use `UploadFile` list. 
    // Usually it's `files` or whatever parameter name is used.
    // The previous code had `upload_pdf(files: ...)`.

    validFiles.forEach(file => {
        formData.append('files', file);
    });

    showMiniLoading(`Uploading ${validFiles.length} file(s)...`);

    try {
        const response = await fetch(`${API_BASE_URL}/upload-pdf/`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Upload failed');
        }

        const data = await response.json();

        showToast(`${validFiles.length} PDF(s) processed successfully!`, 'success');

        validFiles.forEach(file => {
            addDocumentToList(file.name);
        });

        state.isDocumentProcessed = true;
        updateInputState();

        // Briefly show docs drawer
        elements.docsDrawer.classList.add('open');
        setTimeout(() => {
            if (!elements.docsDrawer.matches(':hover')) {
                elements.docsDrawer.classList.remove('open');
            }
        }, 3000);

    } catch (error) {
        console.error('Upload error:', error);
        showToast(error.message || 'Failed to upload PDFs', 'error');
    } finally {
        hideMiniLoading();
        elements.fileInput.value = ''; // Reset input
    }
}

async function askQuestion(question) {
    if (!question.trim() || state.isLoading || !state.isDocumentProcessed) return;

    elements.welcomeMessage.classList.add('hidden');

    addMessageToDOM(question, 'user');
    addMessageToChat(question, 'user');

    elements.questionInput.value = '';
    autoResizeTextarea();

    const typingId = addTypingIndicator();

    elements.questionInput.disabled = true;
    elements.sendBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/ask/?question=${encodeURIComponent(question)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to get answer');
        }

        const data = await response.json();

        removeTypingIndicator(typingId);

        addMessageToDOM(data.answer, 'assistant');
        addMessageToChat(data.answer, 'assistant');

    } catch (error) {
        console.error('Question error:', error);
        removeTypingIndicator(typingId);

        const errorMsg = 'Sorry, I encountered an error. Please try again.';
        addMessageToDOM(errorMsg, 'assistant');
        addMessageToChat(errorMsg, 'assistant');

        showToast(error.message || 'Failed to get answer', 'error');
    } finally {
        elements.questionInput.disabled = false;
        elements.sendBtn.disabled = false;
        elements.questionInput.focus();
    }
}

function openClearDbModal() {
    if (elements.clearDbModal) elements.clearDbModal.classList.add('show');
}

function closeClearDbModal() {
    if (elements.clearDbModal) elements.clearDbModal.classList.remove('show');
}

async function clearDatabase() {
    // This function is now just the action performer
    closeClearDbModal();

    // Animate removal first
    const listItems = elements.documentsList.querySelectorAll('li');

    if (listItems.length > 0) {
        // Staggered animation
        Array.from(listItems).forEach((li, index) => {
            setTimeout(() => {
                li.classList.add('slide-out-right');
            }, index * 50);
        });

        // Wait for animation to finish before clearing state
        await new Promise(r => setTimeout(r, (listItems.length * 50) + 500));
    }

    try {
        const response = await fetch(`${API_BASE_URL}/clear-db/`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Failed to clear database');
        }

        const data = await response.json();

        // Clear local state
        state.uploadedDocuments = [];
        state.isDocumentProcessed = false;
        saveToStorage();
        renderDocumentsList();
        updateInputState();

        showToast('Database cleared & particles reset!', 'success');

        // Close drawer
        elements.docsDrawer.classList.remove('open');

    } catch (error) {
        console.error('Clear DB error:', error);
        showToast('Failed to clear database', 'error');
    }
}

// ================================
// Chat Functions
// ================================
function addMessageToDOM(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatar = type === 'user'
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 2a10 10 0 0 1 10 10"></path><path d="M12 12l8-4"></path></svg>';

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${formatMessage(content)}</div>
    `;

    elements.chatMessages.appendChild(messageDiv);
    scrollToBottom();

    const newMessageContent = messageDiv.querySelector('.message-content');
    if (newMessageContent) {
        newMessageContent.addEventListener('mousemove', handleTilt);
        newMessageContent.addEventListener('mouseleave', resetTilt);
    }
}

function formatMessage(content) {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}

function addTypingIndicator() {
    const id = 'typing-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    messageDiv.id = id;

    messageDiv.innerHTML = `
        <div class="message-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 2a10 10 0 0 1 10 10"></path><path d="M12 12l8-4"></path></svg>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    elements.chatMessages.appendChild(messageDiv);
    scrollToBottom();
    return id;
}

function removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) indicator.remove();
}

// ================================
// 3D Tilt Effect
// ================================
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.message-content, .new-chat-btn');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', handleTilt);
        el.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    el.style.transition = 'transform 0.1s ease';
}

function resetTilt(e) {
    const el = e.currentTarget;
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    el.style.transition = 'transform 0.5s ease';
}

function scrollToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function autoResizeTextarea() {
    const textarea = elements.questionInput;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 140) + 'px';
}

// ================================
// Event Listeners
// ================================
function initEventListeners() {
    // New Chat
    elements.newChatBtn.addEventListener('click', createNewChat);

    // Upload Trigger (+)
    elements.uploadTriggerBtn.addEventListener('click', () => {
        elements.fileInput.click();
    });

    // File Input Change
    elements.fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) uploadPDF(files);
    });

    // Toggle Docs Drawer
    elements.toggleDocsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.docsDrawer.classList.toggle('open');
    });

    // Clear DB
    if (elements.clearDbBtn) {
        elements.clearDbBtn.addEventListener('click', openClearDbModal);
    }

    // Clear DB Modal Listeners
    if (elements.closeClearDbModal) elements.closeClearDbModal.addEventListener('click', closeClearDbModal);
    if (elements.cancelClearDb) elements.cancelClearDb.addEventListener('click', closeClearDbModal);
    if (elements.confirmClearDb) elements.confirmClearDb.addEventListener('click', clearDatabase);

    if (elements.clearDbModal) {
        elements.clearDbModal.addEventListener('click', (e) => {
            if (e.target === elements.clearDbModal) closeClearDbModal();
        });
    }

    // Close Docs Drawer when clicking outside
    document.addEventListener('click', (e) => {
        if (elements.docsDrawer.classList.contains('open') &&
            !elements.docsDrawer.contains(e.target) &&
            !elements.toggleDocsBtn.contains(e.target)) {
            elements.docsDrawer.classList.remove('open');
        }
    });

    // Question input
    elements.questionInput.addEventListener('input', autoResizeTextarea);

    elements.questionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            askQuestion(elements.questionInput.value);
        }
    });

    elements.sendBtn.addEventListener('click', () => {
        askQuestion(elements.questionInput.value);
    });

    // Header actions (Rename/Delete)
    elements.renameChat.addEventListener('click', () => {
        const chat = state.chats.find(c => c.id === state.currentChatId);
        if (chat) openRenameModal(chat.name);
    });

    elements.deleteChat.addEventListener('click', () => {
        elements.deleteModal.classList.add('show');
    });

    // Modals
    elements.closeRenameModal.addEventListener('click', closeRenameModal);
    elements.cancelRename.addEventListener('click', closeRenameModal);
    elements.confirmRename.addEventListener('click', () => {
        renameCurrentChat(elements.renameInput.value);
        closeRenameModal();
    });

    elements.renameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            renameCurrentChat(elements.renameInput.value);
            closeRenameModal();
        }
        if (e.key === 'Escape') closeRenameModal();
    });

    elements.closeDeleteModal.addEventListener('click', closeDeleteModal);
    elements.cancelDelete.addEventListener('click', closeDeleteModal);
    elements.confirmDelete.addEventListener('click', () => {
        deleteChat(state.currentChatId);
        closeDeleteModal();
    });

    // Scroll Button
    if (elements.scrollTopBtn) {
        elements.scrollTopBtn.addEventListener('click', () => {
            elements.chatMessages.scrollTo({
                top: elements.chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        });

        elements.chatMessages.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = elements.chatMessages;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            elements.scrollTopBtn.classList.toggle('hidden', isNearBottom);
        });
    }

    // Modal Overlay Clicks
    elements.renameModal.addEventListener('click', (e) => {
        if (e.target === elements.renameModal) closeRenameModal();
    });

    elements.deleteModal.addEventListener('click', (e) => {
        if (e.target === elements.deleteModal) closeDeleteModal();
    });
}

// ================================
// Initialize App
// ================================
function init() {
    loadFromStorage();
    renderChatHistory();
    renderDocumentsList();
    updateInputState();

    if (state.currentChatId && state.chats.find(c => c.id === state.currentChatId)) {
        loadChat(state.currentChatId);
    } else if (state.chats.length > 0) {
        loadChat(state.chats[0].id);
    } else {
        elements.chatTitle.textContent = 'New Conversation';
        elements.chatSubtitle.textContent = 'Ask questions about your uploaded documents';
    }

    initEventListeners();
    initTiltEffect();

    console.log('RAG Frontend initialized!');
}

document.addEventListener('DOMContentLoaded', init);