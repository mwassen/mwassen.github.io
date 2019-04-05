// 3D BACKGROUND
import LogoBackground from "./ThreeLogo";

// WEBGL COMPATIBILITY
import { WebGL } from "three-full/sources/helpers/WebGL";

// CSS
import "../css/main.css";

// Check for WebGL Compatibility
if (WebGL.isWebGLAvailable() === false) {
  document.body.innerHTML = WebGL.getWebGLErrorMessage();
}

const devMode = process.env.NODE_ENV === "development";

// let logoMesh; // Logo model for global access
let scale = 70;

// Window sizing
let width = window.innerWidth;
let height = window.innerHeight;

// element references
const scrollSvg = document.getElementById("scroll-marker");
const contentBg = document.getElementById("bg");
const writtenContent = document.getElementById("main-container");
const threeDiv = document.getElementById("three");
const projectDivs = [...document.getElementsByClassName("work-project")];

// Device check
const onMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
  navigator.userAgent
);

if (onMobile) {
  const mobileHeight = height + 56;
  height = mobileHeight;
  threeDiv.style.height = mobileHeight + "px";
  scrollSvg.style.marginBottom = "75px";
  scale = 60;
}

// THREE BACKGROUND
const threeBackground = LogoBackground({
  width,
  height,
  onMobile,
  devMode,
  scale
});
threeDiv.appendChild(threeBackground.domElement);

// Show scroll indicator
setTimeout(() => {
  if (window.scrollY === 0) scrollSvg.style.opacity = 1;
}, 2500);

// EVENTS
if (!onMobile) {
  window.addEventListener("resize", () => {
    threeBackground.resize([window.innerWidth, window.innerHeight]);
  });
} else {
  window.addEventListener("orientationchange", () => {
    threeBackground.reorient(screen.orientation.angle, [
      window.innerWidth,
      window.innerHeight
    ]);
  });
  // if (devMode) {
  //   let gyroscope = new Gyroscope({ frequency: 60 });
  //   gyroscope.addEventListener("reading", () => {
  //     threeBackground.gyro([gyroscope.x, gyroscope.y, gyroscope.z]);
  //   });
  //   gyroscope.start();
  // }
}
let textActive = false;
window.addEventListener("scroll", () => {
  threeBackground.scroll(window.scrollY);

  // Fade in/out scroll indicator
  if (window.scrollY > 0) {
    scrollSvg.style.opacity = 0;
  } else if (window.scrollY === 0) {
    scrollSvg.style.opacity = 1;
  }

  // Fade in/out written content
  if (window.scrollY > window.innerHeight / 2) {
    contentBg.style.opacity = 0.75;
    if (!textActive) {
      textActive = true;
      setTimeout(() => {
        writtenContent.style.opacity = 1;
      }, 200);
    }
  } else {
    contentBg.style.opacity = 0;
    writtenContent.style.opacity = 0;
    textActive = false;
  }
});
// Mouse effects for project Divs
projectDivs.forEach((project, ind) => {
  // Add links to project divs
  const url = ind === 0 ? "./tapefumes" : "./musicforecast";
  project.onclick = () => window.open(url);

  // Add github links to projects in on desktop
  if (!onMobile) {
    const ghLink = project.querySelector(".github-link");
    project.addEventListener("mouseenter", () => {
      ghLink.style.opacity = 0.25;
      ghLink.style.cursor = "pointer";
    });
    project.addEventListener("mouseleave", () => {
      ghLink.style.opacity = 0;
      ghLink.style.cursor = "none";
    });
    ghLink.addEventListener("mouseenter", () => {
      ghLink.style.opacity = 1;
      project.onclick = null;
    });
    ghLink.addEventListener("mouseleave", () => {
      ghLink.style.opacity = 0.25;
      project.onclick = () => window.open(url);
    });
  } else {
    // project.style.backgroundColor = "rgba(169, 115, 212, 0.08)";
    project.style.border = "1px dashed rgba(64, 104, 224, 0.3)";
  }
});

// Reset scroll location on page reload
window.onbeforeunload = () => {
  window.scrollTo(0, 0);
};
