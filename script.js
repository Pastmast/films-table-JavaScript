let editIndex = null;

const formBtn = document.getElementById('form__btn');
const updateBtn = document.getElementById('update__btn');
const cancelBtn = document.getElementById('cancel__btn');
const titleEl = document.getElementById('title');
const genreEl = document.getElementById('genre');
const releaseYearEl = document.getElementById('releaseYear');
const isWatchedEl = document.getElementById('isWatched');
const sortCriteriaSelect = document.getElementById('sort-criteria');
const sortButton = document.getElementById('sort-btn');
const filmTableBody = document.getElementById('film-tbody');

const handleFormSubmit = (e) => {
	e.preventDefault();

	if (!titleEl.value || !genreEl.value || !releaseYearEl.value) {
		return alert('Все поля должны быть заполнены');
	}

	const film = {
		title: titleEl.value,
		genre: genreEl.value,
		releaseYear: releaseYearEl.value,
		isWatched: isWatchedEl.checked,
	};

	if (editIndex !== null) {
		updateFilmInLocalStorage(film, editIndex);
		formBtn.style.display = 'block';
		updateBtn.style.display = 'none';
		cancelBtn.style.display = 'none';
		editIndex = null;
	} else {
		addFilmToLocalStorage(film);
	}

	titleEl.value = '';
	genreEl.value = '';
	releaseYearEl.value = '';
	isWatchedEl.checked = false;
};

const addFilmToLocalStorage = (film) => {
	const films = JSON.parse(localStorage.getItem('films')) || [];
	films.push(film);
	localStorage.setItem('films', JSON.stringify(films));
	renderTable();
};

const deleteFilmFromLocalStorage = (index) => {
	const films = JSON.parse(localStorage.getItem('films')) || [];
	films.splice(index, 1);
	localStorage.setItem('films', JSON.stringify(films));
	renderTable();
};

const updateFilmInLocalStorage = (film, index) => {
	const films = JSON.parse(localStorage.getItem('films')) || [];
	films[index] = film;
	localStorage.setItem('films', JSON.stringify(films));
	renderTable();
};

const handleEdit = (index) => {
	const films = JSON.parse(localStorage.getItem('films')) || [];
	const film = films[index];

	titleEl.value = film.title;
	genreEl.value = film.genre;
	releaseYearEl.value = film.releaseYear;
	isWatchedEl.checked = film.isWatched;

	formBtn.style.display = 'none';
	updateBtn.style.display = 'block';
	cancelBtn.style.display = 'block';

	editIndex = index;
};

updateBtn.addEventListener('click', () => {
	if (editIndex !== null) {
		const updatedFilm = {
			title: titleEl.value,
			genre: genreEl.value,
			releaseYear: releaseYearEl.value,
			isWatched: isWatchedEl.checked,
		};

		updateFilmInLocalStorage(updatedFilm, editIndex);

		titleEl.value = '';
		genreEl.value = '';
		releaseYearEl.value = '';
		isWatchedEl.checked = false;

		formBtn.style.display = 'block';
		updateBtn.style.display = 'none';
		cancelBtn.style.display = 'none';
		editIndex = null;
	}
});

cancelBtn.addEventListener('click', () => {
	titleEl.value = '';
	genreEl.value = '';
	releaseYearEl.value = '';
	isWatchedEl.checked = false;

	formBtn.style.display = 'block';
	updateBtn.style.display = 'none';
	cancelBtn.style.display = 'none';
	editIndex = null;
});

const renderTable = () => {
	const films = JSON.parse(localStorage.getItem('films')) || [];

	filmTableBody.innerHTML = '';

	films.forEach((film, index) => {
		const row = document.createElement('tr');
		row.innerHTML = `
				<td>${film.title}</td>
				<td>${film.genre}</td>
				<td>${film.releaseYear}</td>
				<td>${film.isWatched ? 'Да' : 'Нет'}</td>
				<td>
					<button onclick="handleEdit(${index})">Изменить</button>
					<button onclick="deleteFilmFromLocalStorage(${index})">Удалить</button>
				</td>
			`;
		filmTableBody.appendChild(row);
	});
};

document
	.querySelector('#film-form')
	.addEventListener('submit', handleFormSubmit);

sortButton.addEventListener('click', function () {
	const sortCriteria = sortCriteriaSelect.value;
	const films = JSON.parse(localStorage.getItem('films')) || [];
	const sortedFilms = films.sort((filmA, filmB) => {
		const valueA = filmA[sortCriteria].toLowerCase();
		const valueB = filmB[sortCriteria].toLowerCase();

		if (valueA < valueB) {
			return -1;
		} else if (valueA > valueB) {
			return 1;
		} else {
			return 0;
		}
	});
	localStorage.setItem('films', JSON.stringify(sortedFilms));
	renderTable();
});

renderTable();
