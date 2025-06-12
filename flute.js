const fluteData = [
    // {
    //     type: "A",
    //     height: 4.8,
    //     thickness: "~4.8mm",
    //     description: "Highest cushioning protection",
    //     applications: ["Heavy-duty shipping", "Fragile items", "Appliances"],
    //     strengths: ["Maximum cushioning", "Impact resistance", "Excellent stacking strength"],
    //     color: "amber"
    // },
    {
        type: "B",
        height: 3.0,
        thickness: "~3.0mm",
        description: "Excellent printability and stacking",
        applications: ["Retail displays", "Food packaging", "Small appliances"],
        strengths: ["Superior print quality", "Good stacking", "Economical"],
        color: "orange"
    },
    {
        type: "C",
        height: 4.0,
        thickness: "~4.0mm",
        description: "Versatile all-purpose flute",
        applications: ["General shipping", "Moving boxes", "Storage"],
        strengths: ["Balanced performance", "Good crush strength", "Versatile"],
        color: "yellow"
    },
    {
        type: "E",
        height: 1.6,
        thickness: "~1.6mm",
        description: "Excellent for high-quality printing",
        applications: ["Premium displays", "Cosmetics", "Electronics"],
        strengths: ["Superior print quality", "Smooth surface", "Precise die-cutting"],
        color: "emerald"
    },
    // {
    //     type: "F",
    //     height: 0.8,
    //     thickness: "~0.8mm",
    //     description: "Ultra-thin for premium applications",
    //     applications: ["Luxury packaging", "Direct food contact", "High-end retail"],
    //     strengths: ["Exceptional printability", "Smooth finish", "Space efficient"],
    //     color: "blue"
    // }
];

// Rating system for comparison chart
const fluteRatings = {
    A: { cushioning: 5, printQuality: 2, stackingStrength: 5, spaceEfficiency: 2, costEffectiveness: 3, dieCutPrecision: 3 },
    B: { cushioning: 3, printQuality: 4, stackingStrength: 4, spaceEfficiency: 4, costEffectiveness: 4, dieCutPrecision: 4 },
    C: { cushioning: 4, printQuality: 3, stackingStrength: 4, spaceEfficiency: 3, costEffectiveness: 4, dieCutPrecision: 3 },
    E: { cushioning: 2, printQuality: 5, stackingStrength: 3, spaceEfficiency: 4, costEffectiveness: 3, dieCutPrecision: 5 },
    F: { cushioning: 1, printQuality: 5, stackingStrength: 2, spaceEfficiency: 5, costEffectiveness: 2, dieCutPrecision: 5 }
};

const comparisonCriteria = [
    { name: "Cushioning Protection", key: "cushioning" },
    { name: "Print Quality", key: "printQuality" },
    { name: "Stacking Strength", key: "stackingStrength" },
    { name: "Space Efficiency", key: "spaceEfficiency" },
    { name: "Cost Effectiveness", key: "costEffectiveness" },
    { name: "Die-Cut Precision", key: "dieCutPrecision" }
];

let selectedFlute = null;

// Generate wave pattern for SVG
function generateWavePattern(height, type) {
    const normalizedHeight = Math.max(0.2, height / 5);
    const frequency = type === 'F' ? 12 : type === 'E' ? 10 : type === 'B' ? 8 : 6;
    
    let path = `M 0 ${0.5 - normalizedHeight / 2}`;
    
    for (let i = 0; i <= frequency; i++) {
        const x = (i / frequency) * 100;
        const y = i % 2 === 0 
            ? 0.5 - normalizedHeight / 2 
            : 0.5 + normalizedHeight / 2;
        
        if (i === 0) continue;
        
        const prevX = ((i - 1) / frequency) * 100;
        const controlX1 = prevX + (x - prevX) / 3;
        const controlX2 = x - (x - prevX) / 3;
        const prevY = (i - 1) % 2 === 0 
            ? 0.5 - normalizedHeight / 2 
            : 0.5 + normalizedHeight / 2;
        
        path += ` C ${controlX1} ${prevY}, ${controlX2} ${y}, ${x} ${y}`;
    }
    
    return path;
}

// Create SVG icons for ratings
function createRatingIcon(rating) {
    const icons = {
        5: `<svg class="rating-icon" viewBox="0 0 24 24" fill="currentColor" style="color: #f59e0b;">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>`,
        4: `<svg class="rating-icon" viewBox="0 0 24 24" fill="currentColor" style="color: #10b981;">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`,
        3: `<svg class="rating-icon" viewBox="0 0 24 24" fill="currentColor" style="color: #3b82f6;">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`,
        2: `<svg class="rating-icon" viewBox="0 0 24 24" fill="currentColor" style="color: #f97316;">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>`,
        1: `<svg class="rating-icon" viewBox="0 0 24 24" fill="currentColor" style="color: #ef4444;">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>`
    };
    return icons[rating] || icons[1];
}

function getRatingText(rating) {
    const texts = {
        5: "Excellent",
        4: "Very Good", 
        3: "Good",
        2: "Fair",
        1: "Limited"
    };
    return texts[rating] || "Limited";
}

// Add particles animation
function addParticles(container, isVisible) {
    const existingParticles = container.querySelectorAll('.particle');
    existingParticles.forEach(p => p.remove());
    
    if (isVisible) {
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${20 + i * 30}%`;
            particle.style.animationDelay = `${i * 0.2}s`;
            container.appendChild(particle);
        }
    }
}

// Create flute profile card
function createFluteCard(flute, index) {
    const card = document.createElement('div');
    card.className = 'flute-card';
    card.dataset.fluteType = flute.type;
    
    const gradientId = `gradient-${flute.type}`;
    
    card.innerHTML = `
        <div class="flute-header ${flute.color}">
            <h3 class="flute-type">${flute.type}-FLUTE</h3>
             <p class="flute-thickness"></p>
        </div>
        
        <div class="wave-container">
            <div class="wave-visualization">
                <svg class="wave-svg" viewBox="0 0 100 1" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color: #d97706; stop-opacity: 0.3" />
                            <stop offset="50%" style="stop-color: #f59e0b; stop-opacity: 0.5" />
                            <stop offset="100%" style="stop-color: #d97706; stop-opacity: 0.3" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="${generateWavePattern(flute.height, flute.type)}"
                        stroke="url(#${gradientId})"
                        stroke-width="0.05"
                        fill="none"
                    />
                </svg>
            </div>
        </div>
        
        <div class="flute-content">
            <p class="flute-description">${flute.description}</p>
            
            <div class="content-section">
                <h4 class="content-title">Applications:</h4>
                <ul class="content-list">
                    ${flute.applications.slice(0, 2).map(app => 
                        `<li class="content-item">${app}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="content-section">
                <h4 class="content-title">Key Strengths:</h4>
                <ul class="content-list">
                    ${flute.strengths.slice(0, 2).map(strength => 
                        `<li class="content-item strengths-item">${strength}</li>`
                    ).join('')}
                </ul>
            </div>
        </div>
        
        <div class="expand-indicator">
            <span>+</span>
        </div>
        
        <div class="flute-details">
            <div class="details-section">
                <h4 class="details-title">All Applications:</h4>
                <div class="tag-container">
                    ${flute.applications.map(app => 
                        `<span class="tag application">${app}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="details-section">
                <h4 class="details-title">All Strengths:</h4>
                <div class="tag-container">
                    ${flute.strengths.map(strength => 
                        `<span class="tag strength">${strength}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Add click event
    card.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log(`Flute card ${flute.type} clicked`);
        toggleFluteSelection(flute.type);
    });
    
    // Add hover events for particles
    const waveContainer = card.querySelector('.wave-visualization');
    card.addEventListener('mouseenter', () => addParticles(waveContainer, true));
    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('selected')) {
            addParticles(waveContainer, false);
        }
    });
    
    return card;
}

// Toggle flute selection
function toggleFluteSelection(fluteType) {
    console.log(`Toggling flute selection for ${fluteType}, current selection: ${selectedFlute}`);
    
    const wasSelected = selectedFlute === fluteType;
    
    // Remove selection from all cards
    document.querySelectorAll('.flute-card').forEach(card => {
        card.classList.remove('selected');
        const details = card.querySelector('.flute-details');
        if (details) {
            details.classList.remove('show');
        }
        
        // Remove particles from unselected cards
        const waveContainer = card.querySelector('.wave-visualization');
        addParticles(waveContainer, false);
    });
    
    if (!wasSelected) {
        // Select the new card
        selectedFlute = fluteType;
        const selectedCard = document.querySelector(`[data-flute-type="${fluteType}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            
            const details = selectedCard.querySelector('.flute-details');
            if (details) {
                console.log(`Showing details for ${fluteType}`);
                details.classList.add('show', 'fade-in');
            }
            
            // Add particles to selected card
            const waveContainer = selectedCard.querySelector('.wave-visualization');
            addParticles(waveContainer, true);
        }
    } else {
        selectedFlute = null;
        console.log('Deselected flute');
    }
}

// Create comparison chart
function createComparisonChart() {
    const chart = document.getElementById('comparisonChart');
    
    const tableRows = comparisonCriteria.map((criterion, index) => {
        const ratingCells = fluteData.map(flute => {
            const rating = fluteRatings[flute.type][criterion.key];
            return `
                <td class="table-cell">
                    <div class="rating-cell">
                        ${createRatingIcon(rating)}
                        <span class="rating-text">${getRatingText(rating)}</span>
                    </div>
                </td>
            `;
        }).join('');
        
        return `
            <tr class="table-row">
                <td class="table-cell">${criterion.name}</td>
                ${ratingCells}
            </tr>
        `;
    }).join('');
    
    chart.innerHTML = `
        <div class="chart-header">
            <h3 class="chart-title">Flute Comparison Chart</h3>
            <p class="chart-description">Compare performance characteristics across all flute types</p>
        </div>
        
        <div style="overflow-x: auto;">
            <table class="comparison-table">
                <thead class="table-header">
                    <tr>
                        <th>Performance Criteria</th>
                        ${fluteData.map(flute => 
                            `<th>
                                <div class="flute-badge ${flute.color}">${flute.type}-Flute</div>
                            </th>`
                        ).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
        
        <div class="chart-legend">
            <div class="legend-item">
                ${createRatingIcon(5)}
                <span>Excellent</span>
            </div>
            <div class="legend-item">
                ${createRatingIcon(4)}
                <span>Very Good</span>
            </div>
            <div class="legend-item">
                ${createRatingIcon(3)}
                <span>Good</span>
            </div>
            <div class="legend-item">
                ${createRatingIcon(2)}
                <span>Fair</span>
            </div>
            <div class="legend-item">
                ${createRatingIcon(1)}
                <span>Limited</span>
            </div>
        </div>
    `;
}

// Initialize the application
function init() {
    const fluteGrid = document.getElementById('fluteGrid');
    
    if (!fluteGrid) {
        console.error('Flute grid element not found!');
        return;
    }
    
    // Create flute cards
    fluteData.forEach((flute, index) => {
        const card = createFluteCard(flute, index);
        fluteGrid.appendChild(card);
    });
    
    // Create comparison chart
    createComparisonChart();
    
    // Add button event listeners
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            console.log(`Button clicked: ${e.target.textContent}`);
        });
    });
    
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);


