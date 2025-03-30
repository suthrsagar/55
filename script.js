document.addEventListener("DOMContentLoaded", function () {
    let timerElement = document.getElementById("timer");
    let periodElement = document.getElementById("periodID");
    let walletBalanceElement = document.getElementById("walletBalance");
    let betList = document.getElementById("betList");

    // Load Data from LocalStorage
    let periodID = localStorage.getItem("periodID") ? parseInt(localStorage.getItem("periodID")) : 1;
    let walletBalance = localStorage.getItem("walletBalance") ? parseInt(localStorage.getItem("walletBalance")) : 1000;
    let userBets = JSON.parse(localStorage.getItem("userBets")) || [];

    periodElement.textContent = periodID;
    walletBalanceElement.textContent = walletBalance;
    updateBetList();

    let timeLeft = 30;

    function startTimer() {
        setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
            } else {
                timeLeft = 30;
                periodID++;
                periodElement.textContent = periodID;
                localStorage.setItem("periodID", periodID);
                userBets = [];
                localStorage.setItem("userBets", JSON.stringify(userBets));
                updateBetList();
            }
            timerElement.textContent = timeLeft;
        }, 1000);
    }

    startTimer(); // Timer को Start करने के लिए Function Call करें

    function placeBet(color) {
        let betAmount = parseInt(document.getElementById("betAmount").value);

        if (!betAmount || betAmount < 10) {
            alert("Minimum Bet ₹10 होना चाहिए!");
            return;
        }

        if (walletBalance < betAmount) {
            alert("आपके पास पर्याप्त Balance नहीं है!");
            return;
        }

        // Wallet से Amount घटाएँ
        walletBalance -= betAmount;
        walletBalanceElement.textContent = walletBalance;
        localStorage.setItem("walletBalance", walletBalance);

        // Bet History में Add करें
        userBets.push({ period: periodID, color, amount: betAmount });
        localStorage.setItem("userBets", JSON.stringify(userBets));
        updateBetList();

        alert(`आपने ${color.toUpperCase()} पर ₹${betAmount} की Bet लगाई!`);
    }

    function updateBetList() {
        betList.innerHTML = "";
        userBets.forEach(bet => {
            let betSpan = document.createElement("span");
            betSpan.classList.add("bet", bet.color);
            betSpan.textContent = bet.period;
            betList.appendChild(betSpan);
        });
    }
});
function startTimer() {
    console.log("Timer Running"); // Debugging Log
    setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
        } else {
            timeLeft = 30;
            periodID++;
            periodElement.textContent = periodID;
            localStorage.setItem("periodID", periodID);
            userBets = [];
            localStorage.setItem("userBets", JSON.stringify(userBets));
            updateBetList();
        }
        timerElement.textContent = timeLeft;
    }, 1000);
}
