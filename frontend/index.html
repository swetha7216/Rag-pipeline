<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAG Pipeline</title>
    <link rel="stylesheet" href="style.css">
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap"
        rel="stylesheet">
</head>

<body>
    <div class="app-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo">
                <div class="logo-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                </div>
                <span>RAG Pipeline</span>
            </div>

            <!-- New Chat Button -->
            <button class="new-chat-btn" id="newChatBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>New Chat</span>
            </button>

            <!-- Chat History Section -->
            <div class="chat-history-section">
                <h3>Chat History</h3>
                <div class="chat-history-list" id="chatHistoryList">
                    <!-- Chat history items will be added here dynamically -->
                </div>
                <p class="no-history" id="noHistory">No conversations yet</p>
            </div>

            <!-- Hidden File Input (moved from upload section) -->
            <input type="file" id="fileInput" accept=".pdf" multiple hidden>
        </aside>

        <!-- Main Chat Area -->
        <main class="chat-area">
            <!-- Header -->
            <header class="chat-header">
                <div class="header-info">
                    <h1 id="chatTitle">New Conversation</h1>
                    <p id="chatSubtitle">Ask questions about your uploaded documents</p>
                </div>
                <div class="header-actions">
                    <button class="icon-btn" id="toggleDocsBtn" title="Processed PDFs">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                    </button>
                    <!-- Docs Drawer -->
                    <div class="docs-drawer" id="docsDrawer">
                        <h3>Processed PDFs</h3>
                        <div class="drawer-header-actions"
                            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <button id="clearDbBtn" class="clear-db-btn" title="Clear All Data">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                    </path>
                                </svg>
                                Clear DB
                            </button>
                        </div>
                        <ul class="documents-list" id="documentsList">
                            <!-- Documents will be added here dynamically -->
                        </ul>
                        <p class="no-docs" id="noDocs">No documents uploaded yet</p>
                    </div>

                    <button class="rename-chat icon-btn" id="renameChat" title="Rename Chat">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="delete-chat icon-btn" id="deleteChat" title="Delete Chat">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                            </path>
                        </svg>
                    </button>
                </div>
            </header>

            <!-- Chat Messages -->
            <div class="chat-messages" id="chatMessages">
                <!-- Welcome Message -->
                <div class="welcome-message" id="welcomeMessage">
                    <div class="welcome-3d-container">
                        <div class="welcome-cube">
                            <div class="cube-face face-front">AI</div>
                            <div class="cube-face face-back">RAG</div>
                            <div class="cube-face face-right">PDF</div>
                            <div class="cube-face face-left">DOC</div>
                            <div class="cube-face face-top"></div>
                            <div class="cube-face face-bottom"></div>
                        </div>
                    </div>
                    <h2 class="welcome-title">Welcome to RAG Pipeline</h2>
                    <p class="welcome-subtitle">Transform your PDFs into an interactive knowledge base. Upload multiple
                        documents and get instant, accurate answers using our advanced RAG system.</p>
                </div>
            </div>

            <!-- Scroll to Bottom Button (Moved outside chat-messages) -->
            <button id="scrollTopBtn" class="scroll-btn hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
            </button>

            <!-- Chat Input -->
            <div class="chat-input-container">
                <div class="chat-input-wrapper">
                    <button class="upload-trigger-btn" id="uploadTriggerBtn" title="Upload PDF">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <textarea id="questionInput" placeholder="Ask a question..." rows="1" disabled></textarea>
                    <button class="send-btn" id="sendBtn" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
                <!-- Mini Upload Status (near input) -->
                <div id="miniUploadStatus" class="mini-upload-status hidden">
                    <span class="spinner-sm"></span>
                    <span id="miniStatusText">Processing...</span>
                </div>
                <p class="input-hint">Press Enter to send, Shift + Enter for new line</p>
            </div>
        </main>
    </div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p id="loadingText">Processing...</p>
        </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast" id="toast">
        <div class="toast-icon"></div>
        <span class="toast-message" id="toastMessage"></span>
    </div>

    <!-- Rename Modal -->
    <div class="modal-overlay" id="renameModal">
        <div class="modal">
            <div class="modal-header">
                <h3>Rename Conversation</h3>
                <button class="modal-close" id="closeRenameModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <input type="text" id="renameInput" placeholder="Enter new name..." maxlength="50">
            </div>
            <div class="modal-footer">
                <button class="modal-btn cancel" id="cancelRename">Cancel</button>
                <button class="modal-btn primary" id="confirmRename">Rename</button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" id="deleteModal">
        <div class="modal">
            <div class="modal-header">
                <h3>Delete Conversation</h3>
                <button class="modal-close" id="closeDeleteModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete this conversation? This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn cancel" id="cancelDelete">Cancel</button>
                <button class="modal-btn danger" id="confirmDelete">Delete</button>
            </div>
        </div>
    </div>

    <!-- Clear DB Confirmation Modal (3D) -->
    <div class="modal-overlay" id="clearDbModal">
        <div class="modal">
            <div class="modal-header">
                <h3>Clear Database</h3>
                <button class="modal-close" id="closeClearDbModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body" style="text-align: center;">
                <div class="clear-db-icon-container">
                    <div class="trash-lid"></div>
                    <div class="trash-can">
                        <div class="trash-line"></div>
                        <div class="trash-line"></div>
                    </div>
                </div>
                <p>Are you sure? This will <strong>permanently delete</strong> all processed documents and vectors.</p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn cancel" id="cancelClearDb">Cancel</button>
                <button class="modal-btn danger" id="confirmClearDb">Yes, Clear All</button>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>

</html>