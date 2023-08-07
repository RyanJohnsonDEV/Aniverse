import { useState, useEffect } from 'react';
import classes from './AnimeSearch.module.css';
import placeholderImage from '../assets/placeholder.jpg';
import { useNavigate } from 'react-router-dom';
import NavbarHome from '../components/NavbarHome';

function AnimeSearch() {
  const [searchInput, setSearchInput] = useState('');
  const [searchedString, setSearchedString] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const navigate = useNavigate();

  function inputOnChangeHandler(event) {
    setSearchInput(event.target.value);
  }

  async function searchAnime(event) {
    event.preventDefault();
    const res = await fetch(
      `https://kitsu.io/api/edge/anime?filter[text]=${searchInput}`
    );
    const result = await res.json();
    setAnimeList(result.data);
    console.log(result.data);
    window.localStorage.setItem('animeList', JSON.stringify(result.data));
    setSearchedString(searchInput);
  }

  useEffect(() => {
    if (window.localStorage.getItem('animeList')) {
      setAnimeList(JSON.parse(window.localStorage.getItem('animeList')));
    }
  }, []);

  const renderAnimeList = animeList
    .sort((a, b) => {
      if (
        a.attributes.canonicalTitle
          .toLowerCase()
          .includes(searchedString.toLowerCase()) ||
        (a.attributes.titles.en !== undefined &&
          a.attributes.titles.en
            .toLowerCase()
            .includes(searchedString.toLowerCase()))
      ) {
        return b.attributes.userCount - a.attributes.userCount;
      } else {
        return 1;
      }
    })
    .map((anime) => {
      const posterImage = anime.attributes.posterImage;
      return (
        <div
          key={anime.id}
          style={{
            backgroundImage:
              posterImage !== null
                ? `url(${anime.attributes.posterImage.large})`
                : `url(${placeholderImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
          className={classes.anime}
          onClick={() => {
            navigate(anime.id);
          }}
        >
          <div className={classes.animeHeader}>
            <h2 className={classes.animeType}>
              {anime.attributes.showType[0].toUpperCase() +
                anime.attributes.showType.substring(1)}
            </h2>
            <h2 className={classes.animeScore}>
              {Number(anime.attributes.averageRating) !== 0 ? (
                <div>
                  Score:{' '}
                  <span
                    className={classes.score}
                    style={{
                      backgroundPositionX: anime.attributes.averageRating + '%',
                    }}
                  >
                    {(Number(anime.attributes.averageRating) / 10).toFixed(2)}
                  </span>
                </div>
              ) : (
                'No Score'
              )}
            </h2>
          </div>
          <div className={classes.animeFooter}>
            <h2 className={classes.animeTitle}>
              {anime.attributes.canonicalTitle}
            </h2>
            <p className={classes.animeDesc}>
              {anime.attributes.description !== ''
                ? anime.attributes.description
                : 'No description available.'}
            </p>
          </div>
        </div>
      );
    });

  return (
    <>
      <div>
        <NavbarHome />
      </div>
      <div className={classes.body}>
        <div className={classes.searchWrapper}>
          <div className={classes.search}>
            <form className={classes.searchInput} onSubmit={searchAnime}>
              <input
                type="text"
                onChange={inputOnChangeHandler}
                placeholder="Enter anime title..."
              />
              <button className={classes.searchButton}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
        </div>

        <div className={classes.animeList}>
          {animeList.length !== 0 && renderAnimeList}
        </div>
      </div>
    </>
  );
}

export default AnimeSearch;
