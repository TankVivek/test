const apiKey = "9234bccb";
const searchQuery = "hera pheri";

fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}`)
  .then((resolve) => {
    return resolve.json();
  })
  .then((data) => {
    var trdata = "";
    data.Search.map((e) => {
      trdata += ` <tr>
      <td>${e.Title}</td>
      <td>${e.imdbID}</td>
      <td>${e.Year}</td>
      <td>${e.Type}</td>
      <td><img height="200px" width="150px"src="${e.Poster}"></img></td>
    </tr>`;
    });
    document.getElementById("move").innerHTML = trdata;
  });
