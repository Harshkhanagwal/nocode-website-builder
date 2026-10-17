const makeDefaultHeader = (websiteName) => ({
  sectionName: "header",
  variant: "minimal-centered",
  enabled: true,
  order: 0,
  content: {
    logo: {
      type: "text",
      text: websiteName || "Website",
      image: "",
      href: "/",
      visibility: true,
    },
    navigation: [
      { label: "Home", href: "/" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
    actions: [],
    settings: {
      sticky: false,
      showNavigation: true,
      showActions: true,
      mobileMenu: true,
    },
  },
});

const ensureDefaultHeader = (website) => {
  if (!website) return false;

  const sections = website.sections || [];
  const ordered = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const headers = ordered.filter((section) => section.sectionName === "header");
  const header = headers[0];
  let changed = false;

  if (!header) {
    ordered.forEach((section, index) => {
      const order = index + 1;
      if (section.order !== order) {
        section.order = order;
        changed = true;
      }
    });
    website.sections.unshift(makeDefaultHeader(website.name));
    changed = true;
  } else {
    // Keep the earliest header, removing any legacy duplicates.
    for (let index = website.sections.length - 1; index >= 0; index -= 1) {
      if (website.sections[index].sectionName === "header" && website.sections[index] !== header) {
        website.sections.splice(index, 1);
        changed = true;
      }
    }

    if (header.enabled !== true) {
      header.enabled = true;
      changed = true;
    }
    if (header.order !== 0) {
      header.order = 0;
      changed = true;
    }

    const others = [...website.sections]
      .filter((section) => section !== header)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    others.forEach((section, index) => {
      const order = index + 1;
      if (section.order !== order) {
        section.order = order;
        changed = true;
      }
    });
  }

  if (typeof website.sections.sort === "function") {
    website.sections.sort((a, b) => a.order - b.order);
  }
  if (changed) website.markModified?.("sections");
  return changed;
};

module.exports = { ensureDefaultHeader, makeDefaultHeader };
