document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const packageTypeSelect = document.getElementById('packageType');
    const materialSelect = document.getElementById('material');
    const colorPicker = document.getElementById('packageColor');
    const finishSelect = document.getElementById('finish');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const depthInput = document.getElementById('depth');
    const logoPositionSelect = document.getElementById('logoPosition');
    const logoSizeSlider = document.getElementById('logoSize');
    const logoSizeValue = document.getElementById('logoSizeValue');
    const logoUpload = document.getElementById('logoUpload');
    const selectedFileName = document.getElementById('selected-file-name');
    const logoPreviewContainer = document.getElementById('logo-preview-container');
    const logoPreview = document.getElementById('logo-preview');
    const removeLogoBtn = document.getElementById('remove-logo');
    const startDesigningButton = document.getElementById('start-designing');
    const rotateLeftButton = document.getElementById('rotate-left');
    const rotateRightButton = document.getElementById('rotate-right');
    const resetViewButton = document.getElementById('reset-view');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    const modelViewerSection = document.getElementById('model-viewer-section');
    const modelInfo = document.querySelector('.model-info p');
    
    // Logo variables
    let logoFile = null;
    let logoTexture = null;
    
    // 3D Model Variables
    let scene, camera, renderer, controls, packageMesh, logoMesh;
    let isModelInitialized = false;
    let isAutoRotating = false;
    
    // Materials and textures
    const textures = {
        cardboard: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=600&q=80',
        plastic: null,
        glass: null,
        eco: 'https://images.unsplash.com/photo-1597019558926-3eef445fdf60?auto=format&fit=crop&w=600&q=80',
        plain: null
    };
    
    // Handle logo file upload
    logoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                return;
            }
            
            logoFile = file;
            const reader = new FileReader();
            
            reader.onload = function(e) {
                logoPreview.src = e.target.result;
                logoPreviewContainer.style.display = 'block';
                selectedFileName.textContent = file.name;
                
                // If model is already initialized, update the logo
                if (isModelInitialized && logoPositionSelect.value !== 'none') {
                    updateLogoTexture(e.target.result);
                }
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Remove logo button functionality
    removeLogoBtn.addEventListener('click', function() {
        logoUpload.value = '';
        logoFile = null;
        logoPreviewContainer.style.display = 'none';
        selectedFileName.textContent = 'No file chosen';
        
        // If model is initialized, remove logo
        if (isModelInitialized && logoMesh) {
            scene.remove(logoMesh);
            logoMesh = null;
        }
    });
    
    // Update logo size display
    logoSizeSlider.addEventListener('input', function() {
        logoSizeValue.textContent = `${this.value}%`;
        
        // Update logo size in 3D model if initialized
        if (isModelInitialized && logoMesh) {
            const size = parseInt(this.value) / 100;
            const packageType = packageTypeSelect.value;
            const width = parseFloat(widthInput.value) / 10;
            const height = parseFloat(heightInput.value) / 10;
            
            logoMesh.scale.set(width * size * 0.9, height * size * 0.5, 1);
        }
    });
    
    // Initialize Three.js scene
    function initThreeJS() {
        if (isModelInitialized) return;
        
        console.log("Initializing 3D viewer");
        
        try {
            // Create container for loading message
            const container = document.getElementById('3d-model-viewer');
            container.innerHTML = `
                <div class="loading-model">
                    <div class="loading-spinner"></div>
                </div>
            `;
            
            // Create scene
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f9ff);
            
            // Create camera with proper aspect ratio based on container size
            const width = container.clientWidth;
            const height = container.clientHeight || 500; // Provide default height if not set in CSS
            
            camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 5;
            
            // Create renderer with proper size
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(width, height);
            
            // Clear loading message and append renderer
            setTimeout(() => {
                container.innerHTML = '';
                container.appendChild(renderer.domElement);
                
                // Add lights after renderer is in the DOM
                addLights();
                
                // Add orbit controls
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                setupControls();
                
                // Create initial package with current design options
                createPackage();
                
                // Handle window resize
                window.addEventListener('resize', onWindowResize);
                
                // Start animation loop
                animate();
                
                // Initialize complete
                isModelInitialized = true;
                console.log("3D viewer initialized successfully");
                
                // Add touch instructions for mobile
                addTouchInstructions();
            }, 500);
        } catch (error) {
            console.error("Error initializing 3D viewer:", error);
            document.getElementById('3d-model-viewer').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to load 3D viewer. Please ensure WebGL is enabled in your browser.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }
    
    // Add lights to the scene
    function addLights() {
        // Add soft ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        // Add directional light with shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Add a softer fill light from below
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-1, -1, -1);
        scene.add(fillLight);
    }
    
    // Setup orbit controls
    function setupControls() {
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.minDistance = 2; // Allow closer zoom
        controls.maxDistance = 20; // Allow further zoom
        controls.autoRotate = false;
        controls.autoRotateSpeed = 1.0;
        
        // Add touch event handling
        const container = renderer.domElement;
        
        // Track touch start position for manual rotation
        let touchStartX = 0;
        let touchStartY = 0;
        
        container.addEventListener('touchstart', function(event) {
            if (event.touches.length === 1) {
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
            }
        });
        
        container.addEventListener('touchmove', function(event) {
            if (event.touches.length > 1) {
                // Multi-touch, let OrbitControls handle it
                return;
            }
            
            // Single touch - optional manual handling here if needed
        });
    }
    
    // Zoom in function
    function zoomIn() {
        if (!controls) return;
        
        // Get the current distance
        const currentDistance = camera.position.distanceTo(controls.target);
        // Calculate new distance (zoom in by 20%)
        const newDistance = Math.max(currentDistance * 0.8, controls.minDistance);
        
        // Apply the new zoom level
        camera.position.copy(controls.target).add(
            camera.position.clone().sub(controls.target).normalize().multiplyScalar(newDistance)
        );
    }
    
    // Zoom out function
    function zoomOut() {
        if (!controls) return;
        
        // Get the current distance
        const currentDistance = camera.position.distanceTo(controls.target);
        // Calculate new distance (zoom out by 20%)
        const newDistance = Math.min(currentDistance * 1.2, controls.maxDistance);
        
        // Apply the new zoom level
        camera.position.copy(controls.target).add(
            camera.position.clone().sub(controls.target).normalize().multiplyScalar(newDistance)
        );
    }
    
    // Add touch instructions
    function addTouchInstructions() {
        if ('ontouchstart' in window) {
            const container = document.getElementById('3d-model-viewer');
            const instructions = document.createElement('div');
            instructions.className = 'touch-instructions';
            instructions.textContent = '👆 Touch and drag to rotate, pinch to zoom';
            container.appendChild(instructions);
            
            setTimeout(() => {
                instructions.classList.add('show');
                setTimeout(() => {
                    instructions.classList.remove('show');
                    setTimeout(() => {
                        if (instructions.parentNode) {
                            instructions.parentNode.removeChild(instructions);
                        }
                    }, 500);
                }, 3000);
            }, 1000);
        }
    }
    
    // Update logo texture
    function updateLogoTexture(imageUrl) {
        if (!scene) return;
        
        // Remove existing logo if present
        if (logoMesh) {
            scene.remove(logoMesh);
        }
        
        // Load new texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(imageUrl, function(texture) {
            logoTexture = texture;
            
            // Create logo mesh with the uploaded texture
            const packageType = packageTypeSelect.value;
            const width = parseFloat(widthInput.value) / 10;
            const height = parseFloat(heightInput.value) / 10;
            const depth = parseFloat(depthInput.value) / 10;
            const logoPosition = logoPositionSelect.value;
            const logoSize = parseInt(logoSizeSlider.value) / 100;
            
            // Calculate logo dimensions - maintain aspect ratio
            const logoAspect = texture.image.width / texture.image.height;
            let logoWidth = width * logoSize * 0.9;
            let logoHeight = logoWidth / logoAspect;
            
            // Ensure logo doesn't exceed package height
            if (logoHeight > height * logoSize * 0.9) {
                logoHeight = height * logoSize * 0.9;
                logoWidth = logoHeight * logoAspect;
            }
            
            const logoGeometry = new THREE.PlaneGeometry(logoWidth, logoHeight);
            const logoMaterial = new THREE.MeshBasicMaterial({ 
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
            
            // Position the logo based on selected position
            switch (logoPosition) {
                case 'front':
                    logoMesh.position.z = depth / 2 + 0.01;
                    break;
                case 'top':
                    logoMesh.position.y = height / 2 + 0.01;
                    logoMesh.rotation.x = -Math.PI / 2;
                    break;
                case 'side':
                    logoMesh.position.x = width / 2 + 0.01;
                    logoMesh.rotation.y = Math.PI / 2;
                    break;
            }
            
            scene.add(logoMesh);
        });
    }
    
    // Create or update the 3D package mesh
    function createPackage() {
        // Remove existing package if present
        if (packageMesh) scene.remove(packageMesh);
        if (logoMesh) scene.remove(logoMesh);
        
        // Get current values from form
        const packageType = packageTypeSelect.value;
        const material = materialSelect.value;
        const color = new THREE.Color(colorPicker.value);
        const finish = finishSelect.value;
        const width = parseFloat(widthInput.value) / 10;
        const height = parseFloat(heightInput.value) / 10;
        const depth = parseFloat(depthInput.value) / 10;
        const logoPosition = logoPositionSelect.value;
        
        // Create geometry based on package type
        let geometry;
        
        switch (packageType) {
            case 'box':
                geometry = new THREE.BoxGeometry(width, height, depth);
                break;
            case 'bottle':
                // Create a more complex bottle shape using lathe geometry
                const points = [];
                const neckHeight = height * 0.3;
                const bodyHeight = height - neckHeight;
                const neckRadius = width * 0.2;
                const bodyRadius = width * 0.5;
                
                // Create bottle profile (half silhouette)
                points.push(new THREE.Vector2(0, -height/2)); // Bottom center
                points.push(new THREE.Vector2(bodyRadius, -height/2)); // Bottom edge
                points.push(new THREE.Vector2(bodyRadius, -height/2 + bodyHeight)); // Top of body
                points.push(new THREE.Vector2(neckRadius, -height/2 + bodyHeight + 0.05)); // Shoulder
                points.push(new THREE.Vector2(neckRadius, height/2 - 0.1)); // Neck
                points.push(new THREE.Vector2(neckRadius * 1.2, height/2)); // Lip
                points.push(new THREE.Vector2(0, height/2)); // Top center
                
                geometry = new THREE.LatheGeometry(points, 20);
                break;
            case 'bag':
                // Create a bag-like shape
                geometry = new THREE.BoxGeometry(width, height, depth * 0.3);
                break;
            case 'pouch':
                // Create a pouch with rounded corners
                geometry = new THREE.BoxGeometry(width, height, depth * 0.2);
                
                // Add some deformation to make it look like a flexible pouch
                const positionAttribute = geometry.getAttribute('position');
                const vertex = new THREE.Vector3();
                
                for (let i = 0; i < positionAttribute.count; i++) {
                    vertex.fromBufferAttribute(positionAttribute, i);
                    
                    // Add slight curve to front and back
                    if (Math.abs(vertex.z) > 0.1) {
                        vertex.y -= 0.1 * (1 - Math.abs(vertex.y / (height/2))) * (1 - Math.abs(vertex.x / (width/2)));
                    }
                    
                    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
                }
                
                geometry.computeVertexNormals();
                break;
        }
        
        // Create material based on finish and material type
        let packageMaterial;
        
        // Base material properties
        const materialProps = {
            color: color,
            side: THREE.DoubleSide
        };
        
        // Adjust material based on selected finish
        switch (finish) {
            case 'matte':
                materialProps.roughness = 0.9;
                materialProps.metalness = 0;
                packageMaterial = new THREE.MeshStandardMaterial(materialProps);
                break;
            case 'gloss':
                materialProps.roughness = 0.1;
                materialProps.metalness = 0;
                packageMaterial = new THREE.MeshStandardMaterial(materialProps);
                break;
            case 'soft-touch':
                materialProps.roughness = 0.7;
                materialProps.metalness = 0;
                packageMaterial = new THREE.MeshStandardMaterial(materialProps);
                break;
            case 'metallic':
                materialProps.roughness = 0.3;
                materialProps.metalness = 0.8;
                packageMaterial = new THREE.MeshStandardMaterial(materialProps);
                break;
        }
        
        // For plain material, ensure no textures are applied
        if (material === 'plain') {
            // Plain material with no texture
            packageMaterial = new THREE.MeshStandardMaterial({
                color: color,
                roughness: finish === 'gloss' ? 0.1 : finish === 'metallic' ? 0.3 : 0.5,
                metalness: finish === 'metallic' ? 0.8 : 0,
                side: THREE.DoubleSide
            });
        } 
        // Load texture for specific materials if available
        else if (textures[material]) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(textures[material], function(texture) {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(2, 2);
                
                if (material === 'cardboard' || material === 'eco') {
                    // Add texture as a bump map for cardboard and eco materials
                    packageMaterial.bumpMap = texture;
                    packageMaterial.bumpScale = 0.02;
                    // Also slightly adjust the color to match the texture
                    const newColor = color.clone().lerp(new THREE.Color(0xdddddd), 0.2);
                    packageMaterial.color = newColor;
                }
                
                packageMesh.material = packageMaterial;
                renderer.render(scene, camera);
            });
        }
        
        // Special treatment for glass material
        if (material === 'glass') {
            packageMaterial.transparent = true;
            packageMaterial.opacity = 0.3;
            packageMaterial.refractionRatio = 0.98;
            packageMaterial.reflectivity = 0.9;
            packageMaterial.roughness = 0.1;
        }
        
        // Create the package mesh
        packageMesh = new THREE.Mesh(geometry, packageMaterial);
        scene.add(packageMesh);
        
        // Add logo if selected and logo file is available
        if (logoPosition !== 'none' && logoFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                updateLogoTexture(e.target.result);
            };
            reader.readAsDataURL(logoFile);
        }
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (controls) {
            controls.update(); // needed for damping to work
        }
        
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
    
    // Handle window resize
    function onWindowResize() {
        if (!isModelInitialized) return;
        
        const container = document.getElementById('3d-model-viewer');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }
    
    // Update model info text
    function updateModelInfo() {
        const packageType = packageTypeSelect.value;
        const material = materialSelect.value;
        const color = colorPicker.value;
        const finish = finishSelect.value;
        const width = widthInput.value;
        const height = heightInput.value;
        const depth = depthInput.value;
        const logoPosition = logoPositionSelect.value;
        
        let logoInfo = 'None';
        if (logoFile && logoPosition !== 'none') {
            logoInfo = `${logoFile.name} (${logoPosition} position, ${logoSizeSlider.value}% size)`;
        }
        
        modelInfo.innerHTML = `
            <strong>Your Custom Package:</strong><br>
            Type: ${packageType.charAt(0).toUpperCase() + packageType.slice(1)}<br>
            Material: ${material.charAt(0).toUpperCase() + material.slice(1)}<br>
            Finish: ${finish.charAt(0).toUpperCase() + finish.slice(1)}<br>
            Dimensions: ${width}cm × ${height}cm × ${depth}cm<br>
            Logo: ${logoInfo}
        `;
    }
    
    // Toggle auto rotation of the model
    function toggleAutoRotation() {
        if (!controls) return;
        
        isAutoRotating = !isAutoRotating;
        controls.autoRotate = isAutoRotating;
        
        const autoRotateButton = document.getElementById('auto-rotate');
        if (autoRotateButton) {
            autoRotateButton.innerHTML = isAutoRotating ? 
                '<i class="fas fa-pause"></i>' : 
                '<i class="fas fa-play"></i>';
        }
    }
    
    // Event listeners for design tool inputs
    packageTypeSelect.addEventListener('change', updateDesign);
    materialSelect.addEventListener('change', updateDesign);
    colorPicker.addEventListener('input', updateDesign);
    finishSelect.addEventListener('change', updateDesign);
    widthInput.addEventListener('input', updateDesign);
    heightInput.addEventListener('input', updateDesign);
    depthInput.addEventListener('input', updateDesign);
    logoPositionSelect.addEventListener('change', updateDesign);
    logoSizeSlider.addEventListener('input', function() {
        logoSizeValue.textContent = `${this.value}%`;
        if (isModelInitialized) {
            updateDesign();
        }
    });
    
    function updateDesign() {
        if (isModelInitialized) {
            createPackage();
            updateModelInfo();
        }
    }
    
    // Start designing button action
    startDesigningButton.addEventListener('click', function() {
        console.log("Start designing button clicked");
        
        // Show the 3D model viewer section
        modelViewerSection.style.display = 'block';
        
        // Scroll to the model viewer
        modelViewerSection.scrollIntoView({ behavior: 'smooth' });
        
        // Initialize Three.js (if not already initialized)
        setTimeout(() => {
            try {
                initThreeJS();
                updateModelInfo();
                console.log("3D initialization completed");
            } catch (error) {
                console.error("Error initializing 3D viewer:", error);
                // Fallback if Three.js initialization fails
                document.getElementById('3d-model-viewer').innerHTML = 
                    '<div class="error-message">' +
                    '<i class="fas fa-exclamation-triangle"></i>' +
                    '<p>Unable to load 3D viewer. Please ensure WebGL is enabled in your browser.</p>' +
                    '</div>';
            }
        }, 800);
    });
    
    // Rotation controls for the model
    rotateLeftButton.addEventListener('click', function() {
        if (!isModelInitialized || !controls) return;
        controls.rotateLeft(Math.PI / 6); // 30 degrees
    });
    
    rotateRightButton.addEventListener('click', function() {
        if (!isModelInitialized || !controls) return;
        controls.rotateLeft(-Math.PI / 6); // -30 degrees
    });
    
    resetViewButton.addEventListener('click', function() {
        if (!isModelInitialized || !controls) return;
        controls.reset();
    });
    
    // Add zoom button functionality
    zoomInButton.addEventListener('click', zoomIn);
    zoomOutButton.addEventListener('click', zoomOut);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Contact form submission with EmailJS
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect package design info
        const designSpecs = isModelInitialized ? `
            Package Type: ${packageTypeSelect.value},
            Material: ${materialSelect.value},
            Color: ${colorPicker.value},
            Finish: ${finishSelect.value},
            Dimensions: ${widthInput.value}cm × ${heightInput.value}cm × ${depthInput.value}cm,
            Logo Position: ${logoPositionSelect.value},
            Logo File: ${logoFile ? logoFile.name : 'None'}
        ` : 'No design specified';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            project_details: document.getElementById('project-details').value,
            package_type: document.getElementById('package-type').value,
            quantity: document.getElementById('quantity').value,
            design_specs: designSpecs
        };
        
        // Show a loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Use EmailJS to send the form
        // You need to configure your EmailJS account and template first
        emailjs.send('your_service_id', 'your_template_id', formData)
            .then(function() {
                contactForm.reset();
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                formError.style.display = 'none';
                
                // Reset the form after 5 seconds
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                    contactForm.style.display = 'grid';
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }, 5000);
            }, function(error) {
                console.error('EmailJS error:', error);
                formError.style.display = 'block';
                formSuccess.style.display = 'none';
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            });
    });
    
    // Handle touch events for mobile users
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', function(e) {
            // If the touch is inside the 3D viewer, prevent page scrolling
            if (e.target.closest('#3d-model-viewer') && e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
});