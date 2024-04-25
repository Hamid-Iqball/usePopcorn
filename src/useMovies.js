import { useState, useEffect } from "react";
//Using default exports for componet and export for custom Hooks
const KEY = "8c86df92";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setISLoading] = useState(false);
  const [error, SetError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setISLoading(true);
          SetError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching data");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          SetError(" ");
          //   console.log(data);
        } catch (err) {
          if (err.name !== "AbortError") SetError(err.message);
        } finally {
          setISLoading(false);
          SetError("");
        }
      }
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query, setMovies]
  );

  return { movies, isLoading, error, KEY };
}
