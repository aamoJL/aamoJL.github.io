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
    /** @type {DocumentFragment} */
    const content = template.content.cloneNode(true);

    if (!this.props)
      return;

    switch (this.props.type) {
      case "secondary": content.querySelector("[name='root']")?.classList.add("border"); break;
      default: content.querySelector("[name='root']")?.classList.add("shadow"); break;
    }

    content.querySelector("[name='project-title']").innerText = this.props.title;

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

      this.props.description.forEach(desc => {
        const p = document.createElement("p");
        p.innerText = desc;

        description.append(p);
      });
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

    if (this.props.thumbnailFile) {
      const thumbnail = content.querySelector("[name='thumbnail']");
      const img = thumbnail?.querySelector("img");

      if (thumbnail && img) {
        img.setAttribute("src", `assets/thumbnails/${this.props.thumbnailFile}`);

        // Image popup
        thumbnail.addEventListener("click", _ => {
          if (thumbnail.classList.contains("open"))
            this.closeImagePopup(thumbnail);
          else
            this.openImagePopup(thumbnail);
        });

        window.addEventListener("resize", () => {
          if (thumbnail.classList.contains("open"))
            this.setImagePopupPosition(img);
        });
      }
    }
    else
      content.querySelector("[name='thumbnail']")?.classList.add("collapsed");

    this.append(content);
  }

  /**
   * @param {HTMLElement} popup 
   */
  openImagePopup(popup) {
    const body = document.querySelector("body");
    const img = popup.querySelector("img");

    this.setImagePopupPosition(img);
    body.classList.add("popup-open");
    popup.classList.add("open");

    document.getElementById("popup-background")?.addEventListener("click", () => {
      this.closeImagePopup(popup);
    }, { once: true });

  }

  /**
   * @param {HTMLElement} popup 
   */
  closeImagePopup(popup) {
    const body = document.querySelector("body");
    const img = popup.querySelector("img");

    body.classList.remove("popup-open");
    popup.classList.remove("open");
    img.style.transform = "";
  }

  /**
  * @param {HTMLElement} element 
  */
  setImagePopupPosition(element) {
    const finalHeight = window.innerHeight * .8; // Width after transition
    const finalWidth = window.innerWidth * .8; // Height after transition

    const imgOffsets = this.getElementOffsets(element);
    const scrollOffset = { x: window.scrollX, y: window.scrollY };
    const horizontalPosition = -imgOffsets.x + (window.innerWidth - finalWidth) / 2 + scrollOffset.x;
    const verticalPosition = -imgOffsets.y + (window.innerHeight - finalHeight) / 2 + scrollOffset.y;

    element.style.transform = `translate(${horizontalPosition}px, ${verticalPosition}px)`;
  }

  /**
   * @param {HTMLElement} element 
   * @returns {{x: number, y: number }}
   */
  getElementOffsets(element) {
    var x = element.offsetLeft;
    var y = element.offsetTop;
    var parent = element.offsetParent;

    while (parent) {
      x += parent.offsetLeft;
      y += parent.offsetTop;

      parent = parent.offsetParent;
    }

    return { x, y }
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
      //asd(project);
      projectsContainer?.append(new ProjectCard(project));
    });

    if (i < projectLists.length - 1)
      projectsContainer.append(divider.cloneNode(false));
  }
}

class Project {
  /**
   * @param {Object} project
   * @param {string} project.title 
   * @param {string[]} project.description 
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
    description: [
      "Card collection, deck building and testing application for Magic the Gathering card game.",
      "The application uses the scryfall.com search API to fetch the card information."
    ],
    badges: [{ title: ".Net" }, { title: "C#" }, { title: "Desktop", type: "secondary" }],
    gitUri: "https://github.com/aamoJL/MTG-Application",
    thumbnailFile: "mtg-application-thumbnail.png"
  }),
  new Project({
    title: "LM2 Notepad & Mapping Tool",
    description: [
      "Notepad and mapping tool for La-Mulana 2 videogame.",
      "Maps can be created by taking screenshots of the game's world while playing. Notes can be written or scanned from the game's texts using optical character recognition (OCR)."
    ],
    badges: [{ title: "Javascript" }, { title: "Node.js" }, { title: "Desktop", type: "secondary" }, { title: "Electron", type: "secondary" }],
    gitUri: "https://github.com/aamoJL/LM2Notepad",
    thumbnailFile: "la-mulana-map-tool-thumbnail.png",
    links: [{ url: "https://aamojl.github.io/LM2Notepad/demo/map.html", text: "Try the web demo" }]
  }),
  new Project({
    title: "Android Cookbook",
    description: ["Cookbook application for Android phones."],
    badges: [{ title: "Kotlin" }, { title: "Jetpack Compose" }, { title: "Android", type: "secondary" }, { title: "MVVM", type: "secondary" }],
    gitUri: "https://github.com/aamoJL/Android-Cookbook",
    thumbnailFile: "android-cookbook-thumbnail.png",
  }),
  new Project({
    title: "VOD-Player",
    description: ["Offline livestream video player with chat."],
    badges: [{ title: ".Net" }, { title: "C#" }, { title: "Desktop", type: "secondary" }],
    gitUri: "https://github.com/aamoJL/VOD-Player",
    thumbnailFile: "vod-player-thumbnail.png",
  }),
  new Project({
    title: "Unity Motion Capture",
    description: [
      "Motion capture using virtual reality devices for Unity engine.",
      "The project was for my school thesis."
    ],
    badges: [{ title: "Unity" }, { title: "C#" }, { title: "Motion Capture", type: "secondary" }, { title: "Virtual Reality", type: "secondary" }],
    gitUri: "https://github.com/aamoJL/Unity-Mocap",
    thumbnailFile: "mocap-thumbnail.png",
    links: [{ url: "https://github.com/user-attachments/assets/e8a6d130-1aa0-4e17-95c8-a0201a840bdf", text: "Watch the demonstration video" }],
  })
]

const wimmaProjects = [
  new Project({
    title: "WIMMA Lab: TACS",
    description: ["Realtime situational awareness system prototype for EHASA ry's airsoft games that can be used to track player positions and give them information, missions and orders by text or drawing shapes on the app's map."],
    badges: [{ title: "React" }, { title: "Node.js" }, { title: "Website", type: "secondary" }, { title: "🗃️ Archived", type: "archived" }],
    gitUri: "https://gitlab.labranet.jamk.fi/wimma-lab-2019/overflow",
    thumbnailFile: "tacs-thumbnail.PNG",
    links: [{ url: "https://www.youtube.com/watch?v=PUbhPWmNI3k", text: "Watch the product video" }],
    type: "secondary"
  }),
  new Project({
    title: "WIMMA Lab: Haastix",
    description: ["Social game platform, where players are competing who can complete given challenges the fastest. The challenges are completed by taking pictures and sending them to evaluation. The gamemaster will then accept or reject the submission."],
    badges: [{ title: "React" }, { title: "Node.js" }, { title: "Website", type: "secondary" }, { title: "🗃️ Archived", type: "archived" }],
    gitUri: "https://gitlab.labranet.jamk.fi/wimma-lab-2022/iotitude",
    type: "secondary"
  })
];

const otherProjects = [
  new Project({
    title: "Misc. Programming Exercises",
    description: ["Miscellaneous CSS, design pattern and data structure exercises."],
    badges: [{ title: "CSS" }, { title: "C#" }, { title: "Design Patterns", type: "secondary" }, { title: "Data Structures", type: "secondary" }],
    gitUri: "https://github.com/aamoJL/Exercises",
    links: [{ url: "https://aamojl.github.io/Exercises/CSS/index.html", text: "Check the CSS exercises page" }],
    type: "secondary"
  }),
]

// new Project({
//   title: "",
//   description: [""],
//   badges: [{ title: "" }, { title: "" }, { title: "", type: "secondary" }, { title: "", type: "secondary" }],
//   gitUri: "",
//   thumbnailFile: "",
//   links: [{url: "", text: ""}],
//   type: ""
// })