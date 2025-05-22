import { gsap } from "https://cdn.skypack.dev/gsap";
import { CustomEase } from "https://cdn.skypack.dev/gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0,0.1,1");

function loading() {
  window.addEventListener("load", () => {
    const tl = gsap.timeline({
      delay: 0.3,
      defaults: {
        ease: "hop",
      },
      onComplete: () => {
        document.querySelector(".loading-image").style.display = "none";
      }
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
    tl.to(".loading-image", {
      opacity: 0,
      duration: 0.5,
    },'anim');

    tl.to(".spinner", {
      opacity: 0,
      duration: 0.5,
    },'anim');
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
    gsap.set(".spinner",{ opacity: 0 });
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
        tl.reverse();
        isOpen = false;
      });
    });
  });
}

nav();
