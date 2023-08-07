/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classes from './AnimeDetails.module.css';
import placeholderImage from '../assets/placeholder.jpg';
import Navbar from '../components/Navbar';

let charCount = 0;

function AnimeDetails() {
  const params = useParams();
  const [charFetched, setCharFetched] = useState(false);
  const [details, setDetails] = useState([]);
  const [charDetails, setCharDetails] = useState([]);
  const [attributes, setAttributes] = useState(null);
  const [trailerHidden, setTrailerHidden] = useState(true);
  const [charData, setCharData] = useState([]);

  function getCharacterDetails() {
    charCount = 0;
    charDetails.data.forEach(async (character) => {
      const res = await fetch(character.relationships.character.links.related);
      const data = await res.json();

      if (charCount < charDetails.data.length) {
        charCount++;
        console.log(charCount, charDetails.data.length);
        setCharData((prevData) => [...prevData, data]);
      } else {
        setCharFetched(true);
      }

      console.log(charData, 'char array');
      console.log(data, 'character data');
    });
  }

  async function getAnimeDetails() {
    const res = await fetch(`https://kitsu.io/api/edge/anime/${params.id}`);
    const data = await res.json();
    setDetails(data);
    const charRes = await fetch(
      data.data.relationships.characters.links.related
    );
    const charData = await charRes.json();
    setCharDetails(charData);
    console.log(charData);
  }

  useEffect(() => {
    getAnimeDetails();
  }, []);

  useEffect(() => {
    if (details.length !== 0) {
      setAttributes(details.data.attributes);
    }
  }, [details]);

  useEffect(() => {
    if (
      charDetails.data &&
      charDetails.data.length > 0 &&
      charFetched === false &&
      charData.length === 0
    ) {
      getCharacterDetails();
    } else if (charDetails.data && charDetails.data.length === 0) {
      setCharFetched(true);
    }
  }, [charDetails]);

  return (
    <>
      <Navbar />
      {attributes !== null && (
        <>
          <div
            className={`${classes.youtubeOverlay} ${
              trailerHidden && classes.hidden
            }`}
          >
            <div
              className={classes.youtubeOverlayBackground}
              onClick={() => {
                setTrailerHidden(true);
              }}
            />

            {trailerHidden === false && (
              <div className={classes.youtubeVideo}>
                <div
                  className={classes.trailerClose}
                  onClick={() => {
                    setTrailerHidden(true);
                  }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <iframe
                  src={`https://www.youtube.com/embed/${attributes.youtubeVideoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>
            )}
          </div>
          <div className={classes.header}>
            <img
              src={
                attributes.coverImage
                  ? attributes.coverImage.large
                  : attributes.posterImage.large
              }
              alt={attributes.canonicalTitle}
              className={classes.coverImage}
            />

            <h1 className={classes.title}>{attributes.canonicalTitle}</h1>
          </div>
          <div className={classes.animeInfo}>
            <div className={classes.animeWrapper}>
              <div className={classes.infoPanel}>
                <img
                  src={attributes.posterImage.large}
                  alt={attributes.canonicalTitle}
                />
                <div
                  className={classes.trailer}
                  onClick={() => {
                    setTrailerHidden(false);
                  }}
                >
                  <h3 className={classes.trailerTitle}>Trailer:</h3>
                  <img
                    src={`http://img.youtube.com/vi/${attributes.youtubeVideoId}/mqdefault.jpg`}
                    alt="Trailer"
                  />
                  <h1 className={classes.trailerPlay}>▶</h1>
                </div>
                <div>
                  <h3 className={classes.infoTitle}>Alternative Titles:</h3>
                  <hr />
                  <ul>
                    {' '}
                    {Object.values(attributes.titles).map((title, index) => {
                      return <li key={index}>{title}</li>;
                    })}
                  </ul>
                </div>
                <div>
                  <h3 className={classes.infoTitle}>Information:</h3>
                  <hr />
                  <p className={classes.infoTitle}>
                    <b>Type:</b>{' '}
                    {attributes.showType[0].toUpperCase() +
                      attributes.showType.substring(1)}
                  </p>
                  <p className={classes.infoTitle}>
                    <b>Episodes:</b> {attributes.episodeCount}
                  </p>
                  <p className={classes.infoTitle}>
                    <b>Status:</b>{' '}
                    {attributes.status[0].toUpperCase() +
                      attributes.status.substring(1)}
                  </p>
                  <p className={classes.infoTitle}>
                    <b>Aired:</b> {attributes.startDate} to {attributes.endDate}
                  </p>
                  <p className={classes.infoTitle}>
                    <b>Episode Length:</b> {attributes.episodeLength} min
                  </p>
                  <p className={classes.infoTitle}>
                    <b>Rating:</b> {attributes.ageRating} -{' '}
                    {attributes.ageRatingGuide}
                  </p>
                </div>
              </div>
              <div className={classes.mainPanel}>
                <div className={classes.ratingInfo}>
                  <div className={classes.score}>
                    <p className={classes.scoreHeading}>Score:</p>
                    <h1>
                      {(Number(attributes.averageRating) / 10).toFixed(2)}
                    </h1>
                    <p>{Number(attributes.userCount).toLocaleString()} users</p>
                  </div>
                  <div className={classes.ratingDetails}>
                    <h3>Ranked: #{attributes.ratingRank}</h3>
                    <h3>Popularity: #{attributes.popularityRank}</h3>
                    <h3>Favorites: {attributes.favoritesCount}</h3>
                  </div>
                </div>
                <div className={classes.infoPadding}>
                  <h3>Synopsis:</h3>
                  <p>{attributes.synopsis}</p>
                </div>
                <div className={classes.infoPadding}>
                  <h3>Characters:</h3>
                  {charData.length === 0 && charFetched === false && (
                    <p>Loading...</p>
                  )}
                  {charData.length === 0 && charFetched === true && (
                    <p>No character data available.</p>
                  )}

                  <div className={classes.characters}>
                    {charData.length !== 0 &&
                      charData.map((character, idx) => {
                        return (
                          <div key={idx} className={classes.character}>
                            <div>
                              <img
                                src={
                                  character.data.attributes.image
                                    ? character.data.attributes.image.original
                                    : placeholderImage
                                }
                                alt={character.data.attributes.name}
                              />
                            </div>

                            <div>
                              <h3>{character.data.attributes.name}</h3>
                              <p>{character.data.attributes.names.ja_jp}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AnimeDetails;
