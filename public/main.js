const postBooksButton = document.getElementById("sendButton");
const bookJSONInput = document.getElementById("jsonInput");
const responseField = document.getElementById("responseField");

postBooksButton.addEventListener("click", postBooks);

async function postBooks() {
  try {
    JSON.parse(bookJSONInput.value);
  } catch (err) {
    responseField.textContent = "Invalid JSON: " + err.message;
    return;
  }

  const res = await fetch("/api/v1/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bookJSONInput.value,
  });

  console.log(res);

  const data = await res.json();
  responseField.textContent = "Server responded: " + JSON.stringify(data);
}
