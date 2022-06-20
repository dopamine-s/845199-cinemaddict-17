export const adaptMovieToClient = (movie) => {
  const adaptedMovie = {
    id: movie.id,
    comments: movie.comments,
    filmInfo: {
      ...movie.film_info,
      ageRating: movie.film_info.age_rating,
      alternativeTitle: movie.film_info.alternative_title,
      totalRating: movie.film_info.total_rating,
      release: {
        date: movie.film_info.release.date !== null ? new Date(movie.film_info.release.date) : movie.film_info.release.date,
        releaseCountry: movie.film_info.release.release_country
      }
    },
    userDetails: {
      ...movie.user_details,
      alreadyWatched: movie.user_details.already_watched,
      watchingDate: movie.user_details.watching_date !== null ? new Date(movie.user_details.watching_date) : movie.user_details.watching_date
    }
  };

  delete adaptedMovie.filmInfo.alternative_title;
  delete adaptedMovie.filmInfo.total_rating;
  delete adaptedMovie.filmInfo.age_rating;
  delete adaptedMovie.userDetails.already_watched;
  delete adaptedMovie.userDetails.watching_date;

  return adaptedMovie;
};
