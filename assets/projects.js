const projectsFeed = document.getElementById("projects-feed");

function renderProjects(projects) {
    const validProjects = projects
        .filter((project) => project.title && project.url)
        .sort((left, right) => (right.year || 0) - (left.year || 0));

    if (!validProjects.length) {
        projectsFeed.innerHTML = '<p class="post-empty">No projects yet.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();

    validProjects.forEach((project) => {
        const card = document.createElement("a");
        card.className = "post-card glass";
        card.href = project.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";

        const content = document.createElement("span");
        content.className = "post-content";

        const header = document.createElement("span");
        header.className = "post-header";

        const title = document.createElement("span");
        title.className = "post-title";

        if (project.icon) {
            const icon = document.createElement("span");
            icon.className = "iconify post-source-icon";
            icon.setAttribute("data-icon", project.icon);
            icon.setAttribute("aria-label", project.source || "Project source");
            if (project.color) {
                icon.style.color = project.color;
            }
            title.append(icon);
        }

        const titleText = document.createElement("span");
        titleText.textContent = project.title;
        title.append(titleText);
        header.append(title);

        if (project.year) {
            const year = document.createElement("span");
            year.className = "post-year";
            year.textContent = project.year;
            header.append(year);
        }

        content.append(header);

        if (project.content) {
            const body = document.createElement("span");
            body.className = "post-text";
            body.textContent = project.content;
            content.append(body);
        }

        card.append(content);
        fragment.append(card);
    });

    projectsFeed.replaceChildren(fragment);
}

async function loadProjects() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2500);

    try {
        const response = await fetch("projects.json", {
            cache: "no-store",
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`projects.json returned ${response.status}`);
        }

        renderProjects(await response.json());
    } catch (error) {
        console.error(error);
        projectsFeed.innerHTML = '<p class="post-empty">Unable to load projects.</p>';
    } finally {
        window.clearTimeout(timeout);
    }
}

loadProjects();
