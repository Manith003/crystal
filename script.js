// import { gsap } from "https://cdn.skypack.dev/gsap";
// import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import { CustomEase } from "https://cdn.skypack.dev/gsap/CustomEase";

gsap.registerPlugin(CustomEase, ScrollTrigger);
CustomEase.create("hop", "0.9, 0,0.1,1");

function loading() {
  document.addEventListener("DOMContentLoaded", () => {
    const tl = gsap.timeline({
      delay: 0.3,
      defaults: {
        ease: "hop",
      },
      onComplete: () => {
        document.querySelector(".loading-image").style.display = "none";
      },
    });

    gsap.set(".loading-image", { opacity: 0 });
    tl.to(".loading-image", {
      opacity: 1,
      duration: 0.6,
    });
    tl.to(".loading-image", {
      opacity: 0.5,
      duration: 0.5,
      repeat: 3,
      yoyo: true,
      ease: "power1.inOut",
    });
    tl.to(
      ".loading-image",
      {
        opacity: 0,
        duration: 0.5,
      },
      "anim"
    );

    tl.to(
      ".spinner",
      {
        opacity: 0,
        duration: 0.5,
      },
      "anim"
    );
    tl.to(
      ".word h1",
      {
        y: "0%",
        duration: 1,
      },
      "<"
    );

    tl.to("#word-1 h1", {
      y: "120%",
      duration: 0.9,
      delay: 0.3,
    });

    tl.to(
      "#word-2 h1",
      {
        y: "-120%",
        duration: 0.9,
      },
      "<"
    );

    tl.to(".block", {
      clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
      duration: 1,
      stagger: 0.1,
      delay: 0.75,
      onStart: () =>
        gsap.to(".hero-img", { scale: 1, duration: 2, ease: "hop" }),
    });

    tl.to(
      [".nav", ".line h1", ".line p"],
      {
        y: "0%",
        duration: 1.5,
        stagger: 0.2,
      },
      "<"
    );

    tl.to(
      [".cta", ".cta-icon"],
      {
        scale: 1,
        duration: 1.5,
        stagger: 0.75,
        delay: 0.75,
      },
      "<"
    );

    tl.to(
      ".cta-label p",
      {
        y: "0%",
        duration: 1.5,
        delay: 0.5,
      },
      "<"
    );
  });
}

if (!sessionStorage.getItem("hasVisited")) {
  loading();
  sessionStorage.setItem("hasVisited", "true");
} else {
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".loading-image")) {
      document.querySelector(".loading-image").style.display = "none";
    }
    gsap.set(".spinner", { opacity: 0 });
    gsap.set(".word h1", { y: "120%" });
    gsap.set("#word-1 h1", { y: "120%" });
    gsap.set("#word-2 h1", { y: "-120%" });
    gsap.set(".block", {
      clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
    });
    gsap.set(".hero-img", { scale: 1 });
    gsap.set([".nav", ".line h1", ".line p"], { y: "0%" });
    gsap.set([".cta", ".cta-icon"], { scale: 1 });
    gsap.set(".cta-label p", { y: "0%" });
  });
}

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

function swiperAdded() {
  const swiper = new Swiper(".card-wrapper", {
    loop: true,
    spaceBetween: 10,

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },

    on: {
      init: function () {
        if (window.innerWidth <= 768) {
          const titleFractionEl = document.querySelector(
            ".title-fraction-mobile"
          );
          const total = this.slides.length - this.loopedSlides * 0;

          // Update the title fraction on slide change
          this.on("slideChange", function () {
            let realIndex = this.realIndex + 1;
            titleFractionEl.innerHTML =
              '<span class="current">' +
              realIndex +
              '</span> / <span class="total">' +
              total +
              "</span>";
          });

          // Initialize with the first slide
          titleFractionEl.innerHTML =
            '<span class="current">1</span> / <span class="total">' +
            total +
            "</span>";
        }
      },
      resize: function () {
        // Update when screen size changes
        const titleFractionEl = document.querySelector(
          ".title-fraction-mobile"
        );
        if (window.innerWidth <= 768) {
          titleFractionEl.style.display = "block";
          const total = this.slides.length - this.loopedSlides * 2;
          let realIndex = this.realIndex + 1;
          titleFractionEl.innerHTML =
            '<span class="current">' +
            realIndex +
            '</span> / <span class="total">' +
            total +
            "</span>";
        } else {
          titleFractionEl.style.display = "none";
        }
      },
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
}

swiperAdded();

function textAnimation() {
  let text = document.querySelector(".titleh1");
  let textContent = text.textContent;
  console.log(textContent);
  let words = textContent.split("");
  let halfValue = Math.floor(words.length / 2);

  console.log(halfValue);

  var clutter = "";
  words.forEach(function (elem, idx) {
    if (idx < halfValue) {
      clutter += `<span class="first-half">${elem}</span>`;
    } else {
      clutter += `<span class="second-half">${elem}</span>`;
    }
  });

  text.innerHTML = clutter;

  gsap.from(".titleh1 .first-half", {
    y: 30,
    opacity: 0,
    duration: 0.7,
    delay: 0.3,
    stagger: 0.15,
    scrollTrigger: {
      trigger: ".titleh1",
      scroller: "body",
      scrub: true,
      markers: false, // Set to false for production
      start: "top 80%",
      end: "bottom 50%",
    },
  });
  gsap.from(".titleh1 .second-half", {
    y: 30,
    opacity: 0,
    duration: 0.7,
    delay: 0.3,
    stagger: -0.15,
    scrollTrigger: {
      trigger: ".titleh1",
      scroller: "body",
      scrub: true,
      markers: false, // Set to false for production
      start: "top 80%",
      end: "bottom 50%",
    },
  });
}
textAnimation();

function frameAnimation() {
  // Configuration for the video frames
  const totalFrames = 152;
  const framePrefix = "./frames/output_";
  const frameSuffix = ".png";
  const frameContainer = document.querySelector(".page4");

  // Create a container for all frames
  const framesContainer = document.createElement("div");
  framesContainer.classList.add("frames-container");

  // Remove existing img if present
  const existingImg = frameContainer.querySelector("img");
  if (existingImg) {
    frameContainer.removeChild(existingImg);
  }

  frameContainer.appendChild(framesContainer);

  // Add a text element that will fade out during scroll
  const textElement = document.createElement("div");
  textElement.classList.add("frame-text");
  textElement.innerHTML =
    "<h2>Scroll down to Reveal</h2><p>Our packaging process in action</p>";
  textElement.style.position = "absolute";
  textElement.style.top = "10%";
  textElement.style.left = "50%";
  textElement.style.transform = "translate(-50%, -10%)";
  textElement.style.textAlign = "center";
  textElement.style.color = "#000";
  textElement.style.zIndex = "2";
  textElement.style.transition = "opacity 0.3s ease";
  textElement.style.fontSize = "2rem";
  textElement.style.width = "80%";
  frameContainer.appendChild(textElement);

  // Create a placeholder for the current frame
  const currentFrameImg = document.createElement("img");
  currentFrameImg.classList.add("frame-image");
  // Start with zero width
  currentFrameImg.style.width = "0%";
  framesContainer.appendChild(currentFrameImg);

  // Preload all frames
  const frameImages = [];
  for (let i = 1; i <= totalFrames; i++) {
    const frameNumber = i.toString().padStart(4, "0");
    const frameSrc = `${framePrefix}${frameNumber}${frameSuffix}`;

    const img = new Image();
    img.src = frameSrc;
    frameImages.push(img);

    // Set the first frame as the initial image
    if (i === 1) {
      currentFrameImg.src = frameSrc;
    }
  }

  // Setup ScrollTrigger for frame animation
  ScrollTrigger.create({
    trigger: frameContainer,
    start: "top top",
    end: "bottom top",
    scrub: 5,
    markers: false,
    onUpdate: (self) => {
      // Calculate which frame to show based on scroll progress
      const frameIndex = Math.min(
        Math.floor(self.progress * totalFrames),
        totalFrames - 1
      );

      // First 25% of scroll: Animate width from 0 to 100% and fade out text
      if (self.progress <= 0.25) {
        const widthProgress = self.progress * 2; // Convert to 0-1 range for first 25%
        gsap.to(currentFrameImg, {
          width: `${widthProgress * 100}%`,
          duration: 0.3,
          ease: "none",
          overwrite: "auto",
        });

        const isMobile = window.innerWidth <= 900;
        if (isMobile) {
          // On mobile: animate from 30% to 70%
          const newTopPosition = 10 + widthProgress * 40; // Move from 30% to 70%

          gsap.to(textElement, {
            top: `${newTopPosition}%`,
            opacity: 1 - widthProgress,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          // On desktop: keep at 10% and just fade out
          gsap.to(textElement, {
            top: "10%", // Stay fixed at 10%
            opacity: 1 - widthProgress,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      } else {
        // After 25%, keep width at 100% and text hidden
        gsap.to(currentFrameImg, {
          width: "100%",
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });

        // Use different positions based on screen width for final state
        const finalPosition = window.innerWidth <= 900 ? 70 : 30;

        gsap.to(textElement, {
          top: `${finalPosition}%`, // 70% on mobile, 50% on desktop
          opacity: "1",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      // Update the image source to show the current frame
      if (frameImages[frameIndex] && frameImages[frameIndex].complete) {
        currentFrameImg.src = frameImages[frameIndex].src;
      }
    },
    pin: true,
    anticipatePin: 1,
  });
}

frameAnimation();

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
    // console.log(e);
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

    // Magnetic effect on navigation elements
    Shery.makeMagnet(".burger, .logo", {
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


// function textAnimation2() {
//   let packagetext = document.querySelector(".package");
//   let brandtext = document.querySelector(".brand");
//   let packageContent = packagetext.textContent;
//   let brandContent = brandtext.textContent;
//   console.log(packageContent);
//   // let words1 = packageContent.split("");
//   // let words2 = brandContent.split("");
//   console.log(words2);
//  console.log(words1);
 

//   var clutter1 = "";
//   words1.forEach(function (elem, idx) {
//     clutter1 += `<span class="clutter1">${elem}</span>`;
//   });
//   var clutter2 = "";
//   words2.forEach(function (elem, idx) {
//     clutter2 += `<span class="clutter2">${elem}</span>`;
//   });

//   packagetext.innerHTML = clutter1;
//   brandtext.innerHTML = clutter2;

//   gsap.from(".clutter1", {
//     opacity: 0,
//     duration: 0.7,
//     delay: 0.3,
//     stagger: 0.15,
//     scrollTrigger: {
//       trigger: ".package",
//       scroller: "body",
//       markers: false, // Set to false for production
//     },
//   },"same");

//    gsap.from(".clutter2", {
//     opacity: 0,
//     duration: 0.6,
//     delay: 0.3,
//     stagger: 0.15,
//     scrollTrigger: {
//       trigger: ".brand",
//       scroller: "body",
//       markers: false, // Set to false for production
//     },
//   },"same");
// }
// textAnimation2();