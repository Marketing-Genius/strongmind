(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("instructorMount");
    if (!mount) return;

    // ---- Mock creator + content data (replace later with real data/API) ----
    const creator = {
  id: "sarah-holmes",
  name: "Sarah Holmes",
  handle: "@mrs_holmes",
  role: "Certified Teacher",
  photo: "assets/sarah-holmes.png",
  bio: "Certified teacher who blends warm structure with hands-on learning. Expect bite-sized lessons, clear routines, and practical activities you can do at home—built to boost confidence, consistency, and real progress.",
  introVimeoId: "1147775555",
  introVimeoHash: "7da67761df"
};

    const learnerInterests = (JSON.parse(localStorage.getItem("learnerInterests") || "[]"));
    const purchasedCourses = new Set(JSON.parse(localStorage.getItem("purchasedCourses") || "[]"));

    const courses = [
      {
        id: "algebra-1",
        title: "Algebra 1",
        thumb: "assets/course-algebra.png",
        tags: ["math", "middle-school"],
        rating: 4.8,
        students: 18234,
        forYouScore: learnerInterests.includes("math") ? 95 : 50
      },
      {
        id: "science-101",
        title: "Science 101",
        thumb: "assets/course-science.png",
        tags: ["science", "experiments"],
        rating: 4.7,
        students: 24110,
        forYouScore: learnerInterests.includes("science") ? 92 : 55
      },
      {
        id: "world-history",
        title: "World History",
        thumb: "assets/course-history.png",
        tags: ["history", "humanities"],
        rating: 4.6,
        students: 13500,
        forYouScore: learnerInterests.includes("history") ? 90 : 45
      },
      {
        id: "creative-writing",
        title: "Creative Writing 101",
        thumb: "assets/course-writing.png",
        tags: ["writing", "language-arts"],
        rating: 4.9,
        students: 9800,
        forYouScore: learnerInterests.includes("writing") ? 94 : 48
      }
    ];

const feed = [
  {
    id: "sarah-video-1",
    type: "video",
    title: "Quick Welcome",
    caption: "Here’s what we’re learning this week — and how to make it fun + consistent at home.",
    thumb: "assets/instructor-feed/sarah-01-video.jpg",
    vimeoId: "1147814315",
    vimeoHash: "493e5be159",
    createdAt: 5
  },
  {
    id: "sarah-locked-1",
    type: "locked",
    title: "Members Lesson",
    caption: "Locked — unlock via Science 101.",
    thumb: "assets/instructor-feed/sarah-02-locked.jpg",
    courseGate: "science-101",
    createdAt: 4
  },
  {
    id: "sarah-image-1",
    type: "image",
    title: "Happy Holidays",
    caption: "Happy Holidays! I’m taking a little time off to be with family. See you soon — and keep those routines light and joyful 💛",
    thumb: "assets/instructor-feed/sarah-03-holidays.jpg",
    createdAt: 3
  },
  {
  id: "post-4",
  title: "Happy Holidays from Mrs. Holmes!",
  type: "video",
  access: "open",
  thumb: "assets/instructor-feed/sarah-04-placeholder.jpg",
  vimeoId: "1147823088",
  vimeoHash: "3e2a92f37a",
  caption:
    "Hey all, just wanted to drop in real quick and wish everyone a happy and healthy holiday season! Keep learning with Mrs. Holmes!"
},
  {
    id: "sarah-post-5",
    type: "image",
    title: "Coming Soon",
    caption: "Placeholder post — we’ll add this next.",
    thumb: "assets/instructor-feed/sarah-05-placeholder.jpg",
    createdAt: 1
  }
];

    const products = [
  {
    id: "product-1",
    title: "Volcano Lab Kit",
    image: "assets/products/product-1.jpg",
    priceTokens: 3999, // $39.99 → 3,999 SparkTokens
    note: "Hands-on science experiment kit."
  },
  {
    id: "product-2",
    title: "Beginner’s Reading Kit",
    image: "assets/products/product-2.jpg",
    priceTokens: 2499, // $24.99 → 2,499 SparkTokens
    note: "Perfect for early literacy development."
  },
  {
    id: "product-3",
    title: "Science STEM Lab",
    image: "assets/products/product-3.jpg",
    priceTokens: 5999, // $59.99 → 5,999 SparkTokens
    note: "Advanced STEM exploration at home."
  },
  {
    id: "product-4",
    title: "Hey Clay – Art Supply",
    image: "assets/products/product-4.jpg",
    priceTokens: 2999, // $29.99 → 2,999 SparkTokens
    note: "Creative sculpting and fine motor fun."
  }
];

    const rating = {
      avg: 4.8,
      count: 1328,
      comments: [
        { who: "Parent • Arizona", text: "My kid actually asks to do the lessons. That never happens." },
        { who: "Learner • 9th grade", text: "Short videos, super clear. The experiments are fun." },
        { who: "Parent • Homeschool", text: "Love the structure and the friendly tone. Feels premium." }
      ]
    };

    // ---- UI state ----
    let activeTag = "all";
    let sortMode = "popular"; // popular | rated | suggested

    // ---- render helpers ----
    function getAllTags() {
      const set = new Set();
      courses.forEach(c => c.tags.forEach(t => set.add(t)));
      return ["all", ...Array.from(set).sort()];
    }

    function isUnlocked(item) {
      if (item.access === "open") return true;
      if (item.access === "locked" && item.courseGate) {
        return purchasedCourses.has(item.courseGate);
      }
      return false;
    }

    function filteredAndSortedCourses() {
      let list = courses.slice();

      if (activeTag !== "all") {
        list = list.filter(c => c.tags.includes(activeTag));
      }

      if (sortMode === "popular") {
        list.sort((a, b) => b.students - a.students);
      } else if (sortMode === "rated") {
        list.sort((a, b) => b.rating - a.rating);
      } else if (sortMode === "suggested") {
        list.sort((a, b) => b.forYouScore - a.forYouScore);
      }

      return list;
    }

    function ensureFeedModal() {
  let modal = document.getElementById("feedVideoModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "feedVideoModal";
  modal.className = "feed-modal hidden";
  modal.innerHTML = `
    <div class="feed-modal-inner">
      <div class="feed-modal-top">
        <div>Post</div>
        <button class="feed-modal-close" id="feedModalClose">Close</button>
      </div>
      <div class="feed-modal-video" id="feedModalVideo"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // close handlers
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeFeedVideoModal();
  });
  modal.querySelector("#feedModalClose").addEventListener("click", closeFeedVideoModal);

  return modal;
}

function openFeedVideoModal(vimeoId, vimeoHash) {
  const modal = ensureFeedModal();
  const shell = modal.querySelector("#feedModalVideo");

  shell.innerHTML = `
    <iframe
      src="https://player.vimeo.com/video/${vimeoId}?h=${vimeoHash}&autoplay=1&title=0&byline=0&portrait=0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;

  modal.classList.remove("hidden");
}

function closeFeedVideoModal() {
  const modal = document.getElementById("feedVideoModal");
  if (!modal) return;
  const shell = modal.querySelector("#feedModalVideo");
  shell.innerHTML = ""; // stop playback
  modal.classList.add("hidden");
}

    function render() {
      mount.innerHTML = `
        <div class="instructor-page">

          <!-- HERO -->
          <section class="instructor-hero">
            <div class="avatar-col">
            <img class="instructor-avatar" src="${creator.photo}" alt="${creator.name}">
            <button class="follow-btn" id="followInstructorBtn">Follow</button>
            </div>
            <div class="instructor-meta">
              <h1>${creator.name}</h1>
              <div class="instructor-handle">${creator.handle}</div>
              <div class="role-pill certified" style="display:inline-block; margin-top:8px;">${creator.role}</div>
              <div class="instructor-bio">${creator.bio}</div>
            </div>

            <div class="video-card">
              <iframe
                src="https://player.vimeo.com/video/${creator.introVimeoId}?h=${creator.introVimeoHash}&title=0&byline=0&portrait=0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen>
              </iframe>
            </div>
          </section>

          <!-- COURSES -->
          <div class="instructor-divider">COURSES</div>
          <section class="courses-shell">
            <div class="course-controls">
              <div class="pill-row" id="tagPills"></div>

              <div style="display:flex; gap:10px; align-items:center;">
                <select class="select" id="sortSelect">
                  <option value="popular">Most popular</option>
                  <option value="rated">Highest rated</option>
                  <option value="suggested">Suggested for your learner(s)</option>
                </select>
                <button class="pill" id="viewAllBtn" title="Placeholder">View All Courses</button>
              </div>
            </div>

            <div class="course-grid" id="courseGrid"></div>
          </section>

          <!-- FEED -->
          <div class="instructor-divider">INSTRUCTOR FEED</div>
          <section class="feed-shell" id="feedShell"></section>

          <!-- PRODUCTS -->
          <div class="instructor-divider">SUGGESTED PRODUCTS</div>
          <section class="products-shell">
            <div class="product-grid" id="productGrid"></div>
          </section>

          <!-- RATINGS -->
          <div class="instructor-divider">RATINGS & COMMENTS</div>
          <section class="ratings-shell" id="ratingsShell"></section>

        </div>
      `;

  bindFollowButton();

      // tag pills
      const tagPills = document.getElementById("tagPills");
      const tags = getAllTags();
      tagPills.innerHTML = tags.map(t => `
        <button class="pill ${t === activeTag ? "active" : ""}" data-tag="${t}">
          ${t === "all" ? "All" : t}
        </button>
      `).join("");

      tagPills.querySelectorAll("[data-tag]").forEach(btn => {
        btn.addEventListener("click", () => {
          activeTag = btn.getAttribute("data-tag");
          render();
        });
      });

      // sort select
      const sortSelect = document.getElementById("sortSelect");
      sortSelect.value = sortMode;
      sortSelect.addEventListener("change", (e) => {
        sortMode = e.target.value;
        render();
      });

      // view all placeholder
      document.getElementById("viewAllBtn").addEventListener("click", () => {
        alert("Placeholder: View All Courses (future page/modal).");
      });

      // courses
      const courseGrid = document.getElementById("courseGrid");
      const list = filteredAndSortedCourses();
      courseGrid.innerHTML = list.map(c => `
        <div class="course-card" data-course="${c.id}">
          <img class="course-thumb" src="${c.thumb}" alt="${c.title}">
          <div class="course-title">${c.title}</div>
          <div class="course-meta">
            <span>⭐ ${c.rating.toFixed(1)}</span>
            <span>${c.students.toLocaleString()} learners</span>
          </div>
        </div>
      `).join("");

      courseGrid.querySelectorAll("[data-course]").forEach(card => {
        card.addEventListener("click", () => {
          const courseId = card.getAttribute("data-course");
          alert(`Placeholder: open course page for "${courseId}"`);
        });
      });

      // feed (horizontal cards)
const feedShell = document.getElementById("feedShell");

// Newest on left: sort desc by createdAt
const feedSorted = feed.slice().sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));

feedShell.innerHTML = `
  <div class="feed-rail">
    ${feedSorted.map(item => {
      if (item.type === "locked") {
        return `
          <div class="feed-card">
            <div class="feed-media locked">
              <img src="${item.thumb}" alt="${item.title}">
              <div class="locked-overlay">
                <div>
                  <div class="lock-icon">🔒</div>
                  <div class="lock-hover">
                    <div class="lock-title">Unlock Via Course</div>
                    <button class="lock-btn" data-unlock="${item.courseGate}">View Course</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="feed-caption">
              <div class="feed-title">${item.title}</div>
              <div class="feed-text">${item.caption}</div>
            </div>
          </div>
        `;
      }

      // image/video
      const isVideo = item.type === "video";
      return `
        <div class="feed-card" ${isVideo ? `data-video="${item.vimeoId}" data-hash="${item.vimeoHash}"` : ""}>
          <div class="feed-media ${isVideo ? "is-video" : ""}">
            <img src="${item.thumb}" alt="${item.title}">
            ${isVideo ? `<div class="play-badge"><span>▶</span></div>` : ``}
          </div>
          <div class="feed-caption">
            <div class="feed-title">${item.title}</div>
            <div class="feed-text">${item.caption}</div>
          </div>
        </div>
      `;
    }).join("")}
  </div>
`;

// Locked hover button
feedShell.querySelectorAll("[data-unlock]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const courseGate = btn.getAttribute("data-unlock");
    alert(`Placeholder: View course "${courseGate}" to unlock.`);
  });
});

// Video modal on card click
feedShell.querySelectorAll("[data-video]").forEach(card => {
  card.addEventListener("click", () => {
    const id = card.getAttribute("data-video");
    const hash = card.getAttribute("data-hash");
    openFeedVideoModal(id, hash);
  });
});

      // products
      productGrid.innerHTML = products.map(p => `
  <div class="product-card">
    <img class="product-image" src="${p.image}" alt="${p.title}">
    <h4>${p.title}</h4>
    <p class="product-price">
      ${p.priceTokens.toLocaleString()} SparkTokens
    </p>
    <p class="product-note">${p.note}</p>
    <div style="margin-top:10px;">
      <button class="pill" data-product="${p.id}">
        Buy with SparkTokens
      </button>
    </div>
  </div>
`).join("");
      
      productGrid.querySelectorAll("[data-product]").forEach(btn => {
        btn.addEventListener("click", () => {
          alert("Placeholder: product detail / affiliate link / cart later.");
        });
      });

      // ratings
      const ratingsShell = document.getElementById("ratingsShell");
      ratingsShell.innerHTML = `
        <div class="rating-summary">
          <div class="star-line">⭐ ${rating.avg.toFixed(1)} average • ${rating.count.toLocaleString()} reviews</div>
          <button class="pill" id="leaveReviewBtn">Leave a Review</button>
        </div>

        ${rating.comments.map(c => `
          <div class="comment">
            <strong>${c.who}</strong>
            <div style="color:#444; line-height:1.5;">${c.text}</div>
          </div>
        `).join("")}
      `;

      document.getElementById("leaveReviewBtn").addEventListener("click", () => {
        alert("Placeholder: review modal (future).");
      });
    }

function bindFollowButton() {
  const followBtn = document.getElementById("followInstructorBtn");
  if (!followBtn) return;

  const followKey = `follow_${creator.id}`;

  if (localStorage.getItem(followKey) === "true") {
    followBtn.classList.add("following");
    followBtn.textContent = "Following";
  } else {
    followBtn.classList.remove("following");
    followBtn.textContent = "Follow";
  }

  followBtn.onclick = () => {
    const isFollowing = followBtn.classList.toggle("following");
    followBtn.textContent = isFollowing ? "Following" : "Follow";
    localStorage.setItem(followKey, String(isFollowing));
  };
}
    
    render();
    
  });
})();
