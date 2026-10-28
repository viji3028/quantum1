/* =====================================================
   QUANTUMGUARD
   Frontend Quantum Security Simulator
===================================================== */


/* ---------- GLOBAL STATE ---------- */

let latestResult = null;

let simulationHistory =
    JSON.parse(
        localStorage.getItem(
            "quantumguard_history"
        )
    ) || [];

let runNumber =
    simulationHistory.length + 1;


/* ---------- ELEMENT HELPERS ---------- */

const $ = (id) =>
    document.getElementById(id);


/* ---------- NAVIGATION ---------- */

const navButtons =
    document.querySelectorAll(
        ".nav-btn"
    );

const quickCards =
    document.querySelectorAll(
        ".quick-card"
    );

const sections =
    document.querySelectorAll(
        ".section"
    );


function showSection(sectionId) {

    sections.forEach(section => {

        section.classList.remove(
            "active"
        );

    });


    const target =
        $(sectionId);

    if (target) {

        target.classList.add(
            "active"
        );

    }


    navButtons.forEach(button => {

        button.classList.remove(
            "active"
        );

        if (
            button.dataset.section ===
            sectionId
        ) {

            button.classList.add(
                "active"
            );

        }

    });


    const titles = {

        dashboard:
            "Quantum Security Dashboard",

        simulation:
            "Quantum Channel Simulation",

        scenarios:
            "Security Attack Lab",

        results:
            "Quantum Security Analysis",

        history:
            "Simulation History"

    };


    const subtitles = {

        dashboard:
            "Quantum entanglement-based intrusion detection",

        simulation:
            "Configure and simulate a quantum communication channel",

        scenarios:
            "Test predefined quantum security conditions",

        results:
            "Analyze QBER, CHSH and decoherence",

        history:
            "Review previous simulation results"

    };


    $("pageTitle").textContent =
        titles[sectionId];

    $("pageSubtitle").textContent =
        subtitles[sectionId];


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


navButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            showSection(
                button.dataset.section
            );

        }
    );

});


quickCards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const section =
                card.dataset.section;

            if (section) {

                showSection(section);

            }

        }
    );

});


$("startSimulationBtn")
    .addEventListener(
        "click",
        () => {

            showSection(
                "simulation"
            );

        }
    );


$("mysteryQuick")
    .addEventListener(
        "click",
        () => {

            runScenario("mystery");

        }
    );


/* ---------- RANGE CONTROLS ---------- */

$("photonPairs")
    .addEventListener(
        "input",
        e => {

            $("photonValue")
                .textContent =
                e.target.value;

        }
    );


$("noise")
    .addEventListener(
        "input",
        e => {

            $("noiseValue")
                .textContent =
                e.target.value + "%";

        }
    );


$("threshold")
    .addEventListener(
        "input",
        e => {

            $("thresholdValue")
                .textContent =
                e.target.value + "%";

            $("thresholdText")
                .textContent =
                "Threshold: " +
                e.target.value +
                "%";

        }
    );


$("interceptRate")
    .addEventListener(
        "input",
        e => {

            $("interceptValue")
                .textContent =
                e.target.value + "%";

        }
    );


$("eveToggle")
    .addEventListener(
        "change",
        e => {

            $("interceptGroup")
                .style.display =
                e.target.checked
                    ? "block"
                    : "none";

            $("liveEve")
                .classList.toggle(
                    "active",
                    e.target.checked
                );

            $("eveNode")
                .style.opacity =
                e.target.checked
                    ? "1"
                    : "0.55";

        }
    );


/* ---------- RANDOM NUMBER ---------- */

function randomNumber(
    min,
    max
) {

    return Math.random()
        * (max - min)
        + min;

}


/* ---------- QUANTUM SIMULATION ---------- */

function runSimulation(
    customConfig = null
) {

    const config =
        customConfig || {

            photons:
                Number(
                    $("photonPairs")
                        .value
                ),

            noise:
                Number(
                    $("noise")
                        .value
                ),

            threshold:
                Number(
                    $("threshold")
                        .value
                ),

            eve:
                $("eveToggle")
                    .checked,

            interceptRate:
                Number(
                    $("interceptRate")
                        .value
                )

        };


    const total =
        config.photons;


    let noiseErrors = 0;

    let eveErrors = 0;


    /* ---------------------------
       CHANNEL NOISE
    --------------------------- */

    for (
        let i = 0;
        i < total;
        i++
    ) {

        if (
            Math.random()
            <
            config.noise / 100
        ) {

            noiseErrors++;

        }

    }


    /* ---------------------------
       EVE ATTACK
    --------------------------- */

    if (config.eve) {

        for (
            let i = 0;
            i < total;
            i++
        ) {

            if (
                Math.random()
                <
                (
                    config.interceptRate
                    / 100
                )
            ) {

                /*
                    Simplified intercept-resend
                    disturbance model.

                    Approximate probability
                    of introducing an error.
                */

                if (
                    Math.random()
                    < 0.25
                ) {

                    eveErrors++;

                }

            }

        }

    }


    /*
        Prevent impossible
        error count.
    */

    const errors =
        Math.min(
            total,
            noiseErrors +
            eveErrors
        );


    const qber =
        (
            errors /
            total
        ) * 100;


    /* ---------------------------
       CHSH ESTIMATION
    --------------------------- */

    /*
        Ideal entangled state:

        CHSH ≈ 2.82

        As disturbance increases,
        Bell correlation decreases.
    */

    let chsh =
        2.82 -
        (
            qber * 0.055
        );


    chsh =
        Math.max(
            1.0,
            Math.min(
                2.82,
                chsh
            )
        );


    chsh =
        Number(
            chsh.toFixed(2)
        );


    /* ---------------------------
       DECOHERENCE
    --------------------------- */

    let decoherence;

    if (
        qber < 5
    ) {

        decoherence = "LOW";

    }
    else if (
        qber < config.threshold
    ) {

        decoherence = "MEDIUM";

    }
    else {

        decoherence = "HIGH";

    }


    /* ---------------------------
       SECURITY STATUS
    --------------------------- */

    let status;

    if (
        qber >=
        config.threshold
    ) {

        status =
            "INTRUSION DETECTED";

    }
    else if (
        qber >=
        config.threshold * 0.7
    ) {

        status =
            "SUSPICIOUS";

    }
    else {

        status =
            "SAFE";

    }


    return {

        run:
            runNumber,

        timestamp:
            new Date()
                .toLocaleString(),

        photons:
            total,

        noise:
            config.noise,

        eve:
            config.eve,

        interceptRate:
            config.interceptRate,

        errors,

        qber:
            Number(
                qber.toFixed(2)
            ),

        threshold:
            config.threshold,

        chsh,

        decoherence,

        status

    };

}


/* ---------- RUN BUTTON ---------- */

$("runBtn")
    .addEventListener(
        "click",
        () => {

            const button =
                $("runBtn");

            button.disabled = true;

            button.textContent =
                "⚛ Simulating Quantum Channel...";


            startTransmissionAnimation(
                () => {

                    latestResult =
                        runSimulation();


                    runNumber++;


                    saveHistory(
                        latestResult
                    );


                    updateUI(
                        latestResult
                    );


                    showSection(
                        "results"
                    );


                    button.disabled = false;

                    button.textContent =
                        "⚛ Run Quantum Simulation";


                    showToast(
                        "Quantum simulation completed"
                    );

                }
            );

        }
    );


/* ---------- ANIMATION ---------- */

function startTransmissionAnimation(
    callback
) {

    $("liveStatus")
        .textContent =
        "TRANSMITTING";

    $("channelStatus")
        .textContent =
        "ACTIVE";

    $("liveText")
        .textContent =
        "Entangled photons are travelling through the channel...";


    $("progressBar")
        .style.width =
        "0%";


    $("progressPercent")
        .textContent =
        "0%";


    let progress = 0;


    const interval =
        setInterval(
            () => {

                progress +=
                    randomNumber(
                        7,
                        15
                    );


                if (
                    progress >= 100
                ) {

                    progress = 100;

                }


                $("progressBar")
                    .style.width =
                    progress + "%";


                $("progressPercent")
                    .textContent =
                    Math.round(
                        progress
                    ) + "%";


                createPhoton(
                    "photonContainer"
                );

                createPhoton(
                    "photonContainer2"
                );


                if (
                    progress >= 100
                ) {

                    clearInterval(
                        interval
                    );


                    $("liveStatus")
                        .textContent =
                        "COMPLETE";

                    $("channelStatus")
                        .textContent =
                        "COMPLETE";

                    $("liveText")
                        .textContent =
                        "Transmission completed. Analyzing quantum state...";


                    setTimeout(
                        callback,
                        500
                    );

                }

            },
            180
        );

}


/* ---------- PHOTON ANIMATION ---------- */

function createPhoton(
    containerId
) {

    const container =
        $(containerId);

    if (!container) {
        return;
    }


    const photon =
        document.createElement(
            "div"
        );


    photon.className =
        "photon";


    photon.style.left =
        "0";


    container.appendChild(
        photon
    );


    setTimeout(
        () => {

            photon.remove();

        },
        1800
    );

}


/* ---------- UPDATE UI ---------- */

function updateUI(result) {

    const qber =
        result.qber;


    /* DASHBOARD */

    $("dashQber")
        .textContent =
        qber.toFixed(1) +
        "%";


    $("dashQberText")
        .textContent =
        result.errors +
        " errors / " +
        result.photons +
        " measurements";


    $("dashChsh")
        .textContent =
        result.chsh;


    $("dashDecoherence")
        .textContent =
        result.decoherence;


    $("dashSecurity")
        .textContent =
        result.status;


    $("dashSecurityText")
        .textContent =
        result.eve
            ? "Eve attack model enabled"
            : "No active eavesdropper";


    /* RESULTS */

    $("resultQber")
        .textContent =
        qber.toFixed(1) +
        "%";


    $("resultChsh")
        .textContent =
        result.chsh;


    $("resultDecoherence")
        .textContent =
        result.decoherence;


    $("resultErrors")
        .textContent =
        result.errors;


    $("resultTotal")
        .textContent =
        "out of " +
        result.photons +
        " measurements";


    $("thresholdText")
        .textContent =
        "Threshold: " +
        result.threshold +
        "%";


    /* QBER BAR */

    const qberWidth =
        Math.min(
            100,
            (
                qber /
                30
            ) * 100
        );


    $("thresholdFill")
        .style.width =
        qberWidth + "%";


    if (
        result.status ===
        "INTRUSION DETECTED"
    ) {

        $("thresholdFill")
            .style.background =
            "#ef4444";

    }
    else if (
        result.status ===
        "SUSPICIOUS"
    ) {

        $("thresholdFill")
            .style.background =
            "#facc15";

    }
    else {

        $("thresholdFill")
            .style.background =
            "#22c55e";

    }


    /* RESULT BADGE */

    $("resultBadge")
        .textContent =
        result.status;


    /* ALERT */

    updateAlert(
        result
    );


    /* CHART */

    updateChart(
        result
    );

}


/* ---------- ALERT ---------- */

function updateAlert(result) {

    const icon =
        $("alertIcon");


    if (
        result.status ===
        "INTRUSION DETECTED"
    ) {

        icon.textContent = "⚠";

        icon.style.background =
            "rgba(239,68,68,0.12)";

        icon.style.color =
            "#fca5a5";


        $("alertTitle")
            .textContent =
            "Intrusion Detected";


        $("alertDescription")
            .textContent =
            "The measured error rate is above the configured security threshold.";

        $("recommendationText")
            .textContent =
            "Abort or isolate the affected quantum key exchange and investigate the channel for an eavesdropping event.";

    }
    else if (
        result.status ===
        "SUSPICIOUS"
    ) {

        icon.textContent = "?";

        icon.style.background =
            "rgba(250,204,21,0.12)";

        icon.style.color =
            "#fde68a";


        $("alertTitle")
            .textContent =
            "Suspicious Channel";


        $("alertDescription")
            .textContent =
            "The error rate is approaching the configured security threshold.";


        $("recommendationText")
            .textContent =
            "Increase the number of measurements and inspect channel noise before accepting the generated key.";

    }
    else {

        icon.textContent = "✓";

        icon.style.background =
            "rgba(34,197,94,0.1)";

        icon.style.color =
            "#86efac";


        $("alertTitle")
            .textContent =
            "Channel Appears Safe";


        $("alertDescription")
            .textContent =
            "The observed error rate is below the configured threshold.";


        $("recommendationText")
            .textContent =
            "Continue monitoring the channel and periodically repeat the measurement to detect changes.";

    }

}


/* ---------- CHART ---------- */

let qberChart = null;


function updateChart(result) {

    const canvas =
        $("qberChart");

    if (!canvas) {
        return;
    }


    if (qberChart) {

        qberChart.destroy();

    }


    qberChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: [
                        "0%",
                        "10%",
                        "20%",
                        "30%",
                        "40%",
                        "50%",
                        "60%",
                        "70%",
                        "80%",
                        "90%",
                        "100%"
                    ],

                    datasets: [

                        {

                            label:
                                "Simulated QBER Trend",

                            data:
                                createTrend(
                                    result
                                ),

                            borderWidth: 2,

                            tension: 0.35,

                            fill: false

                        },

                        {

                            label:
                                "Security Threshold",

                            data:
                                Array(
                                    11
                                ).fill(
                                    result.threshold
                                ),

                            borderDash:
                                [6, 6],

                            borderWidth: 2,

                            pointRadius: 0,

                            fill: false

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    "#cbd5e1",

                                font: {
                                    size: 10
                                }

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {
                                color:
                                    "#64748b",

                                font: {
                                    size: 9
                                }
                            },

                            grid: {
                                color:
                                    "rgba(255,255,255,0.04)"
                            }

                        },

                        y: {

                            beginAtZero: true,

                            suggestedMax: 30,

                            ticks: {
                                color:
                                    "#64748b",

                                font: {
                                    size: 9
                                }
                            },

                            grid: {
                                color:
                                    "rgba(255,255,255,0.04)"
                            }

                        }

                    }

                }

            }
        );

}


function createTrend(result) {

    const points = [];


    for (
        let i = 0;
        i <= 10;
        i++
    ) {

        const factor =
            i / 10;


        const value =
            (
                result.qber *
                (
                    0.3 +
                    factor * 0.7
                )
            );


        points.push(
            Number(
                value.toFixed(2)
            )
        );

    }


    return points;

}


/* ---------- SCENARIOS ---------- */

document
    .querySelectorAll(
        ".scenario-card"
    )
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                runScenario(
                    card.dataset.scenario
                );

            }
        );

    });


function runScenario(
    type
) {

    let config;


    if (
        type === "safe"
    ) {

        config = {

            photons: 1500,

            noise: 1,

            threshold: 11,

            eve: false,

            interceptRate: 0

        };

    }


    else if (
        type === "noise"
    ) {

        config = {

            photons: 1500,

            noise: 8,

            threshold: 11,

            eve: false,

            interceptRate: 0

        };

    }


    else if (
        type === "light"
    ) {

        config = {

            photons: 1500,

            noise: 2,

            threshold: 11,

            eve: true,

            interceptRate: 35

        };

    }


    else if (
        type === "heavy"
    ) {

        config = {

            photons: 1500,

            noise: 2,

            threshold: 11,

            eve: true,

            interceptRate: 90

        };

    }


    else if (
        type === "mystery"
    ) {

        /*
            Hidden Eve state.

            User does not know whether
            Eve exists.
        */

        const hiddenEve =
            Math.random() >
            0.45;


        config = {

            photons: 1800,

            noise:
                hiddenEve
                    ? randomNumber(
                        2,
                        5
                    )
                    : randomNumber(
                        1,
                        6
                    ),

            threshold: 11,

            eve:
                hiddenEve,

            interceptRate:
                hiddenEve
                    ? randomNumber(
                        30,
                        80
                    )
                    : 0

        };

    }


    /* Update form */

    $("photonPairs")
        .value =
        config.photons;

    $("photonValue")
        .textContent =
        config.photons;


    $("noise")
        .value =
        config.noise;

    $("noiseValue")
        .textContent =
        config.noise +
        "%";


    $("threshold")
        .value =
        config.threshold;

    $("thresholdValue")
        .textContent =
        config.threshold +
        "%";


    $("eveToggle")
        .checked =
        config.eve;


    $("interceptRate")
        .value =
        config.interceptRate;

    $("interceptValue")
        .textContent =
        Math.round(
            config.interceptRate
        ) +
        "%";


    $("interceptGroup")
        .style.display =
        config.eve
            ? "block"
            : "none";


    $("liveEve")
        .classList.toggle(
            "active",
            config.eve
        );


    /* Go simulation */

    showSection(
        "simulation"
    );


    $("runBtn").disabled = true;

    $("runBtn").textContent =
        "⚛ Running Scenario...";


    startTransmissionAnimation(
        () => {

            latestResult =
                runSimulation(
                    config
                );


            runNumber++;


            saveHistory(
                latestResult
            );


            updateUI(
                latestResult
            );


            showSection(
                "results"
            );


            $("runBtn").disabled =
                false;


            $("runBtn").textContent =
                "⚛ Run Quantum Simulation";


            if (
                type === "mystery"
            ) {

                setTimeout(
                    () => {

                        showToast(
                            latestResult.eve
                                ? "Mystery solved: hidden Eve detected"
                                : "Mystery solved: no intruder detected"
                        );

                    },
                    500
                );

            }
            else {

                showToast(
                    "Scenario completed"
                );

            }

        }
    );

}


/* ---------- HISTORY ---------- */

function saveHistory(
    result
) {

    simulationHistory.unshift(
        result
    );


    simulationHistory =
        simulationHistory.slice(
            0,
            20
        );


    localStorage.setItem(
        "quantumguard_history",
        JSON.stringify(
            simulationHistory
        )
    );


    renderHistory();

}


function renderHistory() {

    const body =
        $("historyBody");


    body.innerHTML = "";


    if (
        simulationHistory.length === 0
    ) {

        body.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center;color:#64748b;">
                    No simulation history yet.
                </td>
            </tr>
        `;

        return;

    }


    simulationHistory
        .forEach(
            result => {

                let statusClass =
                    "status-safe";


                if (
                    result.status ===
                    "INTRUSION DETECTED"
                ) {

                    statusClass =
                        "status-alert";

                }
                else if (
                    result.status ===
                    "SUSPICIOUS"
                ) {

                    statusClass =
                        "status-warning";

                }


                body.innerHTML += `

                    <tr>

                        <td>
                            #${result.run}
                        </td>

                        <td>
                            ${result.photons}
                        </td>

                        <td>
                            ${result.noise}%
                        </td>

                        <td>
                            ${
                                result.eve
                                    ? "YES"
                                    : "NO"
                            }
                        </td>

                        <td>
                            ${result.qber}%
                        </td>

                        <td>
                            ${result.chsh}
                        </td>

                        <td>

                            <span
                                class="status-pill ${statusClass}"
                            >
                                ${result.status}
                            </span>

                        </td>

                    </tr>

                `;

            }
        );

}


/* ---------- CLEAR HISTORY ---------- */

$("clearHistoryBtn")
    .addEventListener(
        "click",
        () => {

            simulationHistory = [];

            localStorage.removeItem(
                "quantumguard_history"
            );

            runNumber = 1;

            renderHistory();

            showToast(
                "Simulation history cleared"
            );

        }
    );


/* ---------- RESET ---------- */

$("resetBtn")
    .addEventListener(
        "click",
        () => {

            $("photonPairs")
                .value = 1000;

            $("photonValue")
                .textContent = 1000;


            $("noise")
                .value = 2;

            $("noiseValue")
                .textContent = "2%";


            $("threshold")
                .value = 11;

            $("thresholdValue")
                .textContent = "11%";


            $("eveToggle")
                .checked = false;


            $("interceptGroup")
                .style.display = "none";


            $("interceptRate")
                .value = 40;

            $("interceptValue")
                .textContent = "40%";


            $("liveEve")
                .classList.remove(
                    "active"
                );


            showSection(
                "dashboard"
            );


            showToast(
                "Simulation settings reset"
            );

        }
    );


/* ---------- TOAST ---------- */

function showToast(
    message
) {

    const toast =
        $("toast");


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* ---------- INITIALIZE ---------- */

renderHistory();

showSection(
    "dashboard"
);