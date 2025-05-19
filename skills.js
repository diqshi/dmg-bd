const skills = [
    { name: "Молниеносный удар", type: "base", coeffs: [1.4, 1.45, 1.5, 1.55, 1.6], flat: [20, 40, 60, 80, 100] },
    { name: "Лезвие вихря", type: "bleed", coeffs: [0.9, 0.95, 1.0, 1.1, 1.2], bleed: [0.15, 0.2, 0.25, 0.3, 0.4] },
    { name: "Подрезать сухожилие", type: "dot", coeffs: [0.3, 0.35, 0.4, 0.45, 0.5], ticks: 3 },
    { name: "Звуковой удар", type: "dot", coeffs: [0.35, 0.4, 0.45, 0.55], ticks: 4 },
    { name: "Контратака", type: "base", coeffs: [0.25, 0.32, 0.4, 0.5] },
    { name: "Ураган ударов", type: "multi", coeffs: [0.4, 0.4, 0.45, 0.45], hits: [3, 3, 4, 5] }
];

window.onload = () => {
    const container = document.getElementById("skills-container");

    skills.forEach((skill, index) => {
        const block = document.createElement("div");
        block.className = "skill-block";

        let levelOptions = "";
        for (let i = 0; i < skill.coeffs.length; i++) {
            levelOptions += `<option value="${i}">${i + 1}</option>`;
        }

        let extraInfo = `<div class="percent-label" id="info${index}"></div>`;

        block.innerHTML = `
            <h2>${skill.name}</h2>
            <label>Уровень:</label>
            <select id="level${index}" onchange="updateInfo(${index})">${levelOptions}</select>
            ${extraInfo}
            <p>Урон без крита: <span id="base${index}">-</span></p>
            <p>С критом: <span id="crit${index}">-</span></p>
            <p>Всего урона: <span id="total${index}">-</span></p>
        `;

        container.appendChild(block);
        updateInfo(index);
    });

    document.getElementById("calculate-button").onclick = calculateAll;
};

function updateInfo(index) {
    const skill = skills[index];
    const level = parseInt(document.getElementById(`level${index}`).value);
    const infoEl = document.getElementById(`info${index}`);

    let text = "";

    switch (skill.type) {
        case "base":
            text = `Урон: ${skill.flat?.[level] || 0} + ${Math.round(skill.coeffs[level] * 100)}% от атаки`;
            break;
        case "bleed":
            text = `Физ. урон: ${Math.round(skill.coeffs[level] * 100)}% + по кровотечению ${Math.round(skill.bleed[level] * 100)}%`;
            break;
        case "dot":
            text = `Урон за тик: ${Math.round(skill.coeffs[level] * 100)}% × ${skill.ticks} тика(ов)`;
            break;
        case "multi":
            text = `Ударов: ${skill.hits[level]}, каждый на ${Math.round(skill.coeffs[level] * 100)}%`;
            break;
    }

    infoEl.textContent = text;
}

function calculateAll() {
    const atk = parseFloat(document.getElementById("attack").value) || 0;
    const extraCrit = document.getElementById("extraCrit").checked;

    skills.forEach((skill, index) => {
        const level = parseInt(document.getElementById(`level${index}`).value);
        let base = 0;

        switch (skill.type) {
            case "base":
                const flat = skill.flat ? skill.flat[level] : 0;
                base = atk * skill.coeffs[level] + flat;
                break;
            case "bleed":
                base = atk * skill.coeffs[level] + atk * skill.bleed[level];
                break;
            case "dot":
                base = atk * skill.coeffs[level] * skill.ticks;
                break;
            case "multi":
                base = atk * skill.coeffs[level] * skill.hits[level];
                break;
        }

        const critMultiplier = extraCrit ? 2.2 : 2.0;
        const crit = base * critMultiplier;

        document.getElementById(`base${index}`).textContent = base.toFixed(2);
        document.getElementById(`crit${index}`).textContent = crit.toFixed(2);
        document.getElementById(`total${index}`).textContent = base.toFixed(2);
    });
}
