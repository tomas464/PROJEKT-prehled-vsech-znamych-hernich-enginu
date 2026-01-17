document.addEventListener("DOMContentLoaded", () => {

    // Fetch enginy z JSON
    fetch("/data/enginedata.json")
        .then(res => res.json())
        .then(data => {
            const engines = data.engines;
            loadEngines(engines);
            loadTable(engines);
            setupRecommendation(engines);
        })
        .catch(err => console.error("Chyba při načítání JSON:", err));

    function loadEngines(engines) {
        const container = document.getElementById("engine-container");
        container.innerHTML = ""; // vyčistí container

        engines.forEach(engine => {
            const card = document.createElement("div");
            card.classList.add("engine-card");

            card.innerHTML = `
                <img src="${engine.logo}" alt="${engine.name}">
                <h3>${engine.name}</h3>
                <p>${engine.description}</p>
                <h4>🟢 Výhody</h4>
                <ul>${engine.advantages.map(a => `<li>${a}</li>`).join("")}</ul>
                <h4>🔴 Nevýhody</h4>
                <ul>${engine.disadvantages.map(d => `<li>${d}</li>`).join("")}</ul>
            `;

            // Připojit kliknutí na kartu
            card.addEventListener("click", () => showEngineDetails(engine));

            container.appendChild(card);
        });
    }

    function showEngineDetails(engine) {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position:fixed;top:0;left:0;width:100%;height:100%;
            background:rgba(0,0,0,0.85);display:flex;
            align-items:center;justify-content:center;z-index:1000;
        `;

        const detailBox = document.createElement("div");
        detailBox.style.cssText = `
            background:#111;color:#eee;padding:30px;border-radius:12px;
            max-width:700px;width:90%;max-height:80%;overflow-y:auto;position:relative;
        `;

        detailBox.innerHTML = `
            <h2>${engine.name}</h2>
            <img src="${engine.logo}" alt="${engine.name}" style="width:100px;margin-bottom:15px;">
            <p>${engine.details}</p>
            <p><strong>Oficiální web:</strong> 
               <a href="${engine.officialSite}" target="_blank" style="color:#0af;">${engine.officialSite}</a>
            </p>
            <button id="closeDetail" style="
                position:absolute;top:15px;right:15px;
                background:#0af;color:#111;border:none;padding:8px 12px;
                border-radius:6px;cursor:pointer;
            ">Zavřít</button>
        `;

        overlay.appendChild(detailBox);
        document.body.appendChild(overlay);

        document.getElementById("closeDetail").addEventListener("click", () => {
            document.body.removeChild(overlay);
        });
    }

    // Tabulka
    function loadTable(engines) {
        const tbody = document.getElementById("tableBody");
        tbody.innerHTML = engines.map(e => `
            <tr>
                <td>${e.name}</td>
                <td>${e.language}</td>
                <td>${e.price}</td>
                <td>${e.platforms}</td>
            </tr>
        `).join("");

        const filterInput = document.getElementById("filterInput");
        filterInput.addEventListener("keyup", () => {
            const val = filterInput.value.toLowerCase();
            tbody.querySelectorAll("tr").forEach(row => {
                row.style.display = row.cells[0].textContent.toLowerCase().includes(val) ? "" : "none";
            });
        });
    }

    // Doporučení
    function setupRecommendation(engines) {
        const container = document.getElementById("engine-container");
        container.addEventListener("click", e => {
            const card = e.target.closest(".engine-card");
            if (!card) return;
            const name = card.querySelector("h3").textContent;
            const engine = engines.find(en => en.name === name);
            if (engine) {
                document.getElementById("recommendation-text").innerText = 
                    `Doporučení: ${engine.name} je ideální pro: ${engine.idealFor}.`;
            }
        });
    }

    // Formulář
    const form = document.getElementById("contactForm");
    const responseEl = document.getElementById("formResponse");
    form.addEventListener("submit", e => {
        e.preventDefault();
        responseEl.textContent = "";
        const formData = Object.fromEntries(new FormData(form).entries());

        fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            responseEl.textContent = data.message;
            responseEl.style.color = "lime";
            form.reset();
        })
        .catch(err => {
            console.error(err);
            responseEl.textContent = "Chyba při odesílání formuláře.";
            responseEl.style.color = "red";
        });
    });

});
