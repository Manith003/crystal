// Add this at the very beginning of your js file, before any other code
document.addEventListener('DOMContentLoaded', function() {
    // Create and show loader immediately
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-circle"></div>
            <div class="loader-text">Loading</div>
        </div>
    `;
    document.body.appendChild(loader);
    
    // Add styles for loader
    const style = document.createElement('style');
    style.textContent = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #0a0a0a;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .loader-content {
            text-align: center;
        }
        
        .loader-circle {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            margin: 0 auto 15px;
            animation: spin 1s infinite linear;
        }
        
        .loader-text {
            color: white;
            font-family: 'Montserrat', sans-serif;
            letter-spacing: 3px;
            font-size: 12px;
            text-transform: uppercase;
        }
        
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
        
        /* Hide all content initially */
        body > *:not(.page-loader) {
            opacity: 0;
            visibility: hidden;
        }
    `;
    document.head.appendChild(style);
    
    // Wait for window load to remove the loader
    window.addEventListener('load', function() {
        // Give a slight delay to ensure all assets are ready
        setTimeout(() => {
            // Show content
            document.querySelectorAll('body > *:not(.page-loader)').forEach(el => {
                gsap.to(el, {
                    opacity: 1,
                    visibility: 'visible',
                    duration: 0.5
                });
            });
            
            // Fade out loader
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                onComplete: function() {
                    loader.remove();
                }
            });
        }, 1000);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // Split text animation for header
    const headerText = document.querySelector('.header h1');
    
    const subtitle = document.querySelector('.subtitle');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    console.log(machinesGrid);

    // Header animations
    gsap.to(headerText, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.5,
        ease: "power3.out"
    });
    
    gsap.to(subtitle, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.8,
        ease: "power3.out"
    });
    
    gsap.to(scrollIndicator, {
        opacity: 1,
        duration: 1,
        delay: 1.2
    });
    
    // Machines grid animation
    gsap.to('.machines-grid', {
        scrollTrigger: {
            trigger: '.machines-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    });
    
    // Reveal machine cards with stagger
    gsap.from('.machine-card', {
        scrollTrigger: {
            trigger: '.machines-grid',
            start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    });
    
    // Showcase items animation
    gsap.utils.toArray('.showcase-item').forEach(item => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
    
    // Parallax effect for showcase images
    gsap.utils.toArray('.showcase-image').forEach(image => {
        gsap.from(image.querySelector('img'), {
            scrollTrigger: {
                trigger: image,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -30,
            scale: 1.1,
            ease: "none"
        });
    });
    
    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const machineCards = document.querySelectorAll('.machine-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // GSAP filter animation
            if (filterValue === 'all') {
                gsap.to(machineCards, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power3.out",
                    onStart: function() {
                        machineCards.forEach(card => {
                            gsap.set(card, { display: 'block' });
                        });
                    }
                });
            } else {
                machineCards.forEach(card => {
                    if (card.getAttribute('data-category') === filterValue) {
                        gsap.set(card, { display: 'block' });
                        gsap.to(card, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.4,
                            delay: 0.1,
                            ease: "power3.out"
                        });
                    } else {
                        gsap.to(card, {
                            opacity: 0,
                            scale: 0.95,
                            duration: 0.4,
                            ease: "power3.out",
                            onComplete: function() {
                                gsap.set(card, { display: 'none' });
                            }
                        });
                    }
                });
            }
        });
    });
    
    // Modal functionality
    const modalLinks = document.querySelectorAll('.view-details');
    const modals = document.querySelectorAll('.machine-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Open modal when clicking "View Details"
    modalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href');
            const modal = document.querySelector(modalId);
            const modalContent = modal.querySelector('.modal-content');
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            gsap.to(modalContent, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                onStart: function() {
                    modalContent.classList.add('active');
                }
            });
        });
    });
    
    // Close modal when clicking "X"
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.machine-modal');
            const modalContent = modal.querySelector('.modal-content');
            
            gsap.to(modalContent, {
                opacity: 0,
                y: 50,
                duration: 0.4,
                ease: "power3.in",
                onComplete: function() {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    modalContent.classList.remove('active');
                }
            });
        });
    });
    
    // Close modal when clicking outside modal content
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                const modalContent = modal.querySelector('.modal-content');
                
                gsap.to(modalContent, {
                    opacity: 0,
                    y: 50,
                    duration: 0.4,
                    ease: "power3.in",
                    onComplete: function() {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        modalContent.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Thumbnail gallery in modal
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image img');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // GSAP animation for image change
            gsap.to(mainImage, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: "power3.out",
                onComplete: function() {
                    mainImage.setAttribute('src', imgSrc);
                    gsap.to(mainImage, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        ease: "power3.out"
                    });
                }
            });
        });
    });
    
    // Scroll trigger animations for section headings
    gsap.utils.toArray('.section-heading').forEach(heading => {
        gsap.from(heading.querySelector('h2'), {
            scrollTrigger: {
                trigger: heading,
                start: 'top 90%',
            },
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: "power3.out"
        });
        
        gsap.from(heading.querySelector('.section-number'), {
            scrollTrigger: {
                trigger: heading,
                start: 'top 90%',
            },
            opacity: 0,
            x: 50,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out"
        });
    });
    
    // ScrollTrigger for specs button hover animation
    gsap.utils.toArray('.specs-btn').forEach(btn => {
        const circle = btn.querySelector('.circle');
        const buttonText = btn.querySelector('.button-text');
        
        btn.addEventListener('mouseenter', () => {
            gsap.to(circle, {
                width: '100%',
                duration: 0.5,
                ease: "power3.out"
            });
            
            gsap.to(buttonText, {
                color: '#000',
                duration: 0.3,
                delay: 0.1
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(circle, {
                width: '3rem',
                duration: 0.5,
                ease: "power3.out"
            });
            
            gsap.to(buttonText, {
                color: '#ffffff',
                duration: 0.3
            });
        });
    });
    
    // Text reveal animation for showcase content
    gsap.utils.toArray('.showcase-content h3').forEach(heading => {
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: 'top 80%',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });
    
    gsap.utils.toArray('.showcase-content p').forEach(paragraph => {
        gsap.from(paragraph, {
            scrollTrigger: {
                trigger: paragraph,
                start: 'top 85%',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out"
        });
    });
    
    // Text reveal animation for machine info
    gsap.utils.toArray('.machine-info h3').forEach(heading => {
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: 'top 90%',
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        });
    });
    
    // Staggered animation for machine meta tags
    gsap.utils.toArray('.machine-meta').forEach(meta => {
        gsap.from(meta.children, {
            scrollTrigger: {
                trigger: meta,
                start: 'top 90%',
            },
            y: 15,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power3.out"
        });
    });
    
    // Add 3D tilt effect to machine cards
    const cards = document.querySelectorAll('.machine-cards');
    console.log(`Found ${cards.length} machine cards for 3D tilt effect.`);
    
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const dx = x - xc;
            const dy = y - yc;
            
            gsap.to(this.querySelector('.card-inner'), {
                rotationY: dx / 20,
                rotationX: -dy / 20,
                duration: 0.5,
                ease: "power1.out"
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this.querySelector('.card-inner'), {
                rotationY: 0,
                rotationX: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });
    
    
    // Horizontal scroll for machines section on mobile
    if (window.innerWidth < 768) {
        const scrollContainer = document.querySelector('.machines-grid');
        
        if (scrollContainer) {
            // Convert grid to flex for horizontal scrolling on mobile
            scrollContainer.style.display = 'flex';
            scrollContainer.style.flexWrap = 'nowrap';
            scrollContainer.style.overflowX = 'auto';
            scrollContainer.style.scrollSnapType = 'x mandatory';
            scrollContainer.style.paddingBottom = '20px';
            
            // Style the cards for horizontal scrolling
            document.querySelectorAll('.machine-card').forEach(card => {
                card.style.minWidth = '85%';
                card.style.marginRight = '15px';
                card.style.scrollSnapAlign = 'center';
            });
        }
    }
    
    // Smooth scroll animation for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#' && !this.getAttribute('href').includes('modal')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    gsap.to(window, {
                        duration: 1, 
                        scrollTo: {
                            y: targetElement,
                            offsetY: 50
                        },
                        ease: "power3.inOut"
                    });
                }
            }
        });
    });
});// Machine data
const machines = [
  {
    id: 1,
    name: "Corrugation Machine",
    category: "packaging",
    description:
      "High-precision corrugation machine for creating durable packaging materials with exceptional quality and consistency.",
    image: "./galleryImage/08.jpg?height=400&width=600",
    specifications: {
      "Max Width": "2200mm",
      Speed: "300m/min",
      Power: "75kW",
      Weight: "12,000kg",
    },
    features: [
      "Automatic tension control",
      "Digital speed regulation",
      "Safety emergency stops",
      "Quality monitoring system",
    ],
  },
  {
    id: 2,
    name: "Rotary Creasing Cutting Machine",
    category: "cutting",
    description:
      "Advanced rotary cutting system delivering precise creasing and cutting operations for various materials.",
    image: "./galleryImage/13.jpg?height=400&width=600",
    specifications: {
      "Max Width": "1800mm",
      Speed: "200m/min",
      "Cutting Force": "500kN",
      Precision: "±0.1mm",
    },
    features: ["Rotary cutting technology", "Precision creasing", "Material versatility", "Automated feeding system"],
  },
  {
    id: 3,
    name: "Automatic Programme Cutting Machine",
    category: "cutting",
    description:
      "Fully automated cutting machine with programmable controls for complex cutting patterns and high-volume production.",
    image: "./galleryImage/06.jpg?height=400&width=600",
    specifications: {
      "Cutting Area": "1600x1200mm",
      Speed: "150cuts/min",
      Programs: "999 stored",
      Accuracy: "±0.05mm",
    },
    features: [
      "Programmable cutting patterns",
      "Automatic material handling",
      "Touch screen interface",
      "Production monitoring",
    ],
  },
  {
    id: 4,
    name: "Programme Cutting Machine",
    category: "cutting",
    description:
      "Versatile cutting machine with programmable functionality for precise material processing and customization.",
    image: "./galleryImage/04.jpg?height=400&width=600",
    specifications: {
      "Cutting Force": "300kN",
      "Table Size": "1400x1000mm",
      Programs: "500 stored",
      Power: "45kW",
    },
    features: ["Multiple cutting programs", "Easy setup", "Material optimization", "Safety interlocks"],
  },
  {
    id: 5,
    name: "Automatic Folding Pasting Machine",
    category: "packaging",
    description:
      "High-speed automatic folding and pasting machine for efficient packaging production with consistent quality.",
    image: "./galleryImage/07.jpg?height=400&width=600",
    specifications: {
      Speed: "400pcs/min",
      "Max Size": "800x600mm",
      "Min Size": "150x100mm",
      "Glue System": "Hot melt",
    },
    features: ["Automatic folding", "Precision pasting", "Quality control sensors", "High-speed operation"],
  },
  {
    id: 6,
    name: "Lamination Machine",
    category: "finishing",
    description:
      "Professional lamination machine providing superior surface finishing and protection for various materials.",
    image: "./galleryImage/03.jpg?height=400&width=600",
    specifications: {
      "Max Width": "1600mm",
      Speed: "80m/min",
      Temperature: "40-180°C",
      Pressure: "0.1-0.8MPa",
    },
    features: ["Temperature control", "Pressure regulation", "Anti-curl system", "Web tension control"],
  },
  {
    id: 7,
    name: "4 Colour Printing Machine",
    category: "printing",
    description:
      "High-quality 4-color printing machine delivering exceptional print resolution and color accuracy for professional applications.",
    image: "./galleryImage/05.jpg?height=400&width=600",
    specifications: {
      Colors: "4 (CMYK)",
      "Max Speed": "15,000sph",
      "Print Size": "720x520mm",
      Resolution: "2400dpi",
    },
    features: ["CMYK color system", "High-speed printing", "Color management", "Automatic registration"],
  },
  {
    id: 8,
    name: "2 Colour Printing Machine",
    category: "printing",
    description:
      "Efficient 2-color printing solution offering reliable performance and consistent quality for medium-volume production.",
    image: "./galleryImage/02.jpg?height=400&width=600",
    specifications: {
      Colors: "2",
      "Max Speed": "12,000sph",
      "Print Size": "650x450mm",
      Resolution: "1800dpi",
    },
    features: ["Dual color printing", "Quick setup", "Consistent quality", "Cost-effective operation"],
  },
  {
    id: 9,
    name: "UV Coating Machine",
    category: "printing",
    description:
      "Advanced UV coating machine providing superior surface protection and enhanced visual appeal with instant curing.",
    image: "./galleryImage/10.jpg?height=400&width=600",
    specifications: {
      "Max Width": "1050mm",
      Speed: "120m/min",
      "UV Power": "120W/cm",
      "Coating Weight": "2-12g/m²",
    },
    features: ["UV instant curing", "Spot coating capability", "Gloss control", "Environmental friendly"],
  },
  {
    id: 10,
    name: "Heavy Duty Platen Punching Machine",
    category: "cutting",
    description:
      "Robust platen punching machine designed for heavy-duty operations with exceptional force and precision.",
    image: "./galleryImage/01.jpg?height=400&width=600",
    specifications: {
      "Max Force": "800kN",
      "Platen Size": "1200x800mm",
      Stroke: "200mm",
      Power: "55kW",
    },
    features: ["Heavy-duty construction", "High punching force", "Precision control", "Safety systems"],
  },
  {
    id: 11,
    name: "Foils Embossing Machine",
    category: "finishing",
    description:
      "Precision foil embossing machine creating elegant metallic finishes and raised textures for premium applications.",
    image: "./galleryImage/12.jpg?height=400&width=600",
    specifications: {
      "Max Size": "750x550mm",
      Pressure: "200kN",
      Temperature: "Room-200°C",
      "Foil Width": "640mm",
    },
    features: ["Hot foil stamping", "Embossing capability", "Temperature control", "Precision registration"],
  },
]

// DOM elements
const filterButtons = document.querySelectorAll(".filter-btn")
const galleryGrid = document.getElementById("gallery-grid")
const modal = document.getElementById("modal-overlay")
const modalClose = document.getElementById("modal-close")


// Filter functionality
let currentFilter = "all"

function renderMachines(filter = "all") {
  const filteredMachines = filter === "all" ? machines : machines.filter((machine) => machine.category === filter)

  galleryGrid.innerHTML = ""

  filteredMachines.forEach((machine, index) => {
    const card = createMachineCard(machine, index)
    galleryGrid.appendChild(card)
  })
}

function createMachineCard(machine, index) {
  const card = document.createElement("div")
  card.className = "machine-card"
  card.style.animationDelay = `${index * 0.1}s`

  card.innerHTML = `
        <div class="machine-image">
            <img src="${machine.image}" alt="${machine.name}">
            <div class="image-overlay"></div>
        </div>
        <div class="machine-content">
            <span class="machine-badge">${machine.category.charAt(0).toUpperCase() + machine.category.slice(1)}</span>
            <h3 class="machine-title">${machine.name}</h3>
            <p class="machine-description">${machine.description}</p>
            <div class="machine-link">
                <span>View Details</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </div>
        </div>
    `

  // Add hover effect
  card.addEventListener("mouseenter", () => {
    cursor.classList.add("hover")
  })

  card.addEventListener("mouseleave", () => {
    cursor.classList.remove("hover")
  })

  // Add click event to open modal
  card.addEventListener("click", () => {
    openModal(machine)
  })

  return card
}

// Filter button events
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"))

    // Add active class to clicked button
    button.classList.add("active")

    // Get filter value and render machines
    const filter = button.getAttribute("data-filter")
    currentFilter = filter
    renderMachines(filter)
  })
})

// Modal functionality
function openModal(machine) {
  const modalImg = document.getElementById("modal-img")
  const modalBadge = document.getElementById("modal-badge")
  const modalTitle = document.getElementById("modal-title")
  const modalDescription = document.getElementById("modal-description")
  const modalSpecs = document.getElementById("modal-specs")
  const modalFeatures = document.getElementById("modal-features")

  modalImg.src = machine.image
  modalImg.alt = machine.name
  modalBadge.textContent = machine.category.charAt(0).toUpperCase() + machine.category.slice(1)
  modalTitle.textContent = machine.name
  modalDescription.textContent = machine.description

  // Render specifications
  // modalSpecs.innerHTML = ""
  // Object.entries(machine.specifications).forEach(([key, value]) => {
  //   const specItem = document.createElement("div")
  //   specItem.className = "spec-item"
  //   specItem.innerHTML = `
  //           <span class="spec-label">${key}</span>
  //           <span class="spec-value">${value}</span>
  //       `
  //   modalSpecs.appendChild(specItem)
  // })

  // Render features
  modalFeatures.innerHTML = ""
  machine.features.forEach((feature) => {
    const featureItem = document.createElement("li")
    featureItem.innerHTML = `<span>${feature}</span>`
    modalFeatures.appendChild(featureItem)
  })

  modal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeModal() {
  modal.classList.remove("active")
  document.body.style.overflow = "auto"
}

// Modal event listeners
modalClose.addEventListener("click", closeModal)
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal()
  }
})

// Escape key to close modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal()
  }
})

// Scroll animations
function animateOnScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll")

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("animated")
    }
  })
}

// Smooth scroll for hero button
document.querySelector(".hero-button").addEventListener("click", () => {
  document.querySelector(".filter-section").scrollIntoView({
    behavior: "smooth",
  })
})

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderMachines()

  // Add scroll animation class to showcase items
  document.querySelectorAll(".showcase-item").forEach((item, index) => {
    item.classList.add("animate-on-scroll")
    item.style.animationDelay = `${index * 0.2}s`
  })

  // Scroll event listener
  window.addEventListener("scroll", animateOnScroll)

  // Initial scroll check
  animateOnScroll()
})

// Staggered animation for gallery cards
function staggerCardAnimations() {
  const cards = document.querySelectorAll(".machine-card")
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`
  })
}

// Re-run stagger animation when filter changes
const originalRenderMachines = renderMachines
renderMachines = (filter) => {
  originalRenderMachines(filter)
  setTimeout(staggerCardAnimations, 50)
}



// ADDING SCROLLING EFFECT USING LENIS

function smoothScrollLenis() {
  // Initialize Lenis
  const lenis = new Lenis({
    // autoRaf: true,
    lerp: 0.1,
    duration: 1.3,
    smoothWheel: true,
  });

  // Listen for the scroll event and log the event data
  lenis.on("scroll", (e) => {
    console.log(e);
  });

  // Use requestAnimationFrame to continuously update the scroll
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

smoothScrollLenis();



function sheryAnimation() {
  // Only run on desktop (devices wider than 900px)
  if (window.innerWidth > 900) {
    console.log("Initializing SheryJS animations for desktop");
    
    // Mouse follower effect
    Shery.mouseFollower({
      skew: true,
      ease: "cubic-bezier(0.23, 1, 0.320, 1)",
      duration: 0.1,
    });
Shery.makeMagnet(".burger, .logo",{
  //Parameters are optional.
  ease: "cubic-bezier(0.23, 1, 0.320, 1)",
  duration: 1,
});

  } else {
    console.log("SheryJS animations disabled on mobile devices");
  }
}

// Initialize and also add a resize listener to handle window resizing
function initSheryResponsive() {
  // Initial setup
  sheryAnimation();
  
  // Handle window resize events with debounce
  let resizeTimer;
  window.addEventListener("resize", function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Remove existing mouse follower if window is resized to mobile
      if (window.innerWidth <= 900) {
        // Try to remove existing mouse follower if it exists
        const follower = document.querySelector(".mousefollower");
        if (follower) {
          follower.remove();
        }
      } else {
        // Reinitialize for desktop if needed
        sheryAnimation();
      }
    }, 250); // Wait 250ms after resize ends before checking
  });
}

initSheryResponsive();


function nav() {
  document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".burger");
    const overlay2 = document.querySelector(".overlay-2");
    const menuLinks = document.querySelectorAll(".menu-item a");
    let isOpen = false;

    const pageElements = [".cta", ".hero-copy"];

    gsap.set(overlay2, {
      top: "0%",
      opacity: 1,
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
    });

    let tl = gsap.timeline({ paused: true });

    tl.to(overlay2, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: 0.9,
      ease: "power3.inOut",
    });

    tl.to(
      pageElements,
      {
        opacity: 0,
        duration: 0.1,
        ease: "power2.inOut",
      },
      "-=0.6"
    );

    tl.fromTo(
      ".menu-item a",
      {
        y: 60,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      },
      "-=0.5"
    );

    // Burger click
    toggleButton.addEventListener("click", function () {
      toggleButton.classList.toggle("active");
      overlay2.classList.toggle("open");

      document.querySelector(".logo").classList.toggle("logo-white");

      if (isOpen) {
        tl.reverse(); // Animate overlay and menu items out (bottom to top)
      } else {
        tl.play(); // Animate overlay and menu items in (top to bottom)
      }
      isOpen = !isOpen;
    });

    // Also close menu with animation when clicking a menu item
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        toggleButton.classList.remove("active");
        overlay2.classList.remove("open");

        document.querySelector(".logo").classList.remove("logo-white");

        tl.reverse();
        isOpen = false;
      });
    });
  });
}

nav();

function backToHome(){
    document.querySelector(".Home").addEventListener("click",function(){
        window.location.href = "./index.html";
    })
}

backToHome();