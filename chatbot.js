document.addEventListener('DOMContentLoaded', function() {
    // Chat elements
    const chatContainer = document.getElementById('chatContainer');
    const chatOpenButton = document.getElementById('chatOpenButton');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const messagesContainer = document.getElementById('messages');


    // Keep track of chat state
    let chatState = {
        isOpen: false,
        isFirstOpen: true,
        lastMessage: null
    };
    

    // Initially hide the chat container
    chatContainer.classList.add('hidden');
    chatOpenButton.classList.remove('hidden');

    // Refined knowledge base with smaller, cleaner information
    const boxKnowledge = {
        types: {
            cardboard: "Crystal Packaging's cardboard boxes are durable and eco-friendly. Available in single, double, or triple-wall options for different product weights. Made from sustainable materials with recycled content.",
            cotton: "Our premium cotton boxes offer elegant texture for luxury products. Perfect for jewelry, cosmetics, and high-end gifts. Crystal Packaging's signature luxury solution.",
            custom: "Crystal Packaging creates fully customizable box solutions tailored to your needs. Custom dimensions, designs, printing, and finishes that perfectly represent your brand.",
            mailer: "Our premium e-commerce mailer boxes feature self-locking designs without tape. Perfect for online retailers with easy-open tear strips for better customer experience.",
            rigid: "Crystal Packaging's rigid boxes provide exceptional durability with a luxury feel. These non-collapsible boxes maintain their shape, ideal for high-end products and electronics.",
            folding: "Our lightweight yet sturdy folding cartons are ideal for retail products. Fully customizable and ship flat to save storage space.",
            shipping: "Crystal Packaging's shipping boxes feature reinforced corners and multiple thickness options. Tested for stacking strength and drop resistance to ensure maximum protection."
        },
        materials: {
            corrugated: "Our corrugated materials provide excellent cushioning with fluted paper between liner sheets. Available in various profiles for custom packaging needs.",
            dullex: "Duplex board combines two paper layers with different properties - outer layer for printing quality, inner layer for strength. Ideal for retail packaging (230-450 GSM).",
            itc: "Premium ITC board offers excellent whiteness, smoothness, and printability for vibrant graphics and precise branding. Crystal Packaging's choice for high-end visual presentation.",
            kraft: "Environmentally friendly kraft paper provides strength with natural appearance. Perfect for boxes and wrapping with rustic, organic aesthetic.",
            microflute: "Crystal Packaging's microflute combines carton board printability with corrugated protection. Premium appearance for electronics and cosmetics packaging."
        },
        specifications: {
            gsm: {
                "120-200": "Standard options (120-200 GSM): Lightweight to medium-weight options for general packaging. Crystal Packaging recommends 180-200 GSM for better durability in everyday products.",
                "250-350": "Premium options (250-350 GSM): Substantial rigidity and strength for luxury packaging. Crystal Packaging's choice for premium brand experiences and product protection."
            },
            flute: {
                "thick": "Thicker flutes (A 5mm, B 3mm, C 4mm): Greater protection and cushioning for fragile or heavy items. Crystal Packaging recommends for shipping valuable products.",
                "thin": "Thinner flutes (E 1.5mm, F 0.8mm): Better printability while maintaining protection. Ideal for Crystal Packaging's retail-ready premium packaging.",
                "double": "Double wall (BC 7mm): Crystal Packaging's strongest option for exceptional protection of heavy or fragile items during shipping and handling."
            },
            coatings: {
                "standard": "Standard finishes: Varnish (enhances vibrancy) and Aqueous coating (eco-friendly protection). Available in gloss, satin, or matte.",
                "premium": "Premium finishes: UV coating (superior gloss and protection) and Lamination (maximum enhancement with gloss, matte, or soft-touch). Crystal Packaging's luxury finishing options."
            }
        },
        applications: {
            retail: "Crystal Packaging's retail solutions stand out on shelves while protecting products. Custom designs with window options and premium finishing techniques.",
            ecommerce: "Our e-commerce packaging optimizes shipping durability and unboxing experience. Designed for memorable customer impressions and product protection.",
            food: "Crystal Packaging's food-safe solutions meet all regulations with protective barriers for freshness. Options include grease-resistant and temperature-resistant treatments.",
            cosmetics: "Our cosmetic packaging combines elegant design with practical protection. Crystal Packaging offers luxurious finishes and custom inserts for premium brands."
        },
        sustainability: "Crystal Packaging is committed to sustainability with recycled materials, eco-friendly production processes, and certifications including FSC, PEFC, and Sustainable Forestry Initiative.",
        contact: "Contact Crystal Packaging by filling out our 'Get in Touch' form with your product details for a customized packaging solution and accurate quote.",
        aboutUs: "Crystal Packaging is a premier provider of premium packaging solutions. We combine quality materials, innovative designs, and sustainable practices to create packaging that elevates your brand and protects your products."
    };

    // Refined quick reply options 
    const quickReplies = [
        "Premium box solutions",
        "Sustainable packaging",
        "Custom branding options",
        "E-commerce packaging",
        "Luxury boxes",
        "Material specifications",
        "Get a quote",
        "Contact us"
    ];

    // Open chat when clicking the open button with enhanced animation
    chatOpenButton.addEventListener('click', function() {
        chatState.isOpen = true;
        chatContainer.classList.remove('hidden');
        chatOpenButton.classList.add('hidden');
        chatContainer.classList.add('active')
        
        // Add entry animation
        chatContainer.style.animation = 'fadeInUp 0.4s ease-out forwards';

        
        // If first time opening, show welcome message with typing indicator
        if (chatState.isFirstOpen) {
            chatState.isFirstOpen = false;
            setTimeout(() => {
                addMessage("👋 Hi there! I'm your Crystal Packaging assistant. How can I help you today?", false);
                setTimeout(() => {
                    addMessage("I can provide information about our premium packaging solutions, materials, customization options, and sustainability initiatives.", false);
                }, 500);
            }, 500);
        }
        
        // Set focus on input after a short delay
        setTimeout(() => {
            userInput.focus();
        }, 600);
        
        // Scroll to bottom of chat
        scrollToBottom();
    });

    chatCloseBtn.addEventListener('click', function() {
        // Add exit animation
        chatContainer.style.animation = 'fadeInUp 0.3s ease-in reverse';
        
        setTimeout(() => {
            chatContainer.classList.add('hidden');
            chatOpenButton.classList.remove('hidden');
             chatContainer.classList.remove('active');
            chatState.isOpen = false;
        }, 280);
    });

    // Send message when clicking send button
    sendBtn.addEventListener('click', sendMessage);

    // Send message when pressing Enter key
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Focus on input when clicking anywhere in the chat input area
    document.querySelector('.chat-input').addEventListener('click', function() {
        userInput.focus();
    });

    // Function to add a message to the chat with enhanced animation
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Parse links in text
        text = parseLinks(text);
        
        // Split text by paragraphs and create separate p elements
        const paragraphs = text.split('\n').filter(p => p.trim() !== '');
        
        paragraphs.forEach((paragraph, index) => {
            const p = document.createElement('p');
            p.className = 'message-text';
            p.innerHTML = paragraph; 
            messageContent.appendChild(p);
        });
        
        // Add timestamp
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        const now = new Date();
        timestamp.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        messageContent.appendChild(timestamp);
        
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        
        // Add hover effect to messages
        messageDiv.addEventListener('mouseover', function() {
            messageContent.style.transform = 'translateY(-2px)';
        });
        
        messageDiv.addEventListener('mouseout', function() {
            messageContent.style.transform = 'translateY(0)';
        });
        
        // Store last message for context
        chatState.lastMessage = {
            text: text,
            isUser: isUser
        };
        
        // If it's a bot message, add quick replies after a delay
        if (!isUser && !text.includes("typing...")) {
            setTimeout(() => {
                addQuickReplies();
            }, 600);
        }
        
        // Scroll to the bottom of the messages
        scrollToBottom();
    }

    // Function to parse links in text
    function parseLinks(text) {
        // Replace URLs with HTML links
        return text.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
    }

    // Scroll to bottom function with smooth animation
    function scrollToBottom() {
        setTimeout(() => {
            messagesContainer.scrollTo({
                top: messagesContainer.scrollHeight,
                behavior: 'smooth'
            });
        }, 1000);
    }

    // Add typing indicator with improved animation
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingDiv.appendChild(dot);
        }
        
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Add quick reply options with improved styling
    function addQuickReplies() {
        // Remove existing quick replies
        const existingReplies = document.querySelector('.quick-replies');
        if (existingReplies) {
            existingReplies.remove();
        }
        
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'quick-replies';
        
        // Select appropriate quick replies based on context
        let contextualReplies = [...quickReplies];
        
        // If last message mentioned specific topics, show related quick replies
        if (chatState.lastMessage && !chatState.lastMessage.isUser) {
            const lastText = chatState.lastMessage.text.toLowerCase();
            
            if (lastText.includes('cardboard') || lastText.includes('material')) {
                contextualReplies = [
                    "GSM options", 
                    "Flute types",
                    "Corrugated vs Kraft?", 
                    "Sustainable materials",
                    "Custom printing"
                ];
            } else if (lastText.includes('custom') || lastText.includes('brand')) {
                contextualReplies = [
                    "Custom box options", 
                    "Branding capabilities", 
                    "Premium finishes",
                    "Minimum order quantity", 
                    "Design services"
                ];
            } else if (lastText.includes('eco') || lastText.includes('sustain')) {
                contextualReplies = [
                    "Recyclable options", 
                    "Eco-friendly inks", 
                    "FSC certification",
                    "Biodegradable boxes", 
                    "Carbon footprint"
                ];
            }
        }
        
        // Limit to 5 options on mobile
        const isMobile = window.innerWidth < 768;
        const displayCount = isMobile ? 4 : contextualReplies.length;
        
        contextualReplies.slice(0, displayCount).forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply;
            button.addEventListener('click', function() {
                userInput.value = reply;
                sendMessage();
            });
            quickRepliesDiv.appendChild(button);
        });
        
        messagesContainer.appendChild(quickRepliesDiv);
        scrollToBottom();
    }

    // Enhanced send message function with typing indicator and delay based on message length
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Calculate delay based on message length (more realistic typing simulation)
        const baseDelay = 1000;
        const wordsPerMinute = 400; // Slightly faster typing speed for better UX
        const response = generateResponse(message.toLowerCase());
        const words = response.split(' ').length;
        const typingTime = Math.min(Math.max((words / wordsPerMinute) * 60000, 800), 2000);
        
        // Process the message and respond after a calculated delay
        setTimeout(() => {
            removeTypingIndicator();
            addMessage(response);
        }, typingTime);
    }

    // Generate response based on user input
    function generateResponse(input) {
        const inputLower = input.toLowerCase();
        
        // Name/Company questions
        if (inputLower.includes('your name') || inputLower.includes('who are you')) {
            return "I'm the Crystal Packaging virtual assistant, here to help you find the perfect packaging solution for your products. How can I assist you today?";
        }
        
        // About the company
        if (inputLower.includes('about') && (inputLower.includes('crystal') || inputLower.includes('company'))) {
            return boxKnowledge.aboutUs;
        }
        
        // Box types
        if (inputLower.includes('cardboard') || (inputLower.includes('card') && inputLower.includes('box'))) {
            return boxKnowledge.types.cardboard;
        }
        else if (inputLower.includes('cotton')) {
            return boxKnowledge.types.cotton;
        }
        else if (inputLower.includes('custom') || inputLower.includes('customiz') || inputLower.includes('personali')) {
            return boxKnowledge.types.custom + "\n\n" + boxKnowledge.contact;
        }
        else if (inputLower.includes('mailer') || inputLower.includes('mail box') || inputLower.includes('e-commerce box')) {
            return boxKnowledge.types.mailer;
        }
        else if (inputLower.includes('rigid')) {
            return boxKnowledge.types.rigid;
        }
        else if (inputLower.includes('folding') || inputLower.includes('carton')) {
            return boxKnowledge.types.folding;
        }
        else if (inputLower.includes('shipping') || inputLower.includes('ship')) {
            return boxKnowledge.types.shipping;
        }
        
        // Materials
        else if (inputLower.includes('corrugated') || inputLower.includes('roll')) {
            return boxKnowledge.materials.corrugated;
        }
        else if (inputLower.includes('dullex') || inputLower.includes('duplex')) {
            return boxKnowledge.materials.dullex;
        }
        else if (inputLower.includes('itc') || inputLower.includes('white pack')) {
            return boxKnowledge.materials.itc;
        }
        else if (inputLower.includes('kraft')) {
            return boxKnowledge.materials.kraft;
        }
        else if (inputLower.includes('microflute') || inputLower.includes('micro flute')) {
            return boxKnowledge.materials.microflute;
        }
        
        // Specifications
        else if (inputLower.includes('gsm') || inputLower.includes('gram') || inputLower.includes('weight')) {
            return "Crystal Packaging offers various GSM options (paper weight):\n\n" + 
                boxKnowledge.specifications.gsm["120-200"] + "\n\n" + 
                boxKnowledge.specifications.gsm["250-350"];
        }
        else if (inputLower.includes('120') || inputLower.includes('140') || inputLower.includes('180') || inputLower.includes('200')) {
            return "Crystal Packaging's standard GSM options:\n\n" + boxKnowledge.specifications.gsm["120-200"];
        }
        else if (inputLower.includes('250') || inputLower.includes('300') || inputLower.includes('350')) {
            return "Crystal Packaging's premium GSM options:\n\n" + boxKnowledge.specifications.gsm["250-350"];
        }
        else if (inputLower.includes('flute')) {
            return "Crystal Packaging's flute options:\n\n" + 
                boxKnowledge.specifications.flute.thick + "\n\n" + 
                boxKnowledge.specifications.flute.thin + "\n\n" + 
                boxKnowledge.specifications.flute.double;
        }
        else if (inputLower.includes('coating') || inputLower.includes('finish')) {
            return "Crystal Packaging's coating options:\n\n" + 
                boxKnowledge.specifications.coatings.standard + "\n\n" + 
                boxKnowledge.specifications.coatings.premium;
        }
        
        // Applications
        else if (inputLower.includes('retail') || inputLower.includes('store') || inputLower.includes('display')) {
            return "Retail Packaging: " + boxKnowledge.applications.retail;
        }
        else if (inputLower.includes('ecommerce') || inputLower.includes('e-commerce') || inputLower.includes('online')) {
            return "E-commerce Packaging: " + boxKnowledge.applications.ecommerce;
        }
        else if (inputLower.includes('cosmetic') || inputLower.includes('beauty') || inputLower.includes('makeup')) {
            return "Cosmetics Packaging: " + boxKnowledge.applications.cosmetics;
        }
        
        // Sustainability
        else if (inputLower.includes('sustainable') || inputLower.includes('eco') || inputLower.includes('green') || inputLower.includes('environment')) {
            return "Crystal Packaging's Sustainability Commitment:\n\n" + boxKnowledge.sustainability;
        }
        
        // Contact information
        else if (inputLower.includes('contact') || inputLower.includes('get in touch') || inputLower.includes('form') || inputLower.includes('call') || inputLower.includes('email') || inputLower.includes('quote')) {
            return boxKnowledge.contact;
        }
        
        // Greetings
        else if (inputLower.includes('hello') || inputLower.includes('hi') || inputLower.includes('hey') || inputLower.includes('greetings')) {
            return "Hello! I'm your Crystal Packaging assistant. I can provide information about our premium packaging solutions including custom designs, materials, specifications, and sustainability initiatives. How can I assist you today?";
        }
        
        // Gratitude
        else if (inputLower.includes('thank')) {
            return "You're welcome! It's been my pleasure to assist you with your packaging needs. Feel free to reach out anytime with more questions about Crystal Packaging's premium solutions.";
        }
        
        // Types of boxes overview
        else if (inputLower.includes('type') || inputLower.includes('kind') || inputLower.includes('what box')) {
            return "Crystal Packaging offers a range of premium box solutions:\n\n" +
                "• Cardboard: Durable and eco-friendly for shipping and storage\n" +
                "• Mailer: Self-locking design for premium e-commerce unboxing\n" +
                "• Rigid: Premium non-collapsible boxes with luxury feel\n" +
                "• Folding: Lightweight cartons for efficient retail packaging\n" +
                "• Cotton: Textile-wrapped boxes for luxury product presentation\n" +
                "• Custom: Fully personalized solutions for your brand needs";
        }
        
        // Materials overview
        else if (inputLower.includes('material') || inputLower.includes('board')) {
            return "Crystal Packaging uses premium materials:\n\n" +
                "• Corrugated Board: Excellent cushioning for protection\n" +
                "• Duplex Board: Combines printability with strength\n" +
                "• ITC Board: Premium white surface for vibrant branding\n" +
                "• Kraft Paper: Eco-friendly with natural appearance\n" +
                "• Microflute: Fine corrugation with premium finish";
        }
        
        // Premium/luxury options
        else if (inputLower.includes('premium') || inputLower.includes('luxury') || inputLower.includes('high end')) {
            return "Crystal Packaging's premium solutions include rigid boxes, cotton-wrapped packaging, and custom designs with luxury finishes like soft-touch lamination, foil stamping, embossing, and spot UV. Perfect for high-value products and exceptional brand experiences.";
        }
        
        // Default response
        else {
            return "Welcome to Crystal Packaging! I can help with our premium box types, materials, custom branding options, and sustainability initiatives. What specific packaging solution are you looking for today?";
        }
    }

    // Enhance mobile experience by detecting device type
    function checkMobileDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            document.documentElement.classList.add('mobile-device');
            
            // Adjust chat size for mobile
            if (window.innerHeight < 700) {
                const chatBody = document.querySelector('.chat-body');
                if (chatBody) {
                    chatBody.style.height = 'calc(70vh - 120px)';
                }
            }
        }
    }

    // Handle window resize for better responsive behavior
    window.addEventListener('resize', function() {
        checkMobileDevice();
        if (chatState.isOpen) {
            scrollToBottom();
        }
    });

    // Improve scroll handling in chat messages
    messagesContainer.addEventListener('wheel', function(e) {
        e.stopPropagation();
        const atTop = this.scrollTop === 0;
        const atBottom = Math.abs(this.scrollHeight - this.scrollTop - this.clientHeight) < 5;
        
        if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Initialize mobile check
    checkMobileDevice();
    
    // Show open button animation
    setTimeout(() => {
        chatOpenButton.style.animation = 'pulseAndBounce 3s infinite alternate';
    }, 1000);
});