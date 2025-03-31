class ProjectCard extends HTMLElement {
  /**
   * @param {Project} props 
   */
  constructor(props) {
    super(props);
    this.props = props;
  }

  connectedCallback() {
    const template = document.getElementById("project-card-template");
    const shadow = this.attachShadow({ mode: "open" });
    /** @type {DocumentFragment} */
    const content = template.content.cloneNode(true);

    if (!this.props)
      return;

    switch (this.props.type) {
      case "secondary": content.querySelector("[name='root']")?.classList.add("border"); break;
      default: content.querySelector("[name='root']")?.classList.add("shadow"); break;
    }

    content.querySelector("[name='project-title']").innerText = this.props.title;

    if (this.props.thumbnailFile)
      content.querySelector("img[name='thumbnail']")?.setAttribute("src", `assets/thumbnails/${this.props.thumbnailFile}`);
    else
      content.querySelector("img[name='thumbnail']")?.parentElement.classList.add("collapsed");

    if (this.props.gitUri) {
      const link = content.querySelector("a[name='project-git']");
      const icon = link.querySelector("img");

      link?.setAttribute("href", this.props.gitUri);

      if (this.props.gitUri.includes("github")) {
        icon?.setAttribute("title", "Github");
        icon?.setAttribute("alt", "Github");
        icon?.setAttribute("src", "assets/logos/GitHub-Mark-64px.png");
      }
      else if (this.props.gitUri.includes("gitlab")) {
        icon?.setAttribute("title", "Gitlab");
        icon?.setAttribute("alt", "Gitlab");
        icon?.setAttribute("src", "assets/logos/gitlab-icon-rgb.png");
      }
    }

    if (this.props.badges) {
      const badges = content.querySelector("div[name='badges']");

      this.props.badges.forEach(badge => {
        const badgeElement = document.createElement("span");
        badgeElement.innerText = badge.title;
        badgeElement.classList.add("badge");

        switch (badge.type) {
          case "secondary": badgeElement.classList.add("secondary"); break;
          case "archived": badgeElement.classList.add("archived"); break;
          default: break;
        }

        badges.append(badgeElement);
      });
    }

    if (this.props.description) {
      const description = content.querySelector("div[name='description']");
      const p = document.createElement("p");
      p.innerText = this.props.description;

      description.append(p);
    }

    if (this.props.links) {
      const links = content.querySelector("div[name='links']");

      this.props.links.forEach(link => {
        const a = document.createElement("a");
        a.setAttribute("target", "_blank");
        a.setAttribute("href", link.url);
        a.innerText = link.text;

        links.append(a);
      });
    }

    shadow.appendChild(content);


    //   const body = document.querySelector("body");

    //   const popup = shadow.querySelector(".image-popup");
    //   const popupSlot = popup.querySelector("slot[name='thumbnail']");
    //   const img = popupSlot?.assignedElements()[0];

    //   popupSlot.addEventListener("slotchange", e => {
    //     console.log(popupSlot.assignedElements());
    //   });

    //   // console.log(popup.querySelector("slot[name='thumbnail']"));

    //   if (!popup || !img)
    //     return;

    //   popup.addEventListener("click", () => {
    //     if (popup.classList.contains("open")) {
    //       body.classList.remove("popup-open");
    //       popup.classList.remove("open");
    //       img.style.scale = 1;
    //       img.style.transform = "";
    //     }
    //     else {
    //       setImagePopupPosition(img);

    //       body.classList.add("popup-open");
    //       popup.classList.add("open");
    //     }
    //   });
  }
}

customElements.define("project-card", ProjectCard);

document.addEventListener("DOMContentLoaded", () => {
  appendProjects([primaryProjects, wimmaProjects, otherProjects]);
});

/**
 * @param {Project[][]} projectLists 
 */
function appendProjects(projectLists) {
  const projectsContainer = document.getElementById("projects");
  const divider = document.createElement("div");
  divider.classList.add("project-divider");

  for (let i = 0; i < projectLists.length; i++) {
    const list = projectLists[i];

    list.forEach(project => {
      projectsContainer?.append(new ProjectCard(project));
    });

    if (i < projectLists.length - 1)
      projectsContainer.append(divider.cloneNode(false));
  }
}

// function initImagePopups() {
//   const body = document.querySelector("body");
//   const popups = document.body.querySelectorAll(".image-popup");

//   if (popups.length == 0)
//     return;

//   window.addEventListener("resize", () => {
//     popups.forEach(popup => {
//       const img = popup.getElementsByTagName("img")[0];

//       if (!img)
//         return;

//       if (popup.classList.contains("open")) {
//         setImagePopupPosition(img);
//       }
//     });
//   });

//   popups.forEach(popup => {
//     popup.addEventListener("click", () => {
//       const img = popup.getElementsByTagName("img")[0];

//       if (!img)
//         return;

//       if (popup.classList.contains("open")) {
//         body.classList.remove("popup-open");
//         popup.classList.remove("open");
//         img.style.scale = 1;
//         img.style.transform = "";
//       }
//       else {
//         setImagePopupPosition(img);

//         body.classList.add("popup-open");
//         popup.classList.add("open");
//       }
//     });
//   });

//   /**
//   * @param {HTMLElement} element 
//   */
//   function setImagePopupPosition(element) {
//     const margin = 40;
//     const yRatio = window.innerHeight / (element.height + margin * 2);
//     const xRatio = window.innerWidth / (element.width + margin * 2);
//     const scale = Math.min(xRatio, yRatio, 2);

//     const imgOffsets = getElementOffsets(element);
//     const scrollOffset = { x: window.scrollX, y: window.scrollY };
//     const horizontalPosition = (((window.innerWidth - element.width) / 2) - (imgOffsets.x + scrollOffset.x)) / scale;
//     const verticalPosition = (((window.innerHeight - element.height) / 2) - (imgOffsets.y + scrollOffset.y)) / scale;

//     element.style.scale = scale;
//     element.style.transform = `translate(${horizontalPosition}px, ${verticalPosition}px)`;
//   }

//   /**
//    * @param {HTMLElement} element 
//    * @returns {{x: number, y: number }}
//    */
//   function getElementOffsets(element) {
//     var x = element.offsetLeft;
//     var y = element.offsetTop;
//     var parent = element.offsetParent;

//     while (parent) {
//       x += parent.offsetLeft;
//       y += parent.offsetTop;

//       parent = parent.offsetParent;
//     }

//     return { x, y }
//   }
// }

class Project {
  /**
   * @param {Object} project
   * @param {string} project.title 
   * @param {string} project.description 
   * @param {{title: string, type: null | "secondary" | "archived"}[]} project.badges 
   * @param {string} project.gitUri 
   * @param {string} project.thumbnailFile 
   * @param {null | "secondary"} project.type 
   * @param {{url: string, text: string}[]?} project.links 
   */
  constructor({ title, description, badges, gitUri, thumbnailFile, type, links }) {
    this.title = title;
    this.description = description;
    this.links = links;
    this.badges = badges;
    this.gitUri = gitUri;
    this.thumbnailFile = thumbnailFile;
    this.type = type;
  }
}

const primaryProjects = [
  new Project({
    title: "MTG-Application",
    description: "Card collection, deck building and testing application for Magic the Gathering card game. Uses Scryfall API to fetch card information.",
    badges: [{ title: ".Net" }, { title: "C#" }, { title: "Desktop", type: "secondary" }],
    gitUri: "https://github.com/aamoJL/MTG-Application",
    thumbnailFile: "MTG-Application-thumbnail.png"
  }),
  new Project({
    title: "LM2 Notepad & Mapping Tool",
    description: "Notepad and mapping tool for La-Mulana 2 videogame. Maps can be created by taking screenshots of the game's world while playing. Notes can be written or scanned from the game's hints.",
    badges: [{ title: "Javascript" }, { title: "Node.js" }, { title: "Desktop", type: "secondary" }, { title: "Electron", type: "secondary" }],
    gitUri: "https://github.com/aamoJL/LM2Notepad",
    thumbnailFile: "la-mulana-map-tool-thumbnail.png",
    links: [{ url: "https://aamojl.github.io/LM2Notepad/demo/map.html", text: "Try the web demo" }]
  }),
  new Project({
    title: "Android Cookbook",
    description: "Cookbook application for Android phones.",
    badges: [{ title: "Kotlin" }, { title: "Jetpack Compose" }, { title: "Android", type: "secondary" }, { title: "MVVM", type: "secondary" }],
    gitUri: "https://github.com/aamoJL/Android-Cookbook",
    thumbnailFile: "Android-cookbook-thumbnail.png",
  }),
  new Project({
    title: "VOD-Player",
    description: "Offline Twitch VOD player with chat.",
    badges: [{ title: ".Net" }, { title: "C#" }, { title: "Desktop", type: "secondary" }],
    gitUri: "https://github.com/aamoJL/VOD-Player",
    thumbnailFile: "VODPlayer-thumbnail.png",
  })
]

const wimmaProjects = [
  new Project({
    title: "WIMMA Lab: TACS",
    description: "Realtime situational awareness system prototype for EHASA ry's airsoft games that can be used to track player positions and give them information, missions and orders by text or drawing shapes on the app's map.",
    badges: [{ title: "React" }, { title: "Node.js" }, { title: "Website", type: "secondary" }, { title: "🗃️ Archived", type: "archived" }],
    gitUri: "https://gitlab.labranet.jamk.fi/wimma-lab-2019/overflow",
    thumbnailFile: "TACS_thumbnail.PNG",
    links: [{ url: "https://www.youtube.com/watch?v=PUbhPWmNI3k", text: "Watch the product video" }],
    type: "secondary"
  }),
  new Project({
    title: "WIMMA Lab: Haastix",
    description: "Social game platform, where players are competing who can complete given challenges the fastest. The challenges are completed by taking pictures and sending them to evaluation. The gamemaster will then accept or reject the submission.",
    badges: [{ title: "React" }, { title: "Node.js" }, { title: "Website", type: "secondary" }, { title: "🗃️ Archived", type: "archived" }],
    gitUri: "https://gitlab.labranet.jamk.fi/wimma-lab-2022/iotitude",
    type: "secondary"
  })
];

const otherProjects = [
  new Project({
    title: "Misc. Programming Exercises",
    description: "Miscellaneous CSS, design pattern and data structure exercises.",
    badges: [{ title: "CSS" }, { title: "C#" }, { title: "Design Patterns", type: "secondary" }, { title: "Data Structures", type: "secondary" }],
    gitUri: "https://github.com/aamoJL/Exercises",
    links: [{ url: "https://aamojl.github.io/Exercises/CSS/index.html", text: "Check the CSS exercises page" }],
    type: "secondary"
  }),
]

// new Project({
//   title: "",
//   description: "",
//   badges: [{ title: "" }, { title: "" }, { title: "", type: "secondary" }, { title: "", type: "secondary" }],
//   gitUri: "",
//   thumbnailFile: "",
//   links: [{url: "", text: ""}]
//   type: ""
// })