document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("top-search");
  searchForm.onsubmit = (ev) => {
    console.log("submitted top-search with", ev);
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const queryText = formData.get("query");
    console.log("queryText", queryText);

    const SynonymsResultsPromise = getSynonyms(queryText);
    SynonymsResultsPromise.then((SynonymsResults) => {
      const SynonymsListItemsArray = SynonymsResults.map(synonymObj2DOMObj);
      console.log("SynonymsListItemsArray", SynonymsListItemsArray);
      const SynonymsResultsUL = document.getElementById("Synonyms-results");
      SynonymsListItemsArray.forEach((SynonymsLi) => {
        SynonymsResultsUL.appendChild(SynonymsLi);
      });
    });
  };

  const getSynonyms = (word) => {
    console.log("attempting to get synonyms for", word);
    return fetch(`https://api.datamuse.com/words?rel_syn=${word}`).then((resp) => resp.json());
  };

  const synonymObj2DOMObj = (synonymObj) => {
    const synonymListItem = document.createElement("li");
    const synonymButton = document.createElement("button");
    synonymButton.textContent = synonymObj.word;
    synonymButton.onclick = searchForJoke;
    synonymListItem.appendChild(synonymButton);
    return synonymListItem;
  };

  const searchForJoke = (ev) => {
    const word = ev.target.textContent;
    console.log("search for", word);
    fetch(`https://dad-jokes.p.rapidapi.com/joke/search?term=${word}`, {
      headers: {
        'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com',
        'X-RapidAPI-Key': '483b3c6ddbmsh4c8f25649e5002ep180cc6jsn1689a6a07ccf'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        console.table(data.body); // This will display the "body" array in a table format in the console.
        console.table(data.body[0]);
        if (data.body[0]) {
          const joke = {
            setup: data.body[0]['setup'],
            punchline: data.body[0]['punchline']
          };
        
          // Create a new element to display the joke
          const jokeElement = document.createElement('div');
          jokeElement.classList.add('joke');
          jokeElement.innerHTML = `
            <h2>${joke.setup}</h2>
            <p>${joke.punchline}</p>
          `;
        
          // Add the new element to the joke-results section
          const jokeResults = document.querySelector('#joke-results');
          jokeResults.appendChild(jokeElement);
        } else {
          console.log('No jokes found for this term');
        }

      })
      .catch(error => console.error(error));

  };


});

