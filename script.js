let currentPage = 1;
const totalPages = 604; // Total number of pages in the Quran (Warsh version)
const pageLeft = document.getElementById("page-left");
const pageRight = document.getElementById("page-right");
const progressFill = document.getElementById("progress-fill");

let surahList = [];

// Fetch Surah list and store it for searching
const fetchSurahList = async () => {
    try {
        const response = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await response.json();
        surahList = data.data;

        // Populate Surah dropdown
        surahList.forEach(surah => {
            const option = document.createElement("option");
            option.value = surah.number;
            option.textContent = `${surah.number}. ${surah.name}`;
            surahSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching Surah list:', error);
    }
};

// Fetch Surah by ID
const fetchSurah = async (surahId) => {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/warsh`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching Surah data:', error);
    }
};

// Update page content by Surah number
const updatePageContentBySurah = async (surahId) => {
    const surah = await fetchSurah(surahId);
    pageLeft.innerHTML = surah.ayahs.map(ayah => `<p>${ayah.text}</p>`).join('');
    pageRight.innerHTML = "";
    progressFill.style.width = `${(surahId / surahList.length) * 100}%`;
};

// Flip the pages dynamically
const flipPage = (direction) => {
    if (direction === 'next') {
        pageLeft.classList.add('page-flip-left');
        pageRight.classList.add('page-flip-right');
    } else if (direction === 'prev') {
        pageLeft.classList.add('page-flip-right');
        pageRight.classList.add('page-flip-left');
    }
    setTimeout(() => {
        pageLeft.classList.remove('page-flip-left');
        pageRight.classList.remove('page-flip-right');
    }, 1000); // Remove flip classes after the animation duration
};

// Event listeners for page navigation
document.getElementById("prev-button").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        flipPage('prev');
        updatePageContent(currentPage);
    }
});

document.getElementById("next-button").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        flipPage('next');
        updatePageContent(currentPage);
    }
});

// Load Surah List and Progress
fetchSurahList();
