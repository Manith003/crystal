document.addEventListener('DOMContentLoaded', function() {
    // Chat elements
    const chatContainer = document.getElementById('chatContainer');
    const chatOpenButton = document.getElementById('chatOpenButton');
    const chatMinimizeBtn = document.getElementById('chatMinimizeBtn');
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

    // Enhanced knowledge base from your original code
    const boxKnowledge = {
        types: {
            cardboard: "Our cardboard boxes are durable and eco-friendly, perfect for shipping and storage needs. We offer single-wall, double-wall, and triple-wall options to accommodate items of various weights and fragility levels. Our cardboard is sourced from sustainable forests and contains recycled content.",
            cotton: "Cotton boxes provide a premium feel and are ideal for luxury product packaging. These boxes feature a cotton-wrapped exterior that offers an elegant texture and appearance. Commonly used for jewelry, high-end cosmetics, and premium gifting solutions.",
            custom: "We offer fully customizable box solutions tailored to your specific needs. From custom dimensions and structural designs to personalized printing and finish options, we can create packaging that perfectly represents your brand and product requirements.",
            mailer: "Our mailer boxes offer a premium unboxing experience with a self-locking design that doesn't require tape for assembly. Perfect for e-commerce and subscription boxes, they feature easy-open tear strips for customer convenience.",
            rigid: "Rigid boxes provide premium packaging with exceptional durability and a luxury feel. These boxes don't collapse and maintain their shape, making them ideal for high-end products, electronics, and luxury retail packaging.",
            folding: "Folding carton boxes are lightweight yet sturdy, making them ideal for retail products. They're highly customizable with various printing options and come flat-packed to save storage space.",
            shipping: "Our shipping boxes are designed for maximum protection during transit. They feature reinforced corners, multiple thickness options, and are tested for stacking strength and drop resistance."
        },
        materials: {
            corrugated: "Our corrugated materials feature fluted paper sandwiched between liner sheets, providing excellent cushioning and protection. Available in various flute profiles and strengths, our corrugated rolls can be used for custom box manufacturing, void fill, and product protection during shipping.",
            dullex: "Duplex board (also known as duplex) combines two layers of paper with different characteristics. The outer layer typically offers good printability, while the inner layer provides strength. Ideal for retail packaging, display boxes, and folders with GSM ranges from 230-450.",
            itc: "ITC board white pack is premium packaging board with excellent whiteness, smoothness, and printability. The superior surface provides outstanding color reproduction and print definition, making it perfect for high-quality packaging that requires vibrant graphics and precise branding.",
            kraft: "Kraft paper is known for its strength, durability, and natural appearance. Our kraft packaging solutions include boxes, bags, and wrapping materials that are environmentally friendly and provide a rustic, organic aesthetic for your products.",
            microfute: "Microflute is an extremely fine corrugated material that combines the printability of carton board with the protection of corrugated board. It offers excellent cushioning while maintaining a premium appearance, ideal for electronics, cosmetics, and premium beverages."
        },
        specifications: {
            gsm: {
                "120": "120 GSM - Lightweight option suitable for smaller items and inner packaging. This weight is often used for document envelopes, lightweight product inserts, and simple retail packaging.",
                "140": "140 GSM - Medium weight, good for general packaging needs. Provides reasonable durability while maintaining cost-effectiveness. Common for product catalogs, small retail boxes, and lightweight product packaging.",
                "180": "180 GSM - Heavy duty option for more substantial items. This weight provides good rigidity and durability, making it suitable for folders, medium-sized boxes, and packaging for heavier retail items.",
                "200": "200 GSM - Extra strong, ideal for heavier products requiring additional protection. This weight offers excellent durability and structural integrity for packaging items that need extra support.",
                "250": "250 GSM - Premium thickness providing substantial rigidity and durability. Commonly used for high-end packaging, rigid boxes, and products requiring exceptional presentation.",
                "300": "300 GSM - Heavy-duty board with excellent rigidity and durability. Perfect for luxury packaging, gift boxes, and items requiring superior protection and presentation.",
                "350": "350 GSM - Very heavy board providing exceptional strength and quality feel. Used for premium packaging applications where durability and luxury presentation are crucial."
            },
            flute: {
                "a": "A flute (5mm) - The thickest standard flute profile, providing maximum cushioning and protection. Ideal for fragile items or heavy products requiring significant protection.",
                "b": "B flute (3mm) - Medium thickness, provides good cushioning and flat surface for printing. B flute offers an excellent balance between protection and printability, making it versatile for various packaging applications.",
                "c": "C flute (4mm) - Thicker profile with excellent crushing resistance, ideal for heavier items. C flute is commonly used for standard shipping boxes and product packaging requiring good stacking strength.",
                "e": "E flute (1.5mm) - Thin profile, perfect for retail packaging with excellent printability. E flute offers good protection while maintaining a sleek appearance, making it ideal for retail-ready packaging.",
                "f": "F flute (0.8mm) - Ultra-thin flute offering excellent printability while still providing protection. F flute is ideal for high-end retail packaging and folding cartons that require a premium appearance.",
                "bc": "BC double wall (7mm) - Combines B and C flutes for exceptional strength and protection. This combination is ideal for heavy or fragile items requiring maximum protection during shipping and handling."
            },
            coatings: {
                "varnish": "Varnish coating provides a protective layer that enhances color vibrancy and protects against scratching. Available in gloss, satin, or matte finishes.",
                "aqueous": "Aqueous coating is an environmentally friendly water-based coating that provides good protection and aesthetic enhancement. Available in gloss, satin, or matte finishes.",
                "uv": "UV coating offers superior gloss and protection through a cured ultraviolet treatment. This premium finish provides excellent scuff resistance and color enhancement.",
                "lamination": "Lamination applies a thin plastic film to the packaging surface, providing maximum protection and enhancement. Available in gloss, matte, or soft-touch finishes."
            }
        },
        applications: {
            retail: "Our retail packaging solutions are designed to stand out on shelves while protecting products effectively. We offer custom designs, window options, and various finishing techniques to enhance brand visibility.",
            ecommerce: "Our e-commerce packaging is optimized for shipping durability, unboxing experience, and return-friendliness. We focus on creating memorable customer experiences while ensuring products arrive intact.",
            food: "Our food packaging solutions meet all safety regulations and are available with various protective barriers to maintain freshness. Options include grease-resistant, moisture-resistant, and temperature-resistant treatments.",
            industrial: "Our industrial packaging provides maximum protection for heavy or sensitive equipment during storage and transit. Features include reinforced corners, custom inserts, and moisture barriers.",
            cosmetics: "Our cosmetic packaging combines elegant design with practical protection. We offer luxurious finishes, custom inserts, and sustainable options to enhance your brand's appeal.",
            electronics: "Our electronics packaging includes anti-static options, custom foam inserts, and strong structural designs to protect sensitive components during shipping and retail display."
        },
        sustainability: {
            materials: "We offer a range of eco-friendly packaging materials, including recycled content board, biodegradable options, and sustainably sourced virgin fibers certified by FSC or PEFC.",
            practices: "Our manufacturing processes minimize waste, utilize energy-efficient equipment, and employ water-based inks and adhesives to reduce environmental impact.",
            certifications: "Our packaging can be certified with various eco-labels including FSC, PEFC, Biodegradable Products Institute, and Sustainable Forestry Initiative, depending on your requirements."
        },
        contact: "Please fill out our 'Get in Touch' form with your details and requirements so we can provide a customized solution for your packaging needs. Include information about your product dimensions, quantities needed, and any specific design requirements for the most accurate quote.",
        website: "For the full experience, please scroll through our website to see our complete range of products and services. You'll find detailed galleries, case studies, and more information about our sustainable packaging solutions."
    };

    // Refined quick reply options with more premium categories
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
        
        // Add entry animation
        chatContainer.style.animation = 'fadeInUp 0.4s ease-out forwards';
        
        // If first time opening, show welcome message with typing indicator
        if (chatState.isFirstOpen) {
            chatState.isFirstOpen = false;
            setTimeout(() => {
                addMessage("👋 Hi there! I'm your Box Solutions assistant. How can I help you today?", false);
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

    // Minimize chat when clicking minimize button
    chatMinimizeBtn.addEventListener('click', function() {
        // Add exit animation
        chatContainer.style.animation = 'fadeInUp 0.3s ease-in reverse';
        
        setTimeout(() => {
            chatContainer.classList.add('hidden');
            chatOpenButton.classList.remove('hidden');
            chatState.isOpen = false;
        }, 280);
    });

    // Close chat when clicking close button
    chatCloseBtn.addEventListener('click', function() {
        // Add exit animation
        chatContainer.style.animation = 'fadeInUp 0.3s ease-in reverse';
        
        setTimeout(() => {
            chatContainer.classList.add('hidden');
            chatOpenButton.classList.remove('hidden');
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
            p.innerHTML = paragraph; // Use innerHTML to support HTML from parseLinks
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
        }, 100);
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
        const displayCount = isMobile ? 5 : contextualReplies.length;
        
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
        const wordsPerMinute = 300; // Simulated typing speed
        const response = generateResponse(message.toLowerCase());
        const words = response.split(' ').length;
        const typingTime = Math.min(Math.max((words / wordsPerMinute) * 60000, 800), 3000);
        
        // Process the message and respond after a calculated delay
        setTimeout(() => {
            removeTypingIndicator();
            addMessage(response);
        }, typingTime);
    }

    // Generate response based on user input - using your existing function
    function generateResponse(input) {
        // Using your existing response generation logic
        if (input.includes('cardboard') || (input.includes('card') && input.includes('box'))) {
            return boxKnowledge.types.cardboard;
        }
        else if (input.includes('cotton') || (input.includes('cotton') && input.includes('box'))) {
            return boxKnowledge.types.cotton;
        }
        else if (input.includes('custom') || input.includes('customiz') || input.includes('personali')) {
            return boxKnowledge.types.custom + "\n\n" + boxKnowledge.contact;
        }
        else if (input.includes('corrugated') || input.includes('roll')) {
            return boxKnowledge.materials.corrugated;
        }
        else if (input.includes('dullex') || input.includes('duplex') || input.includes('dullex board')) {
            return boxKnowledge.materials.dullex;
        }
        else if (input.includes('itc') || input.includes('white pack') || input.includes('itc board')) {
            return boxKnowledge.materials.itc;
        }
        else if (input.includes('kraft') || input.includes('kraft paper')) {
            return boxKnowledge.materials.kraft;
        }
        else if (input.includes('microflute') || input.includes('micro flute')) {
            return boxKnowledge.materials.microflute;
        }
        else if (input.includes('gsm') || input.includes('gram') || input.includes('weight')) {
            let response = "Here's information about our GSM options (grams per square meter - paper weight):\n\n";
            response += boxKnowledge.specifications.gsm["120"] + "\n\n";
            response += boxKnowledge.specifications.gsm["140"] + "\n\n";
            response += boxKnowledge.specifications.gsm["180"] + "\n\n";
            response += boxKnowledge.specifications.gsm["200"] + "\n\n";
            response += boxKnowledge.specifications.gsm["250"] + "\n\n";
            response += boxKnowledge.specifications.gsm["300"] + "\n\n";
            response += boxKnowledge.specifications.gsm["350"];
            return response;
        }
        else if (input.includes('120') || input.includes('140') || input.includes('180') || input.includes('200')) {
            let response = "Here's information about our common GSM options:\n\n";
            response += boxKnowledge.specifications.gsm["120"] + "\n\n";
            response += boxKnowledge.specifications.gsm["140"] + "\n\n";
            response += boxKnowledge.specifications.gsm["180"] + "\n\n";
            response += boxKnowledge.specifications.gsm["200"];
            return response;
        }
        else if (input.includes('250') || input.includes('300') || input.includes('350')) {
            let response = "Here's information about our premium GSM options:\n\n";
            response += boxKnowledge.specifications.gsm["250"] + "\n\n";
            response += boxKnowledge.specifications.gsm["300"] + "\n\n";
            response += boxKnowledge.specifications.gsm["350"];
            return response;
        }
        else if (input.includes('flute') || input.includes('flute type')) {
            let response = "Here's information about our flute types:\n\n";
            response += boxKnowledge.specifications.flute["a"] + "\n\n";
            response += boxKnowledge.specifications.flute["b"] + "\n\n";
            response += boxKnowledge.specifications.flute["c"] + "\n\n";
            response += boxKnowledge.specifications.flute["e"] + "\n\n";
            response += boxKnowledge.specifications.flute["f"] + "\n\n";
            response += boxKnowledge.specifications.flute["bc"];
            return response;
        }
        else if (input.includes('flute a') || input.includes('a flute')) {
            return "A flute (5mm): " + boxKnowledge.specifications.flute["a"];
        }
        else if (input.includes('flute b') || input.includes('b flute')) {
            return "B flute (3mm): " + boxKnowledge.specifications.flute["b"];
        }
        else if (input.includes('flute c') || input.includes('c flute')) {
            return "C flute (4mm): " + boxKnowledge.specifications.flute["c"];
        }
        else if (input.includes('flute e') || input.includes('e flute')) {
            return "E flute (1.5mm): " + boxKnowledge.specifications.flute["e"];
        }
        else if (input.includes('flute f') || input.includes('f flute')) {
            return "F flute (0.8mm): " + boxKnowledge.specifications.flute["f"];
        }
        else if (input.includes('coating') || input.includes('finish')) {
            let response = "We offer various coating options for your packaging:\n\n";
            response += "Varnish: " + boxKnowledge.specifications.coatings["varnish"] + "\n\n";
            response += "Aqueous: " + boxKnowledge.specifications.coatings["aqueous"] + "\n\n";
            response += "UV Coating: " + boxKnowledge.specifications.coatings["uv"] + "\n\n";
            response += "Lamination: " + boxKnowledge.specifications.coatings["lamination"];
            return response;
        }
        else if (input.includes('mailer') || input.includes('mail box')) {
            return boxKnowledge.types.mailer;
        }
        else if (input.includes('rigid')) {
            return boxKnowledge.types.rigid;
        }
        else if (input.includes('folding') || input.includes('carton')) {
            return boxKnowledge.types.folding;
        }
        else if (input.includes('shipping') || input.includes('ship')) {
            return boxKnowledge.types.shipping;
        }
        else if (input.includes('retail') || input.includes('store') || input.includes('display')) {
            return "Retail Packaging: " + boxKnowledge.applications.retail;
        }
        else if (input.includes('ecommerce') || input.includes('e-commerce') || input.includes('online')) {
            return "E-commerce Packaging: " + boxKnowledge.applications.ecommerce;
        }
        else if (input.includes('food') || input.includes('restaurant') || input.includes('takeout')) {
            return "Food Packaging: " + boxKnowledge.applications.food;
        }
        else if (input.includes('industrial') || input.includes('heavy') || input.includes('warehouse')) {
            return "Industrial Packaging: " + boxKnowledge.applications.industrial;
        }
        else if (input.includes('cosmetic') || input.includes('beauty') || input.includes('makeup')) {
            return "Cosmetics Packaging: " + boxKnowledge.applications.cosmetics;
        }
        else if (input.includes('electronic') || input.includes('tech') || input.includes('device')) {
            return "Electronics Packaging: " + boxKnowledge.applications.electronics;
        }
        else if (input.includes('sustainable') || input.includes('eco') || input.includes('green') || input.includes('environment')) {
            let response = "Our Sustainable Packaging Solutions:\n\n";
            response += "Sustainable Materials: " + boxKnowledge.sustainability.materials + "\n\n";
            response += "Sustainable Practices: " + boxKnowledge.sustainability.practices + "\n\n";
            response += "Certifications: " + boxKnowledge.sustainability.certifications;
            return response;
        }
        else if (input.includes('contact') || input.includes('get in touch') || input.includes('form') || input.includes('call') || input.includes('email') || input.includes('quote')) {
            return boxKnowledge.contact + "\n\n" + boxKnowledge.website;
        }
        else if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('greetings')) {
            return "Hello! I'm your Box Solutions assistant. I can provide information about our premium packaging solutions, custom designs, materials, specifications, and sustainability initiatives. How can I assist you today?";
        }
        else if (input.includes('thank')) {
            return "You're welcome! It's been my pleasure to assist you with your packaging needs. Feel free to reach out anytime with more questions about our premium box solutions. " + boxKnowledge.website;
        }
        else if (input.includes('website') || input.includes('more info') || input.includes('learn more')) {
            return boxKnowledge.website;
        }
        else if (input.includes('price') || input.includes('cost') || input.includes('quote') || input.includes('pricing')) {
            return "Our pricing is customized based on your specific requirements including box type, dimensions, material quality, order volume, and finishing options. For a detailed quote tailored to your needs, please fill out our 'Get in Touch' form with your project specifications.";
        }
        else if (input.includes('type') || input.includes('kind') || input.includes('what box')) {
            let response = "We offer a comprehensive range of premium box solutions:\n\n";
            response += "• Cardboard Boxes: " + boxKnowledge.types.cardboard + "\n\n";
            response += "• Mailer Boxes: " + boxKnowledge.types.mailer + "\n\n";
            response += "• Rigid Boxes: " + boxKnowledge.types.rigid + "\n\n";
            response += "• Folding Cartons: " + boxKnowledge.types.folding + "\n\n";
            response += "• Cotton Boxes: " + boxKnowledge.types.cotton + "\n\n";
            response += "• Custom Boxes: " + boxKnowledge.types.custom;
            return response;
        }
        else if (input.includes('material') || input.includes('board')) {
            let response = "We utilize premium materials for our packaging solutions:\n\n";
            response += "• Corrugated Board: " + boxKnowledge.materials.corrugated + "\n\n";
            response += "• Duplex Board: " + boxKnowledge.materials.dullex + "\n\n";
            response += "• ITC Board: " + boxKnowledge.materials.itc + "\n\n";
            response += "• Kraft Paper: " + boxKnowledge.materials.kraft + "\n\n";
            response += "• Microflute: " + boxKnowledge.materials.microfute;
            return response;
        }
        else if (input.includes('premium') || input.includes('luxury') || input.includes('high end')) {
            return "Our premium packaging solutions include rigid boxes, cotton boxes, and custom designed packaging with high-end finishes like soft-touch lamination, foil stamping, embossing, and spot UV. These luxury options are perfect for high-value products, gifts, and brand experiences that require exceptional presentation.";
        }
        else {
            return "I'm here to help with all your premium packaging needs. I can provide information about our box types (cardboard, mailer, rigid, cotton), materials, specifications (GSM 120-350, flute types A-F), custom branding options, and sustainable solutions. How may I assist with your packaging requirements today?";
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