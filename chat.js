/* ============================================
   CHAT.JS - Chat Functionality
   ============================================ */

// Sample conversation data
const conversationsData = [
    {
        id: 1,
        user: {
            id: 1,
            name: "Priya Sharma",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/women/44.jpg)",
            isOnline: true
        },
        product: {
            id: 1,
            title: "Engineering Mathematics - Volume 1 & 2",
            image: "[images.unsplash.com](https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100)",
            price: 450
        },
        lastMessage: "Is the book still available?",
        lastMessageTime: "2025-05-17T10:30:00",
        unreadCount: 2,
        messages: [
            { id: 1, text: "Hi! I saw your listing for the math books", sender: "me", time: "2025-05-17T10:00:00" },
            { id: 2, text: "Yes, they are still available!", sender: "other", time: "2025-05-17T10:05:00" },
            { id: 3, text: "Great! Can you share more photos?", sender: "me", time: "2025-05-17T10:15:00" },
            { id: 4, text: "Is the book still available?", sender: "other", time: "2025-05-17T10:30:00" }
        ]
    },
    {
        id: 2,
        user: {
            id: 2,
            name: "Rahul Verma",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/men/32.jpg)",
            isOnline: false
        },
        product: {
            id: 2,
            title: "HP Laptop - Intel i5, 8GB RAM",
            image: "[images.unsplash.com](https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100)",
            price: 35000
        },
        lastMessage: "Can we meet tomorrow at 4 PM?",
        lastMessageTime: "2025-05-16T18:45:00",
        unreadCount: 0,
        messages: [
            { id: 1, text: "Hi, interested in your laptop", sender: "me", time: "2025-05-16T14:00:00" },
            { id: 2, text: "Hello! Yes, it's available. Would you like to see it?", sender: "other", time: "2025-05-16T14:30:00" },
            { id: 3, text: "Yes please! When can we meet?", sender: "me", time: "2025-05-16T15:00:00" },
            { id: 4, text: "Can we meet tomorrow at 4 PM?", sender: "other", time: "2025-05-16T18:45:00" }
        ]
    },
    {
        id: 3,
        user: {
            id: 3,
            name: "Ankit Singh",
            avatar: "[randomuser.me](https://randomuser.me/api/portraits/men/45.jpg)",
            isOnline: true
        },
        product: null,
        lastMessage: "Thanks for the smooth transaction!",
        lastMessageTime: "2025-05-15T09:20:00",
        unreadCount: 0,
        messages: [
            { id: 1, text: "Got the racket, thanks!", sender: "me", time: "2025-05-15T09:00:00" },
            { id: 2, text: "Thanks for the smooth transaction!", sender: "other", time: "2025-05-15T09:20:00" }
        ]
    }
];

// State
let currentConversation = null;
let currentUser = {
    id: 'me',
    name: 'You',
    avatar: '[randomuser.me](https://randomuser.me/api/portraits/men/32.jpg)'
};

// DOM Elements
const conversationsList = document.getElementById('conversations-list');
const conversationsPanel = document.getElementById('conversations-panel');
const chatEmpty = document.getElementById('chat-empty');
const chatActive = document.getElementById('chat-active');
const messagesContainer = document.getElementById('messages-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const backToListBtn = document.getElementById('back-to-list');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderConversations();
    setupEventListeners();
    checkURLParams();
});

function setupEventListeners() {
    // Message form submit
    messageForm.addEventListener('submit', handleSendMessage);
    
    // Back to list (mobile)
    backToListBtn.addEventListener('click', () => {
        conversationsPanel.classList.remove('hidden');
        currentConversation = null;
    });
    
    // Search conversations
    document.getElementById('conversation-search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterConversations(query);
    });
}

function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    const sellerId = params.get('seller');
    const productId = params.get('product');
    
    if (sellerId) {
        // Find or create conversation with this seller
        let conversation = conversationsData.find(c => c.user.id === parseInt(sellerId));
        
        if (conversation) {
            openConversation(conversation.id);
        } else {
            // Create new conversation placeholder
            // In production, this would create a new conversation via API
        }
    }
}

function renderConversations() {
    conversationsList.innerHTML = conversationsData.map(conv => `
        <div class="conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}" 
             data-id="${conv.id}" onclick="openConversation(${conv.id})">
            <div class="conversation-avatar">
                <img src="${conv.user.avatar}" alt="${conv.user.name}">
                ${conv.user.isOnline ? '<span class="online-indicator"></span>' : ''}
            </div>
            <div class="conversation-info">
                <div class="conversation-header">
                    <span class="conversation-name">${conv.user.name}</span>
                    <span class="conversation-time">${formatMessageTime(conv.lastMessageTime)}</span>
                </div>
                <div class="conversation-preview">
                    <p>${conv.lastMessage}</p>
                    ${conv.unreadCount > 0 ? `<span class="unread-badge">${conv.unreadCount}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function openConversation(id) {
    currentConversation = conversationsData.find(c => c.id === id);
    
    if (!currentConversation) return;
    
    // Update UI
    chatEmpty.style.display = 'none';
    chatActive.style.display = 'flex';
    
    // Update header
    document.getElementById('chat-user-avatar').src = currentConversation.user.avatar;
    document.getElementById('chat-user-name').textContent = currentConversation.user.name;
    document.getElementById('chat-user-status').textContent = currentConversation.user.isOnline ? 'Online' : 'Offline';
    document.getElementById('chat-user-status').style.color = currentConversation.user.isOnline ? '#22c55e' : 'var(--gray-500)';
    
    // Update product reference
    const productRef = document.getElementById('chat-product-ref');
    if (currentConversation.product) {
        productRef.style.display = 'flex';
        document.getElementById('ref-product-image').src = currentConversation.product.image;
        document.getElementById('ref-product-title').textContent = currentConversation.product.title;
        document.getElementById('ref-product-price').textContent = formatPrice(currentConversation.product.price);
        document.getElementById('view-product-btn').href = `product.html?id=${currentConversation.product.id}`;
    } else {
        productRef.style.display = 'none';
    }
    
    // Render messages
    renderMessages();
    
    // Update conversation list
    renderConversations();
    
    // Hide panel on mobile
    if (window.innerWidth <= 768) {
        conversationsPanel.classList.add('hidden');
    }
    
    // Clear unread
    currentConversation.unreadCount = 0;
    
    // Focus input
    messageInput.focus();
    
    // Scroll to bottom
    scrollToBottom();
}

function renderMessages() {
    if (!currentConversation) return;
    
    let messagesHTML = '';
    let lastDate = '';
    
    currentConversation.messages.forEach(msg => {
        const messageDate = new Date(msg.time).toDateString();
        
        // Add date separator if needed
        if (messageDate !== lastDate) {
            messagesHTML += `
                <div class="date-separator">
                    <span>${formatDateSeparator(msg.time)}</span>
                </div>
            `;
            lastDate = messageDate;
        }
        
        const isSent = msg.sender === 'me';
        messagesHTML += `
            <div class="message ${isSent ? 'sent' : 'received'}">
                ${!isSent ? `<img src="${currentConversation.user.avatar}" alt="" class="message-avatar">` : ''}
                <div class="message-content">
                    <div class="message-bubble">${msg.text}</div>
                    <span class="message-time">${formatTime(msg.time)}</span>
                </div>
            </div>
        `;
    });
    
    messagesContainer.innerHTML = messagesHTML;
    scrollToBottom();
}

function handleSendMessage(e) {
    e.preventDefault();
    
    const text = messageInput.value.trim();
    if (!text || !currentConversation) return;
    
    // Add message
    const newMessage = {
        id: Date.now(),
        text: text,
        sender: 'me',
        time: new Date().toISOString()
    };
    
    currentConversation.messages.push(newMessage);
    currentConversation.lastMessage = text;
    currentConversation.lastMessageTime = newMessage.time;
    
    // Clear input
    messageInput.value = '';
    
    // Re-render
    renderMessages();
    renderConversations();
    
    // Simulate reply (for demo)
    setTimeout(() => {
        simulateReply();
    }, 1500);
}

function simulateReply() {
    if (!currentConversation) return;
    
    const replies = [
        "That sounds good!",
        "Sure, I'll check and let you know.",
        "Thanks for your interest!",
        "Can we discuss this tomorrow?",
        "I'll send you more details shortly."
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    const replyMessage = {
        id: Date.now(),
        text: randomReply,
        sender: 'other',
        time: new Date().toISOString()
    };
    
    currentConversation.messages.push(replyMessage);
    currentConversation.lastMessage = randomReply;
    currentConversation.lastMessageTime = replyMessage.time;
    
    renderMessages();
    renderConversations();
}

function filterConversations(query) {
    const items = document.querySelectorAll('.conversation-item');
    items.forEach(item => {
        const name = item.querySelector('.conversation-name').textContent.toLowerCase();
        const preview = item.querySelector('.conversation-preview p').textContent.toLowerCase();
        
        if (name.includes(query) || preview.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Utility Functions
function formatMessageTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return formatTime(dateString);
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatDateSeparator(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long', 
            day: 'numeric'
        });
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}
