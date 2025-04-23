function toggleTheme() {
    document.body.classList.toggle("light")
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark")
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme")
    if (theme === "light") document.body.classList.add("light")
  
    // Check if we're on the calculator page
    if (document.getElementById("dob")) {
      const savedDob = localStorage.getItem("dob")
      if (savedDob) {
        document.getElementById("dob").value = savedDob
        calculateAge()
      }
    }
  })
  
  function calculateAge() {
    const dob = document.getElementById("dob").value
    if (!dob) return
  
    localStorage.setItem("dob", dob)
    const birthDate = new Date(dob)
    const today = new Date()
  
    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    let days = today.getDate() - birthDate.getDate()
  
    if (days < 0) {
      months--
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += lastMonth.getDate()
    }
  
    if (months < 0) {
      years--
      months += 12
    }
  
    animateValue("years", years)
    animateValue("months", months)
    animateValue("days", days)
    showCountdown(birthDate)
    addToHistory(dob, years, months, days)
  
    // Show birthday cake if it's the user's birthday
    const birthdayCake = document.querySelector(".birthday-cake")
    if (birthdayCake) {
      if (months === 0 && days === 0) {
        birthdayCake.style.display = "block"
      } else {
        birthdayCake.style.display = "none"
      }
    }
  }
  
  function animateValue(id, end) {
    const el = document.getElementById(id)
    if (!el) return
  
    const start = 0
    const duration = 1000
    const step = Math.max(Math.floor(duration / (end || 1)), 20)
    let startTime = null
  
    function animate(timestamp) {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const currentValue = Math.floor(progress * end)
      el.textContent = currentValue
  
      if (progress < 1) {
        window.requestAnimationFrame(animate)
      } else {
        el.textContent = end
  
        // Add animation class after the count is complete
        el.classList.add("animate__animated", "animate__heartBeat")
        setTimeout(() => {
          el.classList.remove("animate__animated", "animate__heartBeat")
        }, 1000)
      }
    }
  
    window.requestAnimationFrame(animate)
  }
  
  function showCountdown(birthDate) {
    const today = new Date()
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1)
    }
    const diff = nextBirthday - today
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    const countdown = document.getElementById("countdown")
    if (countdown) {
      countdown.textContent = `🎉 Your next birthday is in ${days} day(s)!`
      countdown.classList.add("animate__animated", "animate__fadeIn")
    }
  }
  
  function addToHistory(dob, y, m, d) {
    const history = JSON.parse(localStorage.getItem("history")) || []
    const formattedDate = new Date(dob).toLocaleDateString()
  
    // Check if this calculation already exists
    const exists = history.some(
      (item) => item.dob === formattedDate && item.years === y && item.months === m && item.days === d,
    )
  
    if (!exists) {
      history.unshift({
        dob: formattedDate,
        years: y,
        months: m,
        days: d,
        time: new Date().toLocaleString(),
      })
  
      // Keep only the last 10 calculations
      if (history.length > 10) {
        history.pop()
      }
  
      localStorage.setItem("history", JSON.stringify(history))
    }
  }
  
  